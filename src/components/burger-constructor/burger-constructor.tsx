import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from 'src/services/store';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  selectConstructorItems,
  selectOrderModalData,
  selectOrderRequest,
  selectUser
} from '@selectors';
import { clearOrder, createOrder } from 'src/services/slices/orderSlice';
import { clearConstructor } from 'src/services/slices/constructorSlice';
import { getFeed } from 'src/services/slices/feedSlice';
import { getUserOrders } from 'src/services/slices/ordersSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const user = useSelector(selectUser);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) {
      return;
    }

    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientsIds))
      .unwrap()
      .then(() => {
        dispatch(clearConstructor());
        dispatch(getFeed());
        dispatch(getUserOrders());
      });
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
