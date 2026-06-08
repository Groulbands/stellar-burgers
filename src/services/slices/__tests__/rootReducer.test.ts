import { expect, test, describe } from '@jest/globals';

import { rootReducer } from '../../rootReducer';

describe('root reducer', () => {
  test('должен вернуть стартовое состояние всего хранилища при неизвестном экшене', () => {
    const result = rootReducer(undefined, { type: 'UNKNOWN' });

    expect(result).toEqual({
      ingredients: {
        error: null,
        ingredients: [],
        isLoading: false
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      order: {
        error: null,
        isLoading: false,
        name: '',
        order: null
      },
      feed: {
        error: null,
        isLoading: false,
        orders: [],
        total: 0,
        totalToday: 0
      },
      orders: {
        error: null,
        isLoading: false,
        orders: []
      },
      orderInfo: {
        error: null,
        isLoading: false,
        order: null
      },
      user: {
        error: null,
        isAuthChecked: false,
        isLoading: false,
        user: null
      },
      password: {
        error: null,
        isForgotPasswordSuccess: false,
        isLoading: false,
        isResetPasswordSuccess: false
      }
    });
  });
});
