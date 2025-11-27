import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const selectFeedState = (state: RootState) => state.feed;

export const selectFeedOrders = createSelector([selectFeedState], (feed) => {
  const orders = feed?.orders ?? [];
  // Sort orders by date (newest first)
  return [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
});

export const selectFeedTotal = (state: RootState) => state.feed?.total ?? 0;
export const selectFeedTotalToday = (state: RootState) =>
  state.feed?.totalToday ?? 0;
export const selectFeedLoading = (state: RootState) =>
  state.feed?.isLoading ?? false;
export const selectFeedError = (state: RootState) => state.feed?.error ?? null;
export const selectFeedWsConnected = (state: RootState) =>
  state.feed?.wsConnected ?? false;
export const selectFeedWsError = (state: RootState) =>
  state.feed?.wsError ?? null;
