import { baseApi } from "@/redux/baseApi";
import type { IResponse, ISendOtp, IVerifyOtp } from "@/types";
import type { AccountStatus, Role } from "@/types/domain";

type LoginResponseData = {
  role?: string;
  [key: string]: unknown;
};

export type AuthUser = {
  _id?: string;
  name?: string;
  email?: string;
  role?: Role;
  isBlocked?: boolean;
  status?: AccountStatus;
  isVerified?: boolean;
  contactNo?: string;
  vehicleType?: string;
  createdAt?: string;
  [key: string]: unknown;
};

type RegisterPayload = {
  name: string;
  email: string;
  role: string;
  password: string;
};

type UpdateUserProfilePayload = Record<string, unknown>;

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<IResponse<LoginResponseData>, { email: string; password: string }>({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        data: userInfo,
      }),
      invalidatesTags: ["AUTH", "USER"],
    }),
    logout: builder.mutation<IResponse<null>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["AUTH", "USER"],
    }),
    register: builder.mutation<IResponse<unknown>, RegisterPayload>({
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

    userInfo: builder.query<IResponse<AuthUser>, void>({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
      providesTags: ["USER"],
    }),

    updateUserProfile: builder.mutation<IResponse<unknown>, { id: string; data: UpdateUserProfilePayload }>({
      query: ({ id, data }) => ({
        url: `/user/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["USER"],
    }),

    changePassword: builder.mutation<IResponse<unknown>, { oldPassword: string; newPassword: string }>({
      query: (data) => ({
        url: "/auth/change-password",
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["AUTH"],
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
