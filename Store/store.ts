import { API_TRAVEL } from "@/services/API";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    // Add the API reducer to the store
    [API_TRAVEL.reducerPath]: API_TRAVEL.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling, and other features of RTK Query
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(API_TRAVEL.middleware),
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
