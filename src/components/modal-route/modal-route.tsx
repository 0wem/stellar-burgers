import { FC, ReactElement } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal } from '../modal';

type TModalRouteProps = {
  title?: string;
  children: ReactElement;
};

export const ModalRoute: FC<TModalRouteProps> = ({ title, children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => {
    const background = location.state?.background;
    if (background) {
      navigate(background.pathname);
    } else {
      navigate(-1);
    }
  };

  return (
    <Modal title={title || ''} onClose={handleClose}>
      {children}
    </Modal>
  );
};
