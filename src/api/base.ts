import axios from "axios";

const baseColorUrl = "https://www.thecolorapi.com";

export const colorApi = axios.create({
  baseURL: baseColorUrl,
});
