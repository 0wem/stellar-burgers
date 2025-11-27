import { RootState } from '../store';

export const selectOrder = (state: RootState) => state.order?.order ?? null;
export const selectOrderRequest = (state: RootState) =>
  state.order?.orderRequest ?? false;
export const selectOrderFailed = (state: RootState) =>
  state.order?.orderFailed ?? false;
export const selectOrderModalData = (state: RootState) =>
  state.order?.orderModalData ?? null;
export const selectOrderLoading = (state: RootState) =>
  state.order?.isLoading ?? false;
export const selectOrderError = (state: RootState) =>
  state.order?.error ?? null;
