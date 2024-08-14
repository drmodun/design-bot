import {
  AttachmentBuilder,
  CommandInteraction,
  Embed,
  SlashCommandBuilder,
} from "discord.js";
import { getFontData } from "../utils/getFontData";
import { CanvasRenderingContext2D, createCanvas } from "canvas";
import { EmbedBuilder } from "@discordjs/builders";
import opentype from "opentype.js";
import { getNRandomFonts, getRegularFontLink } from "../api/googleFonts";

export const data = new SlashCommandBuilder()
  .setName("font")
  .setDescription("Generate a random font from google fonts")
  .addStringOption((option) =>
    option
      .setName("text")
      .setDescription("The text which will be rendered")
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName("family")
      .setDescription("The family of the font to generate")
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName("subset")
      .setDescription("The subset of the font to generate")
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName("count")
      .setDescription("Amount of fonts to generate (1-10), default is 5")
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName("category")
      .setDescription("The category of the font to generate")
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName("font-mode")
      .setDescription("Which font mode to use (default: regular)")
      .setRequired(false)
      .addChoices([
        {
          name: "Regular",
          value: "regular",
        },
        {
          name: "Italic",
          value: "italic",
        },
        {
          name: "Bold",
          value: "bold",
        },
        {
          name: "Bold Italic",
          value: "bolditalic",
        },
      ])
  );

export async function execute(interaction: CommandInteraction) {
  try {
    const fontQuery = getNRandomFonts({
      n: Number(interaction.options.get("count")?.value) || 5,
      familyName: interaction.options.get("family")?.value?.toString() || "",
      subsetName: interaction.options.get("subset")?.value?.toString() || "",
      category: interaction.options.get("category")?.value?.toString() || "",
      mode:
        interaction.options.get("font-mode")?.value?.toString() || "regular",
    });

    const text = interaction.options.get("Text")?.value?.toString() || "Hello";

    const fontDataPromises = fontQuery.map((font) =>
      getFontData(getRegularFontLink(font))
    );

    const fontData = await Promise.all(fontDataPromises);

    if (!fontData) {
      interaction.reply(
        "An error occurred due to bot or api issue, sorry for the inconvenience"
      );
    }

    const fontsPromises = fontData.map((data) => opentype.parse(data));
    const fonts = await Promise.all(fontsPromises);

    const paths = fonts.map((font) =>
      font.getPath(text as string, 0, 200, 100)
    );

    const embeds: EmbedBuilder[] = [];
    const attachments: AttachmentBuilder[] = [];

    paths.forEach((path, index) => {
      const canvas = createCanvas(300, 200);
      const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

      ctx.strokeStyle = "white";

      (path as any).draw(ctx);

      const buffer = canvas.toBuffer("image/png");

      const attachment = new AttachmentBuilder(buffer);

      const randomColor: number = Math.floor(Math.random() * 16777215) + 1;

      attachment.setName(`font${index}.png`);
      const replyEmbed = new EmbedBuilder()
        .setTitle(`Font - ${fontQuery[index].family}`)
        .setDescription(
          `Here is an example of the font ${fontQuery[index].family}, you can download itby clicking the title`
        ) // If index mismatches it will have to be fixed
        .setURL(getRegularFontLink(fontQuery[index]))
        .setColor(randomColor)
        .setFooter({ text: "Powered by Google Fonts" })
        .setTimestamp()
        .setAuthor({
          name: interaction.user.username,
          iconURL:
            interaction.user.avatarURL() ||
            "https://surgassociates.com/wp-content/uploads/610-6104451_image-placeholder-png-user-profile-placeholder-image-png-1.jpg",
        })
        .setImage(`attachment://font${index}.png`);

      embeds.push(replyEmbed);
      attachments.push(attachment);
    });

    //Hate doing this but my hand is forced because their own types are wrong

    return await interaction.reply({
      embeds: embeds,
      files: attachments,
    });
  } catch (error) {
    console.error(error);
    return interaction.reply(
      `An error occurred while fetching the palette, maybe your input params were wrong?`
    );
  }
}
