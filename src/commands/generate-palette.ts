import { EmbedBuilder, EmbedField } from "discord.js";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { ColorResult, schemaMode } from "../types";
import { getSchema } from "../api/getRandomSchema";
import { baseColorUrl } from "../api/base";

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

export async function execute(interaction: CommandInteraction) {
  const value = Math.floor(Math.random() * (max + 1));
  const hex = value.toString(16);

  const [schema, error] = await getSchema({
    hex,
    count: Number(interaction.options.get("count")?.value) || 5,
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

  console.log(schema, schema?.image.named);

  const replyEmbed = new EmbedBuilder()
    .setColor(`#${hex}`)
    .setTitle("Your palette")
    .setURL(`${baseColorUrl}${schema?._links?.self}&format=html`)
    .setThumbnail(
      `${schema?.image.named}.svg` ||
        "https://www.elegantthemes.com/blog/wp-content/uploads/2020/08/000-http-error-codes.png"
    )
    .setAuthor({
      name: interaction.user.displayName,
      iconURL:
        interaction.user.avatarURL() ||
        "https://surgassociates.com/wp-content/uploads/610-6104451_image-placeholder-png-user-profile-placeholder-image-png-1.jpg",
    })
    .setImage(`${schema?.image.bare}.svg` || "")
    .addFields(schema ? colorsToFields(schema?.colors) : [])
    .setFooter({
      text: "Made using https://www.thecolorapi.com by @joshbeckman", // The author of the api I am using
      iconURL: "https://avatars.githubusercontent.com/u/132166057?v=4",
    });

  console.log(replyEmbed);

  return await interaction.channel?.send({
    embeds: [replyEmbed],
  });
}
