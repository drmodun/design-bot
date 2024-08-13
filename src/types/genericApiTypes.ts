export type ApiCallReturnTypeResolved<
  SuccessType,
  ErrorType extends Error = Error
> = [SuccessType | null, ErrorType | null];

export type ApiCallReturnType<
  SuccessType,
  ErrorType extends Error = Error
> = Promise<ApiCallReturnTypeResolved<SuccessType, ErrorType>>;
