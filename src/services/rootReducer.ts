import { combineReducers } from '@reduxjs/toolkit';

import ingredientsReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/constructorSlice';
import orderReducer from './slices/orderSlice';
import feedReducer from './slices/feedSlice';
import ordersReducer from './slices/ordersSlice';
import orderInfoReducer from './slices/orderInfoSlice';
import userReducer from './slices/userSlice';
import passwordReducer from './slices/passwordSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  feed: feedReducer,
  orders: ordersReducer,
  orderInfo: orderInfoReducer,
  user: userReducer,
  password: passwordReducer
});
