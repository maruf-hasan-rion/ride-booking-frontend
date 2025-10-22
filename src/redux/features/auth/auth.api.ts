/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/baseApi";
import type { IResponse, ISendOtp, IVerifyOtp } from "@/types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        data: userInfo,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      // invalidatesTags: ["USER"],
    }),
    register: builder.mutation({
      query: (userInfo) => ({
        url: "/user/register",
        method: "POST",
        data: userInfo,
      }),
    }),
    sendOtp: builder.mutation<IResponse<null>, ISendOtp>({
      query: (userInfo) => ({
        url: "/otp/send",
        method: "POST",
        data: userInfo,
      }),
    }),
    verifyOtp: builder.mutation<IResponse<null>, IVerifyOtp>({
      query: (userInfo) => ({
        url: "/otp/verify",
        method: "POST",
        data: userInfo,
      }),
    }),

    userInfo: builder.query({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
      providesTags: ["USER"],
    }),

    updateUserProfile: builder.mutation<
      IResponse<null>,
      { id: string; data: any }
    >({
      query: ({ id, data }) => ({
        url: `/user/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["USER"],
    }),

    changePassword: builder.mutation<
      IResponse<null>,
      { oldPassword: string; newPassword: string }
    >({
      query: (data) => ({
        url: "/auth/change-password",
        method: "PATCH",
        data,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useUserInfoQuery,
  useUpdateUserProfileMutation,
  useChangePasswordMutation,
  useLogoutMutation,
} = authApi;
