import { HexColorString } from "discord.js";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { formatEnum, schemaMode } from "../types";

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
          name: key,
          value,
        }))
      )
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName("palette type")

      .setDescription("Which palette type to use (default: html)")
      .setRequired(false)
      .setChoices(
        Object.entries(formatEnum).map(([key, value]) => ({
          name: key,
          value,
        }))
      )
  );

export async function execute(interaction: CommandInteraction) {
  const value: Number = Math.random() * 16777215;
  const hex: HexColorString = value.toString(16);
  return interaction.options.data;
}
