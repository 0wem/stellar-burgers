import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrdersApi } from '../../utils/burger-api';

type TUserState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
  wsConnected: boolean;
  wsError: string | null;
};

const initialState: TUserState = {
  orders: [],
  isLoading: false,
  error: null,
  wsConnected: false,
  wsError: null
};

export const fetchUserOrders = createAsyncThunk(
  'user/fetchOrders',
  async () => {
    const data = await getOrdersApi();
    return data;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    wsConnectionStart: (state) => {
      state.wsConnected = false;
      state.wsError = null;
    },
    wsConnectionSuccess: (state) => {
      state.wsConnected = true;
      state.wsError = null;
    },
    wsConnectionError: (state, action: PayloadAction<string>) => {
      state.wsConnected = false;
      state.wsError = action.payload;
    },
    wsConnectionClosed: (state) => {
      state.wsConnected = false;
    },
    wsGetMessage: (state, action: PayloadAction<{ orders: TOrder[] }>) => {
      state.orders = action.payload.orders;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заказов';
      });
  }
});

export const {
  wsConnectionStart: wsUserConnectionStart,
  wsConnectionSuccess: wsUserConnectionSuccess,
  wsConnectionError: wsUserConnectionError,
  wsConnectionClosed: wsUserConnectionClosed,
  wsGetMessage: wsUserGetMessage
} = userSlice.actions;

export default userSlice.reducer;
