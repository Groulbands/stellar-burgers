import ingredientsReducer, { getIngredients } from '../ingredientsSlice';
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

describe('ingredients reducer', () => {
  test('должен вернуть initialState при неизвестном экшене', () => {
    const result = ingredientsReducer(undefined, { type: 'UNKNOWN' });

    expect(result).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });
  });

  test('должен обработать getIngredients.pending', () => {
    const result = ingredientsReducer(
      {
        ingredients: [],
        isLoading: false,
        error: null
      },
      getIngredients.pending('')
    );

    expect(result).toEqual({
      ingredients: [],
      isLoading: true,
      error: null
    });
  });

  test('должен обработать getIngredients.fulfilled', () => {
    const result = ingredientsReducer(
      {
        ingredients: [],
        isLoading: true,
        error: null
      },
      getIngredients.fulfilled(mockIngredients, '')
    );

    expect(result).toEqual({
      ingredients: mockIngredients,
      isLoading: false,
      error: null
    });
  });

  test('должен обработать getIngredients.rejected', () => {
    const result = ingredientsReducer(
      {
        ingredients: [],
        isLoading: true,
        error: null
      },
      getIngredients.rejected(new Error('Ошибка сервера'), '')
    );

    expect(result).toEqual({
      ingredients: [],
      isLoading: false,
      error: 'Ошибка сервера'
    });
  });
});
