import axios from "axios";

export const baseColorUrl = "https://www.thecolorapi.com";

export const colorApi = axios.create({
  baseURL: baseColorUrl,
});
