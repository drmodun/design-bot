import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  EmbedField,
} from "discord.js";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { ColorResult, schemaMode } from "../types";
import { getSchema } from "../api/getRandomSchema";
import { baseColorUrl } from "../api/base";
import { getSvgBuffer } from "../utils/getSvgBuffer";
import { getPngBuffer } from "../utils/getPngBuffer";

const max = 16777215;

const colorsToFields = (colors: ColorResult[]): EmbedField[] =>
  colors.map((color) => {
    return {
      inline: true,
      name: color.name.value,
      value: color.hex.value,
    };
  });

export const data = new SlashCommandBuilder()
  .setName("palette-gen")
  .setDescription("Replies with a random generated palette")
  .addStringOption((option) =>
    option
      .setName("count")
      .setDescription("Amount of colors in the palette (1-10), default is 5")
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName("palette-mode")
      .setDescription("Which palette mode to use (default: monochrome)")
      .setChoices(
        Object.entries(schemaMode).map(([key, value]) => ({
          name: key.toLowerCase().split("_").join(" "),
          value,
        }))
      )
      .setRequired(false)
  );

export async function execute(
  interaction: CommandInteraction,
  action: string = "reply"
) {
  const value = Math.floor(Math.random() * (max + 1));
  const hex = value.toString(16);

  if (hex.length < 6) {
    hex.padStart(6, "0".repeat(6 - hex.length));
  }

  const count = Number(interaction.options.get("count")?.value) || 5;

  const [schema, error] = await getSchema({
    hex,
    count: Math.max(Math.min(count, 10), 0),
    mode:
      (interaction.options.get("palette-mode")?.value as schemaMode) ||
      schemaMode.MONOCHROME,
  });

  if (!schema) {
    console.log(error);
    interaction.reply(
      "An error occurred due to bot or api issue, sorry for the inconvenience"
    );
  }

  if (error) {
    console.error(error);
    return interaction.reply(
      `An error occurred while fetching the palette ${error.message}, maybe your input params were wrong?`
    );
  }

  const bareImage = await getSvgBuffer(schema?.image.bare.toString());

  const bareImagePng = await getPngBuffer(bareImage);

  const bareImagePngAttachment = new AttachmentBuilder(
    bareImagePng ||
      "https://www.elegantthemes.com/blog/wp-content/uploads/2020/08/000-http-error-codes.png"
  );

  bareImagePngAttachment.setName("palette.png");

  const replyEmbed = new EmbedBuilder()
    .setColor(`#${hex}`)
    .setTitle("Your palette")
    .setDescription(
      "This is your generated palette, enjoy! You can click on the link for more details"
    )
    .setURL(`${baseColorUrl}${schema?._links?.self}&format=html`)
    .setImage("attachment://palette.png")
    .setAuthor({
      name: interaction.user.displayName,
      iconURL:
        interaction.user.avatarURL() ||
        "https://surgassociates.com/wp-content/uploads/610-6104451_image-placeholder-png-user-profile-placeholder-image-png-1.jpg",
    })
    .addFields(schema ? colorsToFields(schema?.colors) : [])
    .setFooter({
      text: "Made using https://www.thecolorapi.com by @joshbeckman", // The author of the api I am using
      iconURL: "https://avatars.githubusercontent.com/u/132166057?v=4",
    });

  const regenerateButton = new ButtonBuilder()
    .setCustomId("regenerateGenPalette")
    .setLabel("Regenerate")
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    regenerateButton
  );

  const message = {
    embeds: [replyEmbed],
    files: [bareImagePngAttachment],
    components: [row],
  };

  const response =
    action === "reply"
      ? await interaction.reply(message)
      : await interaction.followUp(message);

  const filter = (
    i: any // Again no type info
  ) =>
    i.customId === "regenerateGenPalette" && i.user.id === interaction.user.id;
  try {
    const regenerate = await response.awaitMessageComponent({
      filter,
    });

    if (regenerate) {
      regenerate.deferUpdate();
      return execute(interaction, "followUp");
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
