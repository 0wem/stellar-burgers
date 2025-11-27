import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const selectConstructorState = (state: RootState) => state.burgerConstructor;

export const selectBun = createSelector(
  [selectConstructorState],
  (constructor) => constructor?.bun ?? null
);

export const selectConstructorIngredients = createSelector(
  [selectConstructorState],
  (constructor) => constructor?.ingredients ?? []
);

export const selectConstructorItems = createSelector(
  [selectConstructorState],
  (constructor) => ({
    bun: constructor?.bun ?? null,
    ingredients: constructor?.ingredients ?? []
  })
);
