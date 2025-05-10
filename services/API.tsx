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
  travelPreferences?: string[];
}

export interface Comment {
  _id: string;
  user: {
    _id: string;
    name: string;
    profileImage: string;
  };
  text: string;
  createdAt: string;
}

export interface Post {
  _id: string;
  user: {
    _id: string;
    name: string;
    profileImage: string;
  };
  text: string;
  image?: string;
  likes: string[]; // ✅ not { userId: string }[], it's string[]
  comments: Comment[];
  createdAt: string;
}
export interface Event {
  _id: string;
  title: string;
  description: string;
  location: string;
  image: string;
  date: string;
  time: string;
  isActive: boolean;
  price: number;
}

export const API_TRAVEL = createApi({
  reducerPath: "API_TRAVEL",
  tagTypes: ["User", "Posts"],
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
        url: "/user/login",
        method: "POST",
        body: credentials,
      }),
    }),

    signupUser: builder.mutation<
      any,
      { name: string; lastname: string; email: string; password: string }
    >({
      query: (newUser) => ({
        url: "/user/add",
        method: "POST",
        body: newUser,
      }),
    }),

    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (data) => ({
        url: "/user/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    verifyResetCode: builder.mutation<
      { success: boolean; message: string; userId: string },
      { resetCode: string }
    >({
      query: (data) => ({
        url: "/user/verify-reset-code",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation<
      { message: string },
      { userId: string; newPassword: string }
    >({
      query: (data) => ({
        url: "/user/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    fetchUserProfile: builder.query<UserProfile, void>({
      query: () => "/user/me",
      providesTags: ["User"],
    }),
    getUsers: builder.query<UserProfile[], void>({
      query: () => "/user/get",
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
        travelPreferences?: string[];
      }
    >({
      query: ({
        id,
        name,
        lastname,
        email,
        profileImage,
        travelPreferences,
      }) => ({
        url: `/user/update/${id}`,
        method: "PUT",
        body: { name, lastname, email, profileImage, travelPreferences },
      }),
      invalidatesTags: ["User"],
    }),
    // Inside endpoints: (builder) => ({
    getTrips: builder.query<
      {
        _id: string;
        destination: string;
        price: string;
        description: string;
        debutDate: string;
        endDate: string;
        image: string;
        isActive?: boolean;
      }[],
      void
    >({
      query: () => "/trip/get", // if your route is actually `/api/v1/trips`, use that
      transformResponse: (response: any) => response.data, // 👈 fix
    }),

    // New endpoint for fetching community posts
    getCommunityPosts: builder.query<Post[], void>({
      query: () => "/community/get",
      transformResponse: (response: any) => response.data, // ✅ must exist
      providesTags: ["Posts"],
    }),

    // New endpoint for liking/unliking posts
    likePost: builder.mutation<
      { success: boolean; liked: boolean; likesCount: number },
      string // postId
    >({
      query: (postId) => ({
        url: `/community/${postId}/like`,
        method: "PATCH",
      }),
      invalidatesTags: ["Posts"],
    }),

    // New endpoint for fetching comments for a specific post
    getPostComments: builder.query<
      Comment[],
      string // postId
    >({
      query: (postId) => `/community/${postId}/comments`,
      transformResponse: (response: any) => response.data,
      providesTags: (result, error, postId) => [{ type: "Posts", id: postId }],
    }),

    // New endpoint for adding a comment to a post
    addComment: builder.mutation<
      { success: boolean; comment: Comment },
      { postId: string; text: string }
    >({
      query: ({ postId, text }) => ({
        url: `/community/${postId}/comment`,
        method: "POST",
        body: { text },
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Posts", id: postId },
        "Posts",
      ],
    }),

    // New endpoint for creating a post
    addPost: builder.mutation<{ success: boolean; post: Post }, FormData>({
      query: (formData) => ({
        url: "/community/add",
        method: "POST",
        body: formData,
        formData: true, // Important for FormData handling
      }),
      invalidatesTags: ["Posts"],
    }),

    getEvents: builder.query<Event[], void>({
      query: () => "/events/get",
      transformResponse: (response: any) => response.data,
    }),
    getReservationsByUser: builder.query<
      {
        _id: string;
        tripId: {
          _id: string;
          destination: string;
          debutDate: string;
          endDate: string;
          image: string;
        };
        numberOfPeople: number;
        totalPrice: number;
        status: string;
      }[],
      string // userId
    >({
      query: (userId) => `/reservation/user/${userId}`,
      transformResponse: (response: any) => response.reservations,
    }),

    // Add endpoint for fetching event reservations by user
    getEventReservationsByUser: builder.query<
      {
        _id: string;
        eventId: {
          _id: string;
          title: string;
          date: string;
          time: string;
          location: string;
          image: string;
          price: number;
        };
        numberOfPeople: number;
        totalPrice: number;
        status: string;
      }[],
      string // userId
    >({
      query: (userId) => `/event-reservations/user/${userId}`,
      transformResponse: (response: any) => response.reservations,
    }),
    // Get all rewards
    getRewards: builder.query<
      {
        _id: string;
        title: string;
        description: string;
        image: string;
        category: string;
        pointsRequired: number;
      }[],
      void
    >({
      query: () => "/reward/get",
      transformResponse: (res: any) => res.rewards,
    }),

    // Get user points
    getUserPoints: builder.query<
      { success: boolean; points: number },
      string // userId
    >({
      query: (userId) => `/user/get-points/${userId}`,
    }),
    getSurveys: builder.query<
      {
        _id: string;
        title: string;
        description: string;
        status: string;
        createdAt: string;
        updatedAt: string;
      }[],
      void
    >({
      query: () => "/survey/get",
      transformResponse: (res: any) => res, // ✅ raw array
    }),

    getQuestionsBySurveyId: builder.query<
      {
        _id: string;
        surveyId: string;
        text: string;
        options: string[];
        type: string;
        order: number;
      }[],
      string
    >({
      query: (id) => `/question/get?surveyId=${id}`,
    }),
    addResponse: builder.mutation<
      { success: boolean; data: any },
      { questionId: string; userId: string; value: string }
    >({
      query: (response) => ({
        url: "/response/add",
        method: "POST",
        body: response,
      }),
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
  useGetTripsQuery,
  useGetCommunityPostsQuery,
  useLikePostMutation,
  useGetPostCommentsQuery,
  useAddCommentMutation,
  useAddPostMutation,
  useGetEventsQuery,
  useGetReservationsByUserQuery,
  useGetEventReservationsByUserQuery,
  useGetUserPointsQuery,
  useGetSurveysQuery,
  useGetQuestionsBySurveyIdQuery,
  useGetRewardsQuery,
  useAddResponseMutation,
} = API_TRAVEL;
