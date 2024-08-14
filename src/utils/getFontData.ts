export const getFontData = async (
  url?: string
): Promise<ArrayBuffer | undefined> => {
  if (!url) return;

  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return buffer;
  } catch (e) {
    return;
  }
};
