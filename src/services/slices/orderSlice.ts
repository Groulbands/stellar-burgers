import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

type TCreateOrderResponse = {
  order: TOrder;
  name: string;
};

type TOrderState = {
  order: TOrder | null;
  name: string;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  order: null,
  name: '',
  isLoading: false,
  error: null
};

export const createOrder = createAsyncThunk<TCreateOrderResponse, string[]>(
  'order/createOrder',
  async (ingredientsIds) => {
    const response = await orderBurgerApi(ingredientsIds);

    return {
      name: response.name,
      order: {
        ...response.order,
        ingredients: ingredientsIds
      }
    };
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.name = '';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TCreateOrderResponse>) => {
          state.isLoading = false;
          state.order = action.payload.order;
          state.name = action.payload.name;
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка создания заказа';
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
