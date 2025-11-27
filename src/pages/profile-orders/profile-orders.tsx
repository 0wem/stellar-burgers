import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { selectUserOrders } from '../../services/selectors';
import {
  wsUserConnectionStart,
  wsUserConnectionClosed
} from '../../services/slices/userSlice';
import { selectIsAuthenticated } from '../../services/selectors';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // WebSocket connection is now managed globally in app.tsx
  // This component just displays the orders

  return <ProfileOrdersUI orders={orders} />;
};
