import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Create async thunk for updating profile
export const updateProfile = createAsyncThunk(
  "updateProfile/update",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `/api/auth/update-profile`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);

// Create async thunk for updating password
export const updatePassword = createAsyncThunk(
  "updateProfile/updatePassword",
  async (passwords, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `/api/auth/update-password`,
        passwords,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Password update failed");
    }
  }
);

const updateProfileSlice = createSlice({
  name: "updateProfile",
  initialState: {
    loading: false,
    user: null,
    error: null,
    isUpdated: false,
    isPasswordUpdated: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    resetUpdate: (state) => {
      state.isUpdated = false;
      state.isPasswordUpdated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Profile update cases
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isUpdated = true;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isUpdated = false;
      })
      // Password update cases
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
        state.isPasswordUpdated = true;
        state.error = null;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isPasswordUpdated = false;
      });
  },
});

export const { clearErrors, resetUpdate } = updateProfileSlice.actions;
export default updateProfileSlice.reducer;