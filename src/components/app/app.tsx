import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';
import { ProtectedRoute } from '../../components/protected-route';
import { ModalRoute } from '../../components/modal-route';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { IngredientDetails, OrderInfo } from '@components';
import { useDispatch, useSelector } from '../../services/store';
import { selectIsAuthenticated } from '../../services/selectors';
import { getUser } from '../../services/slices/authSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import {
  wsUserConnectionStart,
  wsUserConnectionClosed,
  fetchUserOrders
} from '../../services/slices/userSlice';

function AppRoutes() {
  const location = useLocation();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const background = location.state?.background;

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUser());
      // Fetch initial user orders via API
      dispatch(fetchUserOrders());
      // Start WebSocket connection for user orders when authenticated
      const timer = setTimeout(() => {
        dispatch(wsUserConnectionStart());
      }, 500);

      return () => {
        clearTimeout(timer);
        // Only close if component is unmounting or user is logging out
        // Don't close on every re-render
      };
    } else {
      // Close WebSocket connection when not authenticated
      dispatch(wsUserConnectionClosed());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <>
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <ModalRoute title='Детали ингредиента'>
                <IngredientDetails />
              </ModalRoute>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <ModalRoute>
                <OrderInfo />
              </ModalRoute>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ModalRoute>
                <OrderInfo />
              </ModalRoute>
            }
          />
        </Routes>
      )}
    </>
  );
}

const App = () => (
  <div className={styles.app}>
    <AppHeader />
    <AppRoutes />
  </div>
);

export default App;
