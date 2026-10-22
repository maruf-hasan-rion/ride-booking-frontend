import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axiosBaseQuery";

export const baseApiTagTypes = [
  "USER",
  "RIDE",
  "AUTH",
  "STATS",
  "DRIVER",
  "ADMIN",
] as const;

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: [...baseApiTagTypes],
  endpoints: () => ({}),
});
