// @src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectUser, setUser } from '../features/shop/usersSlice';
import type { ReactNode } from 'react';
import type { User } from '../types';

type ProtectedRouteProps = {
  children?: ReactNode;
}

const ProtectedRoute:React.FC<ProtectedRouteProps> = ({ children }: ProtectedRouteProps) => {
  // Replace with your actual authentication check
  const dispatch = useAppDispatch()
  let isLoggedIn = useAppSelector(selectUser) !== null;

  if (!isLoggedIn) {
    const localUserData: User | null = JSON.parse(localStorage.getItem('user') ?? 'null') as User | null;
    if (localUserData) {
      dispatch(setUser(localUserData));
      isLoggedIn = true; // Set to true if user data exists in localStorage
    }
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />; // Redirect to login if not authenticated
  }

  return children ?? <Outlet />; // Render child routes or outlet for nested routes
};

export default ProtectedRoute;