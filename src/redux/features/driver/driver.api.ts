import { baseApi } from "@/redux/baseApi";
import type { RideStatus } from "@/types/domain";

type QueryParams = Record<string, string | number | boolean | undefined>;

export const driverApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createDriverProfile: builder.mutation({
      query: (vehicleInfo?: string) => ({
        url: "/driver/profile",
        method: "POST",
        data: { vehicleInfo },
      }),
      invalidatesTags: ["DRIVER"],
    }),
    updateDriverProfile: builder.mutation({
      query: (vehicleInfo: string) => ({
        url: "/driver/profile",
        method: "PATCH",
        data: { vehicleInfo },
      }),
      invalidatesTags: ["DRIVER"],
    }),
    getDriverProfile: builder.query({
      query: () => ({
        url: "/driver/profile/me",
        method: "GET",
      }),
      providesTags: ["DRIVER"],
    }),
    updateDriverStatus: builder.mutation({
      query: (isOnline) => ({
        url: "/driver/status",
        method: "PATCH",
        data: { isOnline },
      }),
      invalidatesTags: ["DRIVER"],
    }),
    getIncomingRideRequests: builder.query({
      query: (params: QueryParams | void) => ({
        url: "/driver/incoming-requests",
        method: "GET",
        params,
      }),
      providesTags: ["DRIVER", "RIDE"],
    }),
    getActiveRideForDriver: builder.query({
      query: () => ({
        url: "/driver/active-ride",
        method: "GET",
      }),
      providesTags: ["DRIVER", "RIDE"],
    }),
    acceptRide: builder.mutation({
      query: (rideId) => ({
        url: `/driver/${rideId}/accept`,
        method: "PATCH",
      }),
      invalidatesTags: ["DRIVER", "RIDE"],
    }),
    rejectRide: builder.mutation({
      query: (rideId) => ({
        url: `/driver/${rideId}/reject`,
        method: "PATCH",
      }),
      invalidatesTags: ["DRIVER", "RIDE"],
    }),
    cancelAssignedRide: builder.mutation({
      query: ({ rideId, reason }: { rideId: string; reason?: string }) => ({
        url: `/driver/${rideId}/cancel`,
        method: "PATCH",
        data: { reason },
      }),
      invalidatesTags: ["DRIVER", "RIDE"],
    }),
    updateDriverRideStatus: builder.mutation({
      query: ({ rideId, status }: { rideId: string; status: RideStatus }) => ({
        url: `/driver/${rideId}/status`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: ["DRIVER", "RIDE"],
    }),
    getAllDrivers: builder.query({
      query: () => ({
        url: "/driver",
        method: "GET",
      }),
      providesTags: ["DRIVER", "ADMIN"],
    }),
    getDriverEarnings: builder.query({
      query: () => ({
        url: "/driver/earnings/me",
        method: "GET",
      }),
      providesTags: ["DRIVER", "RIDE"],
    }),
    approveDriver: builder.mutation({
      query: (userId) => ({
        url: `/driver/approve/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["DRIVER", "ADMIN"],
    }),
    suspendDriver: builder.mutation({
      query: (userId) => ({
        url: `/driver/suspend/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["DRIVER", "ADMIN"],
    }),
  }),
});

export const {
  useCreateDriverProfileMutation,
  useUpdateDriverProfileMutation,
  useGetDriverProfileQuery,
  useUpdateDriverStatusMutation,
  useGetIncomingRideRequestsQuery,
  useGetActiveRideForDriverQuery,
  useAcceptRideMutation,
  useRejectRideMutation,
  useCancelAssignedRideMutation,
  useUpdateDriverRideStatusMutation,
  useGetDriverEarningsQuery,
  useGetAllDriversQuery,
  useApproveDriverMutation,
  useSuspendDriverMutation,
} = driverApi;
