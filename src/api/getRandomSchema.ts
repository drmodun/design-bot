import { AxiosResponse } from "axios";
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
    const response: AxiosResponse<SchemeResult | BadRequestErrorResponse> =
      await colorApi.get<
        ColorApiQuery,
        AxiosResponse<SchemeResult | BadRequestErrorResponse>
      >(`/scheme`, {
        params: query,
      });

    const data = response.data;

    // The server responds with a 200 code but sends back an error object so we need to manually detect if any error ocurred

    if ("code" in data) {
      throw new ColorsApiError(data);
    }

    return [data as SchemeResult, null];
  } catch (error) {
    console.error(error);

    // Perhaps log or do other error handling here

    return [null, error as Error];
  }
};
