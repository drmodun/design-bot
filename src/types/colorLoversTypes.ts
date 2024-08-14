export interface ColorLoversPaletteResponse {
  apiUrl: string;
  url: string;
  colors: string[];
  description: string;
  numViews: number;
  numVotes: number;
  numHearts: number;
  imageUrl: string;
  title: string;
  userName: string;
  badgeUrl?: string;
}

export interface ColorLoversQuery {
  hex?: string;
  numResults?: number;
  offset?: number;
  keywords?: string;
  mode?: ColorLoversModeType;
}

export enum ColorLoversMode {
  NORMAL = "normal",
  RANDOM = "random",
  NEW = "new",
  TOP = "top",
  POPULAR = "popular",
}

export type ColorLoversModeType =
  (typeof ColorLoversMode)[keyof typeof ColorLoversMode];
