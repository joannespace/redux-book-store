import { configureStore } from "@reduxjs/toolkit";
import bookstoreReducer from "../features/bookstore/bookstoreSlice";

export const store = configureStore({
  reducer: {
    bookstore: bookstoreReducer,
  },
});
