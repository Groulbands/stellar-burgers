import { RootState } from './store';

export const selectIngredients = (state: RootState) =>
  state.ingredients.ingredients;

export const selectIngredientsIsLoading = (state: RootState) =>
  state.ingredients.isLoading;

export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;

export const selectBuns = (state: RootState) =>
  state.ingredients.ingredients.filter((item) => item.type === 'bun');

export const selectMains = (state: RootState) =>
  state.ingredients.ingredients.filter((item) => item.type === 'main');

export const selectSauces = (state: RootState) =>
  state.ingredients.ingredients.filter((item) => item.type === 'sauce');

export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor;

export const selectOrderRequest = (state: RootState) => state.order.isLoading;

export const selectOrderModalData = (state: RootState) => state.order.order;

export const selectOrdersIsLoading = (state: RootState) =>
  state.orders.isLoading;

export const selectFeedOrders = (state: RootState) => state.feed.orders;

export const selectFeed = (state: RootState) => ({
  total: state.feed.total,
  totalToday: state.feed.totalToday
});

export const selectFeedIsLoading = (state: RootState) => state.feed.isLoading;

export const selectUserOrders = (state: RootState) => state.orders.orders;

export const selectOrderInfo = (state: RootState) => state.orderInfo.order;

export const selectOrderInfoIsLoading = (state: RootState) =>
  state.orderInfo.isLoading;

export const selectUser = (state: RootState) => state.user.user;

export const selectUserError = (state: RootState) => state.user.error;

export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;

export const selectUserIsLoading = (state: RootState) => state.user.isLoading;
