import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import {
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday
} from '../../services/selectors';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC<{ total?: number; totalToday?: number }> = ({
  total,
  totalToday
}) => {
  const orders = useSelector(selectFeedOrders);
  const feedTotal = useSelector(selectFeedTotal);
  const feedTotalToday = useSelector(selectFeedTotalToday);

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  const feed = {
    total: total ?? feedTotal,
    totalToday: totalToday ?? feedTotalToday
  };

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
