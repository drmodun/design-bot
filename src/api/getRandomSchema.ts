import {
  BadRequestErrorResponse,
  ColorApiQuery,
  ColorsApiError,
  SchemeResult,
} from "../types";
import { ApiCallReturnType } from "../types/genericApiTypes";
import { colorApi } from "./base";

export const getSchema = async (
  query: ColorApiQuery
): ApiCallReturnType<SchemeResult, Error> => {
  try {
    const response: SchemeResult | BadRequestErrorResponse = await colorApi.get<
      ColorApiQuery,
      SchemeResult | BadRequestErrorResponse
    >(`/scheme`, {
      params: query,
    });

    // The server responds with a 200 code but sends back an error object so we need to manually detect if any error ocurred

    if ("code" in response) {
      throw new ColorsApiError(response);
    }

    return [response as SchemeResult, null];
  } catch (error) {
    console.error(error);

    // Perhaps log or do other error handling here

    return [null, error as Error];
  }
};
