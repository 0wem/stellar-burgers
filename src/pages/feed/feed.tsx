import { useEffect, useRef } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
  selectFeedLoading,
  selectFeedWsConnected,
  selectFeedWsError
} from '../../services/selectors';
import {
  wsConnectionStart,
  wsConnectionClosed,
  fetchFeeds
} from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const total = useSelector(selectFeedTotal);
  const totalToday = useSelector(selectFeedTotalToday);
  const isLoading = useSelector(selectFeedLoading);
  const wsConnected = useSelector(selectFeedWsConnected);
  const wsError = useSelector(selectFeedWsError);
  const connectionStartTimeRef = useRef<number>(0);

  useEffect(() => {
    connectionStartTimeRef.current = Date.now();

    // Fetch initial data via API
    dispatch(fetchFeeds());

    // Start WebSocket connection for real-time updates
    dispatch(wsConnectionStart());

    return () => {
      // Only close if connection was established more than 1 second ago
      // This prevents premature closure in React StrictMode
      const timeSinceStart = Date.now() - connectionStartTimeRef.current;
      if (timeSinceStart > 1000) {
        dispatch(wsConnectionClosed());
      }
    };
  }, [dispatch]);

  const handleGetFeeds = () => {
    // Refresh data via API
    dispatch(fetchFeeds());
    // Reconnect WebSocket
    dispatch(wsConnectionClosed());
    dispatch(wsConnectionStart());
  };

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={handleGetFeeds}
      total={total}
      totalToday={totalToday}
    />
  );
};
