import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { forgotPasswordApi, resetPasswordApi } from '../../utils/burger-api';

type TPasswordState = {
  isForgotPasswordSuccess: boolean;
  isResetPasswordSuccess: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TPasswordState = {
  isForgotPasswordSuccess: false,
  isResetPasswordSuccess: false,
  isLoading: false,
  error: null
};

export const forgotPassword = createAsyncThunk(
  'password/forgotPassword',
  async (data: { email: string }) => forgotPasswordApi(data)
);

export const resetPassword = createAsyncThunk(
  'password/resetPassword',
  async (data: { password: string; token: string }) => resetPasswordApi(data)
);

const passwordSlice = createSlice({
  name: 'password',
  initialState,
  reducers: {
    clearPasswordState: (state) => {
      state.isForgotPasswordSuccess = false;
      state.isResetPasswordSuccess = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isForgotPasswordSuccess = false;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.isForgotPasswordSuccess = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка восстановления пароля';
      })

      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isResetPasswordSuccess = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.isResetPasswordSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка сброса пароля';
      });
  }
});

export const { clearPasswordState } = passwordSlice.actions;
export default passwordSlice.reducer;
