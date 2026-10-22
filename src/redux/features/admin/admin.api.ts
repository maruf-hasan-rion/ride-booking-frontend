import { baseApi } from "@/redux/baseApi";

type UserId = string;
type QueryParams = Record<string, string | number | boolean | undefined>;

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsersForAdmin: builder.query<unknown, QueryParams | void>({
      query: (params) => ({
        url: "/user",
        method: "GET",
        params,
      }),
      providesTags: ["USER", "ADMIN"],
    }),
    blockUser: builder.mutation<unknown, UserId>({
      query: (userId) => ({
        url: `/user/block/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["USER", "ADMIN"],
    }),
    unblockUser: builder.mutation<unknown, UserId>({
      query: (userId) => ({
        url: `/user/unblock/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["USER", "ADMIN"],
    }),
  }),
});

export const {
  useGetAllUsersForAdminQuery,
  useBlockUserMutation,
  useUnblockUserMutation,
} = adminApi;
