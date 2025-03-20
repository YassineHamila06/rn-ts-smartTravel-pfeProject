import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Config from "@/Config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_TRAVEL = createApi({
  reducerPath: "API_TRAVEL",
  tagTypes: ["User"],
  baseQuery: fetchBaseQuery({
    baseUrl: Config.EXPO_PUBLIC_API_TRAVEL,
    prepareHeaders: async (headers) => {
      const token = await AsyncStorage.getItem("token");
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
    fetchUserProfile: builder.query<{ name: string; email: string }, void>({
      query: () => "/me",
      providesTags: ["User"],
    }),
  }),
});

export const { useLoginUserMutation, useFetchUserProfileQuery } = API_TRAVEL;
