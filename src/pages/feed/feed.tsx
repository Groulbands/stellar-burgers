import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';

import { useDispatch, useSelector } from 'src/services/store';
import { getFeed } from 'src/services/slices/feedSlice';
import { selectFeedIsLoading, selectFeedOrders } from '@selectors';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectFeedIsLoading);

  useEffect(() => {
    dispatch(getFeed());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={() => dispatch(getFeed())} />;
};
