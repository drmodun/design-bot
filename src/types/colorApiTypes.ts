import { formatTypeType, schemaModeType } from "./enums";

export interface ColorApiQuery {
  hex?: string;
  rgb?: string;
  hsl?: string;
  cmyk?: string;
  mode?: schemaModeType;
  count?: number;
  format?: formatTypeType;
}

export interface Fraction<FractionType> {
  fraction: FractionType;
  value: number;
}

export interface RGBFraction extends Fraction<RGBFraction> {
  r: number;
  g: number;
  b: number;
}

export interface HSLFraction extends Fraction<HSLFraction> {
  h: number;
  s: number;
  l: number;
}

export interface CMYKFraction extends Fraction<CMYKFraction> {
  c: number;
  m: number;
  y: number;
  k: number;
}

export interface XYZFraction extends Fraction<XYZFraction> {
  x: number;
  y: number;
  z: number;
}

export interface HSVFraction extends Fraction<HSVFraction> {
  h: number;
  s: number;
  v: number;
}

export interface ColorResultHex {
  value: string;
  clean: string;
}

export interface ColorResultContrast {
  value: string;
}

export interface ColorResultImage {
  bare: string;
  named: string;
}

export interface ColorResultLinks {
  self: {
    href: string;
  };
}

export interface ColorResultName {
  value: string;
  closest_named_hex: string;
  exact_match_name: boolean;
  distance: number;
}

export interface ColorResult {
  hex: ColorResultHex;
  contrast: ColorResultContrast;
  image: ColorResultImage;
  rgb: RGBFraction;
  hsl: HSLFraction;
  name: ColorResultName;
  cmyk: CMYKFraction;
  _links: ColorResultLinks;
  xyz: XYZFraction;
  hsv: HSVFraction;
  _embedded: object;
}

type OtherSchemes = {
  [key in schemaModeType]: string;
};

export interface SchemeLinks {
  self: string;
  schemes: OtherSchemes;
}

export interface SchemeResult {
  mode: schemaModeType;
  count: number;
  colors: ColorResult[];
  seed: ColorResult;
  _links: SchemeLinks;
}

export interface BadRequestErrorResponse {
  code: number;
  message: string;
  query: object;
  params: string[];
  path: string;
  example: string;
}

export class ColorsApiError extends Error {
  constructor(public response: BadRequestErrorResponse) {
    super(response.message);
    this.name = "ColorsApiError";
    this.errorObject = response;
  }

  errorObject?: BadRequestErrorResponse;
}
