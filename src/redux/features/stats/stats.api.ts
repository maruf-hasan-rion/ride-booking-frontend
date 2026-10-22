import { baseApi } from "@/redux/baseApi";

type QueryParams = Record<string, string | number | boolean | undefined>;

export const statsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRiderReport: builder.query({
      query: (params: QueryParams | void) => ({
        url: "/stats/my-all-ride-history",
        method: "GET",
        params,
      }),
      providesTags: ["STATS"],
    }),
    getDriverReport: builder.query({
      query: (params: QueryParams | void) => ({
        url: "/stats/my-earning-history",
        method: "GET",
        params,
      }),
      providesTags: ["STATS"],
    }),
    getAdminReport: builder.query({
      query: (params: QueryParams | void) => ({
        url: "/stats/earning-history",
        method: "GET",
        params,
      }),
      providesTags: ["STATS"],
    }),
  }),
});

export const {
  useGetRiderReportQuery,
  useGetAdminReportQuery,
  useGetDriverReportQuery,
} = statsApi;
