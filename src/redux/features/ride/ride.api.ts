import { baseApi } from "@/redux/baseApi";

export const rideApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    rideRequest: builder.mutation({
      query: (rideinfo) => ({
        url: "/ride/request",
        method: "POST",
        data: rideinfo,
      }),
      invalidatesTags: ["RIDE"],
    }),
    cancelRide: builder.mutation({
      query: (rideId) => ({
        url: `/ride/cancel/${rideId}`,
        method: "PATCH",
      }),
    }),

    // requestRide: build.mutation<any, { pickup: string; destination: string; paymentMethod: 'cash'|'card'; note?: string }>(),

    getAllRides: builder.query({
      query: () => ({
        url: "/ride",
        method: "GET",
      }),
      providesTags: ["RIDE"],
      transformResponse: (response) => response.data,
    }),
  }),
});

// listMyRides: build.query<any, { page?: number; q?: string; status?: RideStatus; from?: string; to?: string } | void>({
// query: (params) => ({ url: '/rides/my', params }), providesTags: ['Ride']
// }),
// getRide: build.query<any, string>({ query: (id) => ({ url: `/rides/${id}` }), providesTags: (r, e, id) => [{ type: 'Ride', id }] }),
// updateRideStatus: build.mutation<any, { id: string; status: RideStatus }>({
// query: ({ id, status }) => ({ url: `/rides/${id}/status`, method: 'PATCH', body: { status } }),
// invalidatesTags: (r, e, { id }) => [{ type: 'Ride', id }, 'Ride']
// }),
// incomingRequests: build.query<any, void>({ query: () => ({ url: '/rides/incoming' }), providesTags: ['Ride'] }),
// acceptRide: build.mutation<any, { id: string }>({ query: ({ id }) =>

export const {
  useRideRequestMutation,
  useGetAllRidesQuery,
  useCancelRideMutation,
} = rideApi;
