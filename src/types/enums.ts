export enum schemaMode {
  MONOCHROME = "monochrome",
  MONOCHROME_DARK = "monochrome-dark",
  MONOCHROME_LIGHT = "monochrome-light",
  ANALOGIC = "analogic",
  ANALOGIC_COMPLEMENT = "analogic-complement",
  COMPLEMENT = "complement",
  TRIAD = "triad",
  QUAD = "quad",
}

export enum formatEnum {
  HTML = "html",
  JSON = "json",
  XML = "xml",
}

export type schemaModeType = (typeof schemaMode)[keyof typeof schemaMode];

export type formatTypeType = (typeof formatEnum)[keyof typeof formatEnum];
