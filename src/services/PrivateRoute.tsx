import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"

const PrivateRoute = () => {
  const { isAuthenticated, isInitialized } = useAuth();

  // 인증 상태 초기화가 완료되지 않았으면 로딩 상태
  if (!isInitialized) {
    return <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '16px',
      color: '#666'
    }}>
      인증 상태를 확인하는 중...
    </div>;
  }

  // 초기화 완료 후 로그인되지 않은 경우에만 리다이렉트
  if (!isAuthenticated) {
    alert("개인회원 로그인 후 이용해주세요.");
    return <Navigate to="/" />;
  }

  // 로그인 상태라면 원래 컴포넌트 렌더링
  return <Outlet />;
};

export default PrivateRoute;