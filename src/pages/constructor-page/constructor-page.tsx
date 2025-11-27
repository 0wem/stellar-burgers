import { useSelector } from '../../services/store';
import {
  selectIngredientsLoading,
  selectIngredientsError,
  selectIngredients
} from '../../services/selectors';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC } from 'react';

export const ConstructorPage: FC = () => {
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const ingredientsError = useSelector(selectIngredientsError);
  const ingredients = useSelector(selectIngredients);

  if (isIngredientsLoading) {
    return <Preloader />;
  }

  if (ingredientsError) {
    return (
      <main className={styles.containerMain}>
        <h1
          className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
        >
          Ошибка загрузки ингредиентов
        </h1>
        <p className='text text_type_main-default pl-5'>{ingredientsError}</p>
      </main>
    );
  }

  if (!ingredients.length) {
    return (
      <main className={styles.containerMain}>
        <h1
          className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
        >
          Ингредиенты не загружены
        </h1>
        <p className='text text_type_main-default pl-5'>
          Проверьте, что файл .env содержит BURGER_API_URL
        </p>
      </main>
    );
  }

  return (
    <main className={styles.containerMain}>
      <h1
        className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
      >
        Соберите бургер
      </h1>
      <div className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </main>
  );
};
