import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { selectIngredients } from '../../services/selectors';
import {
  selectOrderModalData,
  selectOrderLoading
} from '../../services/selectors';
import { fetchOrderByNumber } from '../../services/slices/orderSlice';
import { selectFeedOrders, selectUserOrders } from '../../services/selectors';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();
  const ingredients = useSelector(selectIngredients);
  const orderModalData = useSelector(selectOrderModalData);
  const isLoading = useSelector(selectOrderLoading);
  const feedOrders = useSelector(selectFeedOrders);
  const userOrders = useSelector(selectUserOrders);

  useEffect(() => {
    if (number && !orderModalData) {
      const orderNumber = parseInt(number, 10);
      dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, number, orderModalData]);

  const orderData = useMemo(() => {
    if (orderModalData) return orderModalData;
    const allOrders = [...feedOrders, ...userOrders];
    return allOrders.find(
      (order) => order.number === parseInt(number || '0', 10)
    );
  }, [orderModalData, feedOrders, userOrders, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
