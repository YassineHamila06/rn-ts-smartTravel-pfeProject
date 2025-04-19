// services/API.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Config from "@/Config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface UserProfile {
  _id?: string;
  id?: string;
  name: string;
  lastname: string;
  email: string;
  profileImage?: string | null;
}

export const API_TRAVEL = createApi({
  reducerPath: "API_TRAVEL",
  tagTypes: ["User"],
  baseQuery: fetchBaseQuery({
    baseUrl: Config.EXPO_PUBLIC_API_TRAVEL, // e.g. "https://.../api/v1/users"
    prepareHeaders: async (headers) => {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    loginUser: builder.mutation<
      { token: string },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),

    signupUser: builder.mutation<
      any,
      { name: string; lastname: string; email: string; password: string }
    >({
      query: (newUser) => ({
        url: "/add",
        method: "POST",
        body: newUser,
      }),
    }),

    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (data) => ({
        url: "/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    verifyResetCode: builder.mutation<
      { success: boolean; message: string; userId: string },
      { resetCode: string }
    >({
      query: (data) => ({
        url: "/verify-reset-code",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation<
      { message: string },
      { resetCode: string; newPassword: string }
    >({
      query: (data) => ({
        url: "/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    fetchUserProfile: builder.query<UserProfile, void>({
      query: () => "/me",
      providesTags: ["User"],
    }),
    getUsers: builder.query<UserProfile[], void>({
      query: () => "/get",
      providesTags: ["User"],
    }),

    updateUserProfile: builder.mutation<
      { success: boolean; message: string },
      {
        id: string;
        name: string;
        lastname: string;
        email: string;
        profileImage: string;
      }
    >({
      query: ({ id, name, lastname, email, profileImage }) => ({
        url: `/update/${id}`,
        method: "PUT",
        body: { name, lastname, email, profileImage },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginUserMutation,
  useSignupUserMutation,
  useForgotPasswordMutation,
  useVerifyResetCodeMutation,
  useResetPasswordMutation,
  useFetchUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetUsersQuery,
} = API_TRAVEL;
