import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

type TOrderInfoState = {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderInfoState = {
  order: null,
  isLoading: false,
  error: null
};

export const getOrderByNumber = createAsyncThunk(
  'orderInfo/getOrderByNumber',
  async (number: number) => getOrderByNumberApi(number)
);

const orderInfoSlice = createSlice({
  name: 'orderInfo',
  initialState,
  reducers: {
    clearOrderInfo: (state) => {
      state.order = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload.orders[0] || null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заказа';
      });
  }
});

export const { clearOrderInfo } = orderInfoSlice.actions;
export default orderInfoSlice.reducer;
