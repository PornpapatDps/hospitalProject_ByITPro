// components/ProtectedRoute.jsx
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from './UserContext';
import { LoadingScreen } from './sections/LoadingScreen';

const ProtectedRoute = () => {
  const { user, isLoading } = useContext(UserContext);

  // แสดง loading ขณะตรวจสอบ auth
  if (isLoading) {
    return (
     
          <LoadingScreen/>
       
    );
  }

  // ถ้ายังไม่ได้เข้าสู่ระบบ ให้ redirect ไป login
  if (!user?.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
