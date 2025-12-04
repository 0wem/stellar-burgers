import { rootReducer } from './store';

describe('rootReducer', () => {
  it('должен возвращать корректное начальное состояние при вызове с undefined состоянием и неизвестным экшеном', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const state = rootReducer(undefined, action);

    expect(state).toBeDefined();
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('auth');

    // Проверяем начальное состояние ingredients
    expect(state.ingredients).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });

    // Проверяем начальное состояние burgerConstructor
    expect(state.burgerConstructor).toEqual({
      bun: null,
      ingredients: []
    });

    // Проверяем начальное состояние order
    expect(state.order).toEqual({
      order: null,
      orderRequest: false,
      orderFailed: false,
      orderModalData: null,
      isLoading: false,
      error: null
    });

    // Проверяем начальное состояние feed
    expect(state.feed).toMatchObject({
      orders: [],
      total: 0,
      totalToday: 0
    });

    // Проверяем начальное состояние user
    expect(state.user).toMatchObject({
      orders: []
    });

    // Проверяем начальное состояние auth
    expect(state.auth).toMatchObject({
      isAuthenticated: false
    });
  });

  it('должен обрабатывать неизвестный экшен без ошибок', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    const action = { type: 'UNKNOWN_ACTION' };
    const state = rootReducer(initialState, action);

    expect(state).toBeDefined();
    expect(state).toEqual(initialState);
  });
});

