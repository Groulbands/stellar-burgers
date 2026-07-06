import { expect, test, describe } from '@jest/globals';
import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../constructorSlice';

import { TConstructorIngredient, TIngredient } from '@utils-types';

const mockBun: TIngredient = {
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
};

const mockMain: TIngredient = {
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
};

const mockSauce: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 300,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
};

describe('burgerConstructor reducer', () => {
  test('должен вернуть initialState при неизвестном экшене', () => {
    const result = constructorReducer(undefined, { type: 'UNKNOWN' });

    expect(result).toEqual({
      bun: null,
      ingredients: []
    });
  });

  test('должен добавить булку в constructor.bun', () => {
    const result = constructorReducer(undefined, addIngredient(mockBun));

    expect(result.bun).not.toBeNull();
    expect(result.bun?.name).toBe('Краторная булка N-200i');
    expect(result.bun?.type).toBe('bun');
    expect(result.bun).toHaveProperty('id');

    expect(result.ingredients).toEqual([]);
  });

  test('должен добавить начинку в constructor.ingredients', () => {
    const result = constructorReducer(undefined, addIngredient(mockMain));

    expect(result.bun).toBeNull();

    expect(result.ingredients).toHaveLength(1);
    expect(result.ingredients[0].name).toBe(
      'Биокотлета из марсианской Магнолии'
    );
    expect(result.ingredients[0].type).toBe('main');
    expect(result.ingredients[0]).toHaveProperty('id');
  });

  test('должен удалить ингредиент из constructor.ingredients по id', () => {
    const initialState = {
      bun: null,
      ingredients: [
        {
          ...mockMain,
          id: 'ingredient-1'
        },
        {
          ...mockSauce,
          id: 'ingredient-2'
        }
      ] as TConstructorIngredient[]
    };

    const result = constructorReducer(
      initialState,
      removeIngredient('ingredient-1')
    );

    expect(result.ingredients).toEqual([
      {
        ...mockSauce,
        id: 'ingredient-2'
      }
    ]);
  });

  test('должен переместить ингредиент по constructor.ingredients', () => {
    const initialState = {
      bun: null,
      ingredients: [
        {
          ...mockMain,
          id: 'ingredient-1'
        },
        {
          ...mockSauce,
          id: 'ingredient-2'
        },
        {
          ...mockMain,
          id: 'ingredient-3',
          name: 'Вторая котлета'
        }
      ] as TConstructorIngredient[]
    };

    const result = constructorReducer(
      initialState,
      moveIngredient({ from: 0, to: 2 })
    );

    expect(result.ingredients.map((ingredient) => ingredient.id)).toEqual([
      'ingredient-2',
      'ingredient-3',
      'ingredient-1'
    ]);
  });

  test('должен очистить конструктор', () => {
    const initialState = {
      bun: {
        ...mockBun,
        id: 'bun-1'
      } as TConstructorIngredient,
      ingredients: [
        {
          ...mockMain,
          id: 'ingredient-1'
        },
        {
          ...mockSauce,
          id: 'ingredient-2'
        }
      ] as TConstructorIngredient[]
    };

    const result = constructorReducer(initialState, clearConstructor());

    expect(result).toEqual({
      bun: null,
      ingredients: []
    });
  });
});
