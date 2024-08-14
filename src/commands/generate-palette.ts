import { EmbedBuilder, EmbedField } from "discord.js";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { ColorResult, schemaMode } from "../types";
import { getSchema } from "../api/getRandomSchema";
import { baseColorUrl } from "../api/base";

const colorsToFields = (colors: ColorResult[]): EmbedField[] =>
  colors.map((color) => {
    return {
      inline: true,
      name: color.name.closest_named_hex,
      value: `#${color.hex}`,
    };
  });

export const data = new SlashCommandBuilder()
  .setName("palette")
  .setDescription("Replies with a random palette")
  .addStringOption((option) =>
    option
      .setName("count")
      .setDescription("Amount of colors in the palette (1-10), default is 5")
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName("palette mode")
      .setDescription("Which palette mode to use (default: monochrome)")
      .setChoices(
        Object.entries(schemaMode).map(([key, value]) => ({
          name: key.toLowerCase().split("_").join(" "),
          value,
        }))
      )
      .setRequired(false)
  );

export async function execute(interaction: CommandInteraction) {
  const value = Math.random() * 16777215;
  const hex = value.toString(16);

  const [schema, error] = await getSchema({
    hex,
    count: Number(interaction.options.get("count")?.value) || 5,
    mode:
      (interaction.options.get("palette mode")?.value as schemaMode) ||
      schemaMode.MONOCHROME,
  });

  if (error) {
    console.error(error);
    return interaction.reply(
      `An error occurred while fetching the palette ${error.message}`
    );
  }

  const replyEmbed = new EmbedBuilder()
    .setColor(`#${hex}`)
    .setTitle("Your palette")
    .setURL(`${baseColorUrl}${schema?._links.self}$format=html`)
    .setThumbnail(schema?.image.named || "")
    .setAuthor({
      name: interaction.user.displayName,
      iconURL: interaction.user.avatar || "",
    })
    .setImage(schema?.image.bare || "")
    .addFields(schema ? colorsToFields(schema?.colors) : [])
    .setFooter({
      text: "Made using https://www.thecolorapi.com by @joshbeckman", // The author of the api I am using
      iconURL: "https://avatars.githubusercontent.com/u/132166057?v=4",
    });

  return interaction.channel?.send({
    embeds: [replyEmbed],
  });
}
