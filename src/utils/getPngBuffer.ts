import sharp from "sharp";

export const getPngBuffer = async (
  svgBuffer?: ArrayBuffer,
  width = 768,
  height = 384,
  rotation = 90
): Promise<Buffer | undefined> => {
  if (!svgBuffer) return;

  try {
    const pngBuffer = await sharp(svgBuffer)
      .png()
      .rotate(rotation)
      .resize(width, height)
      .toBuffer();
    return pngBuffer;
  } catch (e) {
    console.error(e);
    return;
  }
};
