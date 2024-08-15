import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  InteractionResponse,
  Message,
  MessageType,
  SlashCommandBuilder,
} from "discord.js";
import { ColorLoversMode, ColorLoversQuery } from "../types";
import { getPalettes } from "../api/getRandomPalette";

export const data = new SlashCommandBuilder()
  .setName("palette-real")
  .setDescription(
    "Replies with an array of real palettes hosted on colorlovers.com"
  )
  .addStringOption((option) =>
    option
      .setName("count")
      .setDescription("Amount of colors in the palette (1-10), default is 5")
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName("search-mode")
      .setDescription(
        "Which kind of palettes are you looking for (random deletes all other params)"
      )
      .setChoices(
        Object.entries(ColorLoversMode).map(([key, value]) => ({
          name: key.toLowerCase().split("_").join(" "),
          value,
        }))
      )
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName("search")
      .setDescription("Search for palettes by keyword, separated by commas")
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName("hex")
      .setDescription("Search for palettes by hex code, separated by commas")
      .setRequired(false)
  );

export async function execute(
  interaction: CommandInteraction,
  action = MessageType.Reply,
  offset = 0
): Promise<InteractionResponse<boolean> | Message<boolean>> {
  try {
    const query: ColorLoversQuery = {
      mode: interaction.options.get("search-mode")?.value as ColorLoversMode,
      hex: interaction.options.get("hex")?.value as string,
      keywords: interaction.options.get("search")?.value as string,
      numResults: Number(interaction.options.get("count")?.value) || 5,
      offset,
    };

    const [palettes, error] = await getPalettes(query);

    if (!palettes) {
      console.error(error);

      throw new Error("Palette not found");
    }

    const embeds: EmbedBuilder[] = palettes.map((palette) => {
      return new EmbedBuilder()
        .setAuthor({
          name: palette.userName || "Unknown",
          iconURL:
            "https://surgassociates.com/wp-content/uploads/610-6104451_image-placeholder-png-user-profile-placeholder-image-png-1.jpg",
        })
        .setThumbnail(
          palette.badgeUrl ||
            "https://www.colorlovers.com/images/badges/love.png"
        )
        .setTitle(`Palette - ${palette.title}`)
        .setDescription(`[View on colorlovers.com](${palette.url})`)
        .setColor(`#${palette.colors[0]}`)
        .setURL(palette.url)
        .setImage(palette.imageUrl)
        .addFields(
          {
            name: "Number of views",
            value: palette.numViews.toString(),
            inline: true,
          },
          {
            name: "Number of votes",
            value: palette.numVotes.toString(),
            inline: true,
          },
          {
            name: "Number of hearts",
            value: palette.numHearts.toFixed(2).toString(),
            inline: true,
          }
        )
        .addFields(
          palette.colors.map((color, index) => ({
            name: `Color ${index + 1}`,
            value: color,
          }))
        );
    });

    const regenerateButton = new ButtonBuilder()
      .setCustomId("regenerateRealPalette")
      .setLabel("Regenerate")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      regenerateButton
    );

    const message = {
      embeds: embeds,
      components: [row],
    };

    const response =
      action == MessageType.Reply
        ? await interaction.reply(message)
        : await interaction.followUp(message);

    const filter = (i: any) =>
      i.customId === "regenerateRealPalette" &&
      i.user.id === interaction.user.id;

    const regenerate = await response.awaitMessageComponent({
      filter, // Add timer later
    });

    if (regenerate) {
      regenerate.deferUpdate();
      return query.mode === ColorLoversMode.RANDOM
        ? execute(interaction, MessageType.Default)
        : execute(interaction, MessageType.Default, offset + palettes.length);
    }

    return response.edit({
      components: [],
      content: "You did not respond in time",
    });
  } catch (error) {
    console.error(error);
    return interaction.editReply({
      content: "An error occurred while waiting for your response",
      components: [],
    });
  }
}
