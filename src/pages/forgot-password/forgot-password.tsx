import { FC, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ForgotPasswordUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { forgotPassword } from '../../services/slices/authSlice';
import {
  selectAuthError,
  selectForgotPasswordFailed
} from '../../services/selectors';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector(selectAuthError);
  const forgotPasswordFailed = useSelector(selectForgotPasswordFailed);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(forgotPassword({ email })).then((result) => {
      if (forgotPassword.fulfilled.match(result)) {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      }
    });
  };

  return (
    <ForgotPasswordUI
      errorText={
        forgotPasswordFailed ? error || 'Ошибка восстановления пароля' : ''
      }
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
