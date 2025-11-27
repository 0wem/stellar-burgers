import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TUser, TRegisterData, TLoginData } from '@utils-types';
import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi
} from '../../utils/burger-api';
import { setCookie, deleteCookie, getCookie } from '../../utils/cookie';

type TAuthState = {
  user: TUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  registerRequest: boolean;
  registerFailed: boolean;
  loginRequest: boolean;
  loginFailed: boolean;
  updateUserRequest: boolean;
  updateUserFailed: boolean;
  forgotPasswordRequest: boolean;
  forgotPasswordFailed: boolean;
  resetPasswordRequest: boolean;
  resetPasswordFailed: boolean;
};

const initialState: TAuthState = {
  user: null,
  isAuthenticated: !!getCookie('accessToken'),
  isLoading: false,
  error: null,
  registerRequest: false,
  registerFailed: false,
  loginRequest: false,
  loginFailed: false,
  updateUserRequest: false,
  updateUserFailed: false,
  forgotPasswordRequest: false,
  forgotPasswordFailed: false,
  resetPasswordRequest: false,
  resetPasswordFailed: false
};

export const register = createAsyncThunk(
  'auth/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
});

export const getUser = createAsyncThunk('auth/getUser', async () => {
  const response = await getUserApi();
  return response.user;
});

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (data: { email: string }) => {
    await forgotPasswordApi(data);
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: { password: string; token: string }) => {
    await resetPasswordApi(data);
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.registerRequest = true;
        state.registerFailed = false;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.registerRequest = false;
        state.registerFailed = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.registerRequest = false;
        state.registerFailed = true;
        state.error = action.error.message || 'Ошибка регистрации';
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loginRequest = true;
        state.loginFailed = false;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loginRequest = false;
        state.loginFailed = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loginRequest = false;
        state.loginFailed = true;
        state.error = action.error.message || 'Ошибка входа';
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      // Get User
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error =
          action.error.message || 'Ошибка получения данных пользователя';
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.updateUserRequest = true;
        state.updateUserFailed = false;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.updateUserRequest = false;
        state.updateUserFailed = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateUserRequest = false;
        state.updateUserFailed = true;
        state.error = action.error.message || 'Ошибка обновления данных';
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPasswordRequest = true;
        state.forgotPasswordFailed = false;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.forgotPasswordRequest = false;
        state.forgotPasswordFailed = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPasswordRequest = false;
        state.forgotPasswordFailed = true;
        state.error = action.error.message || 'Ошибка восстановления пароля';
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.resetPasswordRequest = true;
        state.resetPasswordFailed = false;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.resetPasswordRequest = false;
        state.resetPasswordFailed = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPasswordRequest = false;
        state.resetPasswordFailed = true;
        state.error = action.error.message || 'Ошибка сброса пароля';
      });
  }
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;
