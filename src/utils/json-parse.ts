import { type } from "arktype";

export const jsonParse = type('string').pipe.try((s): object => JSON.parse(s));
