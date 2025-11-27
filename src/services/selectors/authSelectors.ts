import { RootState } from '../store';

export const selectUser = (state: RootState) => state.auth?.user ?? null;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth?.isAuthenticated ?? false;
export const selectAuthLoading = (state: RootState) =>
  state.auth?.isLoading ?? false;
export const selectAuthError = (state: RootState) => state.auth?.error ?? null;
export const selectLoginRequest = (state: RootState) =>
  state.auth?.loginRequest ?? false;
export const selectLoginFailed = (state: RootState) =>
  state.auth?.loginFailed ?? false;
export const selectRegisterRequest = (state: RootState) =>
  state.auth?.registerRequest ?? false;
export const selectRegisterFailed = (state: RootState) =>
  state.auth?.registerFailed ?? false;
export const selectUpdateUserRequest = (state: RootState) =>
  state.auth?.updateUserRequest ?? false;
export const selectUpdateUserFailed = (state: RootState) =>
  state.auth?.updateUserFailed ?? false;
export const selectForgotPasswordRequest = (state: RootState) =>
  state.auth?.forgotPasswordRequest ?? false;
export const selectForgotPasswordFailed = (state: RootState) =>
  state.auth?.forgotPasswordFailed ?? false;
export const selectResetPasswordRequest = (state: RootState) =>
  state.auth?.resetPasswordRequest ?? false;
export const selectResetPasswordFailed = (state: RootState) =>
  state.auth?.resetPasswordFailed ?? false;
