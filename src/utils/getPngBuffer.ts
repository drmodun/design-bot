import sharp from "sharp";

export const getPngBuffer = async (
  svgBuffer?: ArrayBuffer
): Promise<Buffer | undefined> => {
  if (!svgBuffer) return;

  try {
    const pngBuffer = await sharp(svgBuffer)
      .png()
      .rotate(90)
      .resize(768, 384)
      .toBuffer();
    return pngBuffer;
  } catch (e) {
    return;
  }
};
