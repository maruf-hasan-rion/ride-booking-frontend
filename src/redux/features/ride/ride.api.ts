import { baseApi } from "@/redux/baseApi";

type QueryParams = Record<string, string | number | boolean | undefined>;

export const rideApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    rideRequest: builder.mutation({
      query: ({
        idempotencyKey,
        ...rideinfo
      }: {
        idempotencyKey?: string;
        [key: string]: unknown;
      }) => ({
        url: "/ride/request",
        method: "POST",
        data: rideinfo,
        headers: idempotencyKey
          ? { "Idempotency-Key": idempotencyKey }
          : undefined,
      }),
      invalidatesTags: ["RIDE"],
    }),
    cancelRide: builder.mutation({
      query: (rideId) => ({
        url: `/ride/cancel/${rideId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["RIDE"],
    }),
    getMyRide: builder.query({
      query: (rideId) => ({
        url: `/ride/my-ride/${rideId}`,
        method: "GET",
      }),
      providesTags: ["RIDE"],
    }),
    getAllMyRides: builder.query({
      query: (params: QueryParams | void) => ({
        url: "/ride/all-my-rides",
        method: "GET",
        params,
      }),
      providesTags: ["RIDE"],
    }),
    getLatestRide: builder.query({
      query: (params: QueryParams | void = {}) => ({
        url: "/ride/latest-ride",
        method: "GET",
        params,
      }),
      providesTags: ["RIDE"],
    }),
    singleRideForAdmin: builder.query({
      query: (id) => ({
        url: `/ride/single-ride/${id}`,
        method: "GET",
      }),
      providesTags: ["RIDE"],
    }),
    getAllRidesForAdmin: builder.query({
      query: (params: QueryParams | void) => ({
        url: "/ride/all-rides-admin",
        method: "GET",
        params,
      }),
      providesTags: ["RIDE"],
    }),
    adminCancelRide: builder.mutation({
      query: ({ rideId, reason }: { rideId: string; reason: string }) => ({
        url: `/ride/admin-cancel/${rideId}`,
        method: "PATCH",
        data: { reason },
      }),
      invalidatesTags: ["RIDE"],
    }),
  }),
});

export const {
  useRideRequestMutation,
  useCancelRideMutation,
  useGetLatestRideQuery,
  useGetMyRideQuery,
  useGetAllMyRidesQuery,
  useSingleRideForAdminQuery,
  useGetAllRidesForAdminQuery,
  useAdminCancelRideMutation,
} = rideApi;
