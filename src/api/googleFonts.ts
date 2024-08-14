import data from "./getGoogleFonts.json";

const getFirstTenFonts = () => {
  return data.slice(0, 10);
};

export const getRegularFontLink = (font: any, mode?: string) => {
  return mode
    ? font.files[mode] || font.files[Object.keys(font.files)[0]] || ""
    : font.files?.regular || font?.files[Object.keys(font.files)[0]] || "";
};

export interface FontQuery {
  n?: number;
  familyName?: string;
  subsetName?: string;
  category?: string;
  mode?: string;
}

export const getNRandomFonts = ({
  n = 5,
  familyName = "",
  subsetName = "",
  category = "",
  mode = "",
}: FontQuery) => {
  let counter = 0;
  const fonts = [];
  const eligibleFonts = data.filter((font) => {
    return (
      font.family.includes(familyName) &&
      font.subsets.join("").includes(subsetName) &&
      font.category.includes(category) &&
      font.variants.join("").includes(mode)
    );
  });

  if (eligibleFonts.length < n || n <= 0) {
    return getFirstTenFonts();
  }

  while (counter < n) {
    const randomIndex = Math.floor(Math.random() * eligibleFonts.length);
    const randomFont = eligibleFonts[randomIndex];
    fonts.push(randomFont);
    console.log(randomFont.family);
    counter++;
  }

  return fonts;
};

// It is not possible to limit the data given by google
//TODO: Maybe type this later but for now it is not necessary
