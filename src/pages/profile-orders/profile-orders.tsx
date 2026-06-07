import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';

import { useDispatch, useSelector } from 'src/services/store';
import { getUserOrders } from 'src/services/slices/ordersSlice';
import { selectUserOrders } from '@selectors';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
