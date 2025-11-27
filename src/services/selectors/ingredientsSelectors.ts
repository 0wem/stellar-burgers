import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const selectIngredientsState = (state: RootState) => state.ingredients;

export const selectIngredients = createSelector(
  [selectIngredientsState],
  (ingredients) => ingredients?.ingredients ?? []
);

export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients?.isLoading ?? false;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients?.error ?? null;
