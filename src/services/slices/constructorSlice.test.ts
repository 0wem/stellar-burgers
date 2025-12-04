import constructorReducer, {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './constructorSlice';
import { TConstructorIngredient } from '@utils-types';

const mockBun: TConstructorIngredient = {
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
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  id: 'bun-1'
};

const mockIngredient1: TConstructorIngredient = {
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
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
  id: 'ingredient-1'
};

const mockIngredient2: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
  id: 'ingredient-2'
};

describe('constructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  describe('addBun', () => {
    it('должен добавить булку в конструктор', () => {
      const action = addBun(mockBun);
      const state = constructorReducer(initialState, action);

      expect(state.bun).toEqual(mockBun);
      expect(state.ingredients).toEqual([]);
    });

    it('должен заменить существующую булку новой', () => {
      const stateWithBun = constructorReducer(initialState, addBun(mockBun));
      const newBun: TConstructorIngredient = {
        ...mockBun,
        id: 'bun-2',
        name: 'Новая булка'
      };
      const state = constructorReducer(stateWithBun, addBun(newBun));

      expect(state.bun).toEqual(newBun);
      expect(state.bun?.id).toBe('bun-2');
    });
  });

  describe('addIngredient', () => {
    it('должен добавить ингредиент в конструктор', () => {
      const action = addIngredient(mockIngredient1);
      const state = constructorReducer(initialState, action);

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual(mockIngredient1);
    });

    it('должен добавить несколько ингредиентов в конструктор', () => {
      let state = constructorReducer(initialState, addIngredient(mockIngredient1));
      state = constructorReducer(state, addIngredient(mockIngredient2));

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0]).toEqual(mockIngredient1);
      expect(state.ingredients[1]).toEqual(mockIngredient2);
    });
  });

  describe('removeIngredient', () => {
    it('должен удалить ингредиент из конструктора', () => {
      let state = constructorReducer(initialState, addIngredient(mockIngredient1));
      state = constructorReducer(state, addIngredient(mockIngredient2));

      expect(state.ingredients).toHaveLength(2);

      const action = removeIngredient('ingredient-1');
      state = constructorReducer(state, action);

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].id).toBe('ingredient-2');
    });

    it('не должен изменить состояние, если ингредиент с таким id не найден', () => {
      let state = constructorReducer(initialState, addIngredient(mockIngredient1));
      const action = removeIngredient('non-existent-id');
      const newState = constructorReducer(state, action);

      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0]).toEqual(mockIngredient1);
    });
  });

  describe('moveIngredient', () => {
    it('должен переместить ингредиент вниз', () => {
      let state = constructorReducer(initialState, addIngredient(mockIngredient1));
      state = constructorReducer(state, addIngredient(mockIngredient2));

      expect(state.ingredients[0].id).toBe('ingredient-1');
      expect(state.ingredients[1].id).toBe('ingredient-2');

      const action = moveIngredient({ fromIndex: 0, toIndex: 1 });
      state = constructorReducer(state, action);

      expect(state.ingredients[0].id).toBe('ingredient-2');
      expect(state.ingredients[1].id).toBe('ingredient-1');
    });

    it('должен переместить ингредиент вверх', () => {
      let state = constructorReducer(initialState, addIngredient(mockIngredient1));
      state = constructorReducer(state, addIngredient(mockIngredient2));

      expect(state.ingredients[0].id).toBe('ingredient-1');
      expect(state.ingredients[1].id).toBe('ingredient-2');

      const action = moveIngredient({ fromIndex: 1, toIndex: 0 });
      state = constructorReducer(state, action);

      expect(state.ingredients[0].id).toBe('ingredient-2');
      expect(state.ingredients[1].id).toBe('ingredient-1');
    });
  });

  describe('clearConstructor', () => {
    it('должен очистить конструктор', () => {
      let state = constructorReducer(initialState, addBun(mockBun));
      state = constructorReducer(state, addIngredient(mockIngredient1));
      state = constructorReducer(state, addIngredient(mockIngredient2));

      expect(state.bun).not.toBeNull();
      expect(state.ingredients).toHaveLength(2);

      const action = clearConstructor();
      state = constructorReducer(state, action);

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });
  });
});

