import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';
import { selectIsAuthChecked, selectUser } from '../../services/selectors';
import { useSelector } from 'src/services/store';
import { ReactElement } from 'react';

type TProtectedRouteProps = {
  children: ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false
}: TProtectedRouteProps) => {
  const location = useLocation();

  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
