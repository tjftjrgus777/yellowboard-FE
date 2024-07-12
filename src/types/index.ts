import { ResponseDto } from "apis/response";

type responseBody <T> = T | ResponseDto | null;

export type {
    responseBody,
}