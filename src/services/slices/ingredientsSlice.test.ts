import ingredientsReducer, { fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  }
];

describe('ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  describe('fetchIngredients', () => {
    it('должен установить isLoading в true при начале запроса (pending)', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.ingredients).toEqual([]);
    });

    it('должен записать ингредиенты в стор и установить isLoading в false при успешном выполнении (fulfilled)', () => {
      const pendingState = ingredientsReducer(
        initialState,
        fetchIngredients.pending('', undefined)
      );

      expect(pendingState.isLoading).toBe(true);

      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsReducer(pendingState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.ingredients).toHaveLength(2);
    });

    it('должен записать ошибку в стор и установить isLoading в false при ошибке запроса (rejected)', () => {
      const pendingState = ingredientsReducer(
        initialState,
        fetchIngredients.pending('', undefined)
      );

      expect(pendingState.isLoading).toBe(true);

      const errorMessage = 'Ошибка загрузки ингредиентов';
      const action = {
        type: fetchIngredients.rejected.type,
        payload: errorMessage,
        error: { message: errorMessage }
      };
      const state = ingredientsReducer(pendingState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.ingredients).toEqual([]);
    });

    it('должен обработать ошибку без payload', () => {
      const pendingState = ingredientsReducer(
        initialState,
        fetchIngredients.pending('', undefined)
      );

      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: 'Network error' }
      };
      const state = ingredientsReducer(pendingState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Network error');
    });
  });
});

