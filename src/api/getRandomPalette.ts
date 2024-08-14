import axios from "axios";
import { ColorLoversPaletteResponse, ColorLoversQuery } from "../types";
import { ApiCallReturnType } from "../types/genericApiTypes";

export const getPalettes = async (
  query: ColorLoversQuery
): ApiCallReturnType<ColorLoversPaletteResponse[], Error> => {
  if (query?.numResults && query.numResults <= 0)
    return [null, new Error("numResults must be greater than 0")];

  console.log(query);

  try {
    const baseUrl = "https://www.colourlovers.com/api/palettes";
    const url = new URL(baseUrl);

    switch (query.mode) {
      case "random":
        url.href = `${baseUrl}/random&format=json`;
        break;
      case "new":
        url.href = `${baseUrl}/new&format=json`;
        break;
      case "top":
        url.href = `${baseUrl}/top&format=json`;
        break;
      case "popular":
        url.href = `${baseUrl}/&orderCol=numViews&sortBy=DESC&format=json`;
        break;
      default:
        url.href = `${baseUrl}/&format=json`;
        break;
    }

    console.log(url.href);
    url.searchParams.append("numResults", query.numResults?.toString() || "5");
    url.searchParams.append("offset", query.offset?.toString() || "0");
    url.searchParams.append("hex", query?.hex || "");
    url.searchParams.append("keywords", query?.keywords || "");

    const response = await fetch(url);

    const data = await response.json();

    if ("error" in data || !data) {
      console.error(data);
      throw new Error("Palette not found");
    }

    return [data as ColorLoversPaletteResponse[], null];
  } catch (error) {
    console.error(error);

    return [null, error as Error];
  }
};
