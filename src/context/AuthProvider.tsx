import { useState, useEffect, ReactNode } from 'react';
import { AuthContext, AuthContextType } from './AuthContext';
import axiosInstance from '../apis/axiosInstance';

const MAX_RETRIES = 1; // 재시도 횟수를 제한 (예: 1번)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // 로그아웃 플래그 추가

  // 로그인 함수
  const login = async (retryCount = 0) => {
    // 로그아웃 중이거나 로그아웃 상태가 저장되어 있으면 로그인 체크하지 않음
    if (isLoggingOut || localStorage.getItem('isLoggingOut') === 'true') {
      console.log('로그아웃 중이므로 로그인 체크 건너뜀');
      return;
    }

    try {
      const { data } = await axiosInstance.get('/api/permit/user-info', {
        withCredentials: true,
      });
      console.log('API 응답 데이터: ', data);
      if (data.result === 'user') {
        setIsAuthenticated(true);
        console.log('사용자 인증 성공 (user)');
      } else {
        setIsAuthenticated(false);
        console.log('게스트 인증 (guest)');
      }
    } catch (error: any) {
      if (error.response) {
        console.error('로그인 체크 실패:', {
          status: error.response.status,
          responseCode: error.response.data?.code,
          message: error.response.data?.message,
        });
      } else {
        console.error('로그인 체크 실패:', error);
      }
      if (error.response?.status === 401) {
        if (!isRefreshing && retryCount < MAX_RETRIES) {
          console.log('401 에러, 리프레시 토큰 요청');
          const refreshResponse = await refreshToken();
          if (refreshResponse) {
            await login(retryCount + 1);
          } else {
            console.log('리프레시 토큰 재발급 실패, 다시 로그인 필요');
            setIsAuthenticated(false);
          }
        } else {
          console.log('리프레시 이후 로그인 실패, 다시 로그인 필요');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    setIsLoggingOut(true); // 로그아웃 시작
    localStorage.setItem('isLoggingOut', 'true'); // localStorage에 로그아웃 상태 저장
    
    try {
      const response = await axiosInstance.post(
        '/api/permit/logout',
        {},
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.status===200) {
        console.log('로그아웃 성공:', response);
        
        // 클라이언트 측 쿠키도 삭제
        document.cookie.split(";").forEach(function(c) { 
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
        
        setIsAuthenticated(false);
        
        // 로그아웃 완료 후 플래그 리셋 및 홈으로 이동
        setTimeout(() => {
          setIsLoggingOut(false);
          localStorage.removeItem('isLoggingOut'); // localStorage에서 로그아웃 상태 제거
          window.location.replace('/');
        }, 500);
      }
    } catch (error: any) {
      if (error.response) {
        console.error('로그아웃 중 에러 발생:', {
          status: error.response.status,
          responseCode: error.response.data?.code,
          message: error.response.data?.message,
        });
      } else {
        console.error('로그아웃 중 에러 발생:', error);
      }
      
      // 에러가 발생해도 클라이언트 측 쿠키 삭제 및 로그아웃 처리
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      setIsAuthenticated(false);
      
      // 에러 발생 시에도 플래그 리셋 및 홈으로 이동
      setTimeout(() => {
        setIsLoggingOut(false);
        localStorage.removeItem('isLoggingOut'); // localStorage에서 로그아웃 상태 제거
        window.location.replace('/');
      }, 500);
    };
  };

  // 리프레시 토큰 요청 함수
  const refreshToken = async () => {
    try {
      setIsRefreshing(true);
      const response = await axiosInstance.post(
        '/api/permit/refresh',
        {},
        { withCredentials: true },
      );
      console.log('리프레시 토큰 응답:', response.data);
      // response.data에 토큰 갱신 성공 여부 정보가 있다면, 그에 따라 추가 처리
      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.error('리프레시 토큰 요청 실패:', {
          status: error.response.status,
          responseCode: error.response.data?.code,
          message: error.response.data?.message,
        });
      } else {
        console.error('리프레시 토큰 요청 실패:', error);
      }
      return null;
    } finally {
      setIsRefreshing(false);
    }
  };

  // 앱 로드 시 로그인 상태 체크
  useEffect(() => {
    // 로그아웃 상태가 저장되어 있으면 로그인 체크하지 않음
    const isLoggingOutStored = localStorage.getItem('isLoggingOut') === 'true';
    if (!isLoggingOutStored) {
      login();
    } else {
      console.log('저장된 로그아웃 상태로 인해 로그인 체크 건너뜀');
      localStorage.removeItem('isLoggingOut'); // 초기화 시 제거
    }
  }, []);

  useEffect(() => {
    console.log('isAuthenticated 변경됨:', isAuthenticated);
  }, [isAuthenticated]);

  const value: AuthContextType = {
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
