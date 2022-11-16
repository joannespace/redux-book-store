import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import api from "../../apiService";

const initialState = {
  books: [],
  book: {},
  status: "idle",
  error: "",
  loading: false,
};

export const getBooks = createAsyncThunk(
  "bookstore/getBooks",
  async ({ pageNum, limit, query }, thunkApi) => {
    let url = `/books?_page=${pageNum}&_limit=${limit}`;
    if (query) url += `&q=${query}`;
    const res = await api.get(url);
    return res.data;
  }
);

export const getBookInfo = createAsyncThunk(
  "bookstore/getBookInfo",
  async ({ bookId }) => {
    const res = await api.get(`/books/${bookId}`);
    return res.data;
  }
);

export const addFavorite = createAsyncThunk(
  "bookstore/addFavorite",
  async ({ addingBook }) => {
    const res = await api.post(`/favorites`, addingBook);
    return res.data;
  }
);

export const removeBook = createAsyncThunk(
  "bookstore/removeBook",
  async ({ removedBookId }) => {
    await api.delete(`/favorites/${removedBookId}`);
    // return res.data;
  }
);

export const getFavorites = createAsyncThunk(
  "bookstore/getFavorites",
  async () => {
    const res = await api.get(`/favorites`);
    return res.data;
  }
);

export const bookstoreSlice = createSlice({
  name: "bookstore",
  initialState,
  reducer: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBooks.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.error = "";
      })
      .addCase(getBooks.fulfilled, (state, action) => {
        state.status = "idle";
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(getBooks.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(getBookInfo.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.error = "";
      })
      .addCase(getBookInfo.fulfilled, (state, action) => {
        state.status = "idle";
        state.loading = false;
        state.book = action.payload;
      })
      .addCase(getBookInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.loading = false;
        toast.error(state.error);
      });

    builder
      .addCase(addFavorite.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.status = "idle";
        // state.books = action.payload;
        state.loading = false;
        toast.success("The book has been added to the reading list!");
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.loading = false;
        toast.error(state.error);
      });

    builder
      .addCase(removeBook.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(removeBook.fulfilled, (state, action) => {
        state.loading = true;
        state.status = "idle";
        // state.books = action.payload;
        state.loading = false;
        toast.success("The book has been removed from the reading list!");
      })
      .addCase(removeBook.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.loading = false;
        toast.error(state.error);
      });

    builder
      .addCase(getFavorites.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(getFavorites.fulfilled, (state, action) => {
        state.status = "idle";
        state.books = action.payload;
        state.loading = false;
      })
      .addCase(getFavorites.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.loading = false;
        toast.error(state.error);
      });
  },
});

export default bookstoreSlice.reducer;
