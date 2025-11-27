import { Middleware } from '@reduxjs/toolkit';
import {
  wsConnectionStart,
  wsConnectionSuccess,
  wsConnectionError,
  wsConnectionClosed,
  wsGetMessage
} from '../slices/feedSlice';
import {
  wsUserConnectionStart,
  wsUserConnectionSuccess,
  wsUserConnectionError,
  wsUserConnectionClosed,
  wsUserGetMessage
} from '../slices/userSlice';
import { getCookie } from '../../utils/cookie';
import { TOrdersData } from '../../utils/types';

type TWsAction =
  | typeof wsConnectionStart
  | typeof wsConnectionSuccess
  | typeof wsConnectionError
  | typeof wsConnectionClosed
  | typeof wsGetMessage
  | typeof wsUserConnectionStart
  | typeof wsUserConnectionSuccess
  | typeof wsUserConnectionError
  | typeof wsUserConnectionClosed
  | typeof wsUserGetMessage;

let socket: WebSocket | null = null;
let userSocket: WebSocket | null = null;

// Ensure WebSocket URL has protocol
const getWsUrl = () => {
  const envUrl = process.env.BURGER_API_URL;
  if (envUrl) {
    // If URL doesn't start with http:// or https://, add https://
    let url = envUrl;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    return url.replace('http', 'ws');
  }
  return 'wss://norma.education-services.ru/api';
};

const URL = getWsUrl();

export const wsMiddleware: Middleware = (store) => (next) => (action) => {
  const { dispatch } = store;

  if (wsConnectionStart.match(action)) {
    // Don't create new connection if one is already connecting or open
    if (
      socket &&
      (socket.readyState === WebSocket.CONNECTING ||
        socket.readyState === WebSocket.OPEN)
    ) {
      return next(action);
    }

    // Close existing connection if any (but not connecting/open)
    if (socket) {
      socket.close();
      socket = null;
    }

    socket = new WebSocket(`${URL}/orders/all`);

    socket.onopen = () => {
      dispatch(wsConnectionSuccess());
    };

    socket.onerror = (event) => {
      dispatch(wsConnectionError('WebSocket error'));
    };

    socket.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        // Handle both formats: { orders: [...], total: ..., totalToday: ... } and { success: true, ... }
        const data: TOrdersData = parsedData.orders
          ? parsedData
          : { orders: [], total: 0, totalToday: 0 };
        dispatch(wsGetMessage(data));
      } catch (error) {
        // Silently handle parsing errors
      }
    };

    socket.onclose = () => {
      dispatch(wsConnectionClosed());
      socket = null;
    };
  }

  if (wsUserConnectionStart.match(action)) {
    const token = getCookie('accessToken');
    if (token) {
      // Don't create new connection if one is already connecting or open
      if (
        userSocket &&
        (userSocket.readyState === WebSocket.CONNECTING ||
          userSocket.readyState === WebSocket.OPEN)
      ) {
        return next(action);
      }

      // Close existing connection if any (but not connecting/open)
      if (userSocket) {
        userSocket.close();
        userSocket = null;
      }

      // Remove 'Bearer ' prefix if present
      const cleanToken = token.replace(/^Bearer\s+/, '');
      userSocket = new WebSocket(`${URL}/orders?token=${cleanToken}`);

      userSocket.onopen = () => {
        dispatch(wsUserConnectionSuccess());
      };

      userSocket.onerror = (event) => {
        dispatch(wsUserConnectionError('WebSocket error'));
      };

      userSocket.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data);
          // Handle both formats: { orders: [...] } and { success: true, orders: [...] }
          const data = parsedData.orders
            ? { orders: parsedData.orders }
            : parsedData;
          dispatch(wsUserGetMessage(data));
        } catch (error) {
          // Silently handle parsing errors
        }
      };

      userSocket.onclose = () => {
        dispatch(wsUserConnectionClosed());
        userSocket = null;
      };
    } else {
      dispatch(wsUserConnectionError('No access token found'));
    }
  }

  if (wsConnectionClosed.match(action)) {
    if (socket) {
      if (
        socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING
      ) {
        socket.close();
      }
      socket = null;
    }
  }

  if (wsUserConnectionClosed.match(action)) {
    if (userSocket) {
      if (
        userSocket.readyState === WebSocket.OPEN ||
        userSocket.readyState === WebSocket.CONNECTING
      ) {
        userSocket.close();
      }
      userSocket = null;
    }
  }

  return next(action);
};
