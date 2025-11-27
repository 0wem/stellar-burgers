import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const selectUserState = (state: RootState) => state.user;

export const selectUserOrders = createSelector([selectUserState], (user) => {
  const orders = user?.orders ?? [];
  // Sort orders by date (newest first)
  return [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
});

export const selectUserOrdersLoading = (state: RootState) =>
  state.user?.isLoading ?? false;
export const selectUserOrdersError = (state: RootState) =>
  state.user?.error ?? null;
export const selectUserWsConnected = (state: RootState) =>
  state.user?.wsConnected ?? false;
export const selectUserWsError = (state: RootState) =>
  state.user?.wsError ?? null;
