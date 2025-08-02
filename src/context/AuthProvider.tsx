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

    // 로그아웃 후 강제로 인증 상태를 false로 유지
    const forceLogout = localStorage.getItem('forceLogout') === 'true';
    if (forceLogout) {
      console.log('강제 로그아웃 상태 - 로그인 체크 건너뜀');
      setIsAuthenticated(false);
      return;
    }

    try {
      console.log('로그인 상태 체크 시작');
      const { data } = await axiosInstance.get('/api/permit/user-info', {
        withCredentials: true,
      });
      console.log('API 응답 데이터: ', data);
      
      // 로그아웃 중이면 서버 응답을 무시
      if (isLoggingOut || localStorage.getItem('isLoggingOut') === 'true') {
        console.log('로그아웃 중이므로 서버 응답 무시');
        return;
      }
      
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
    console.log('로그아웃 시작');
    setIsLoggingOut(true); // 로그아웃 시작
    localStorage.setItem('isLoggingOut', 'true'); // localStorage에 로그아웃 상태 저장
    localStorage.setItem('forceLogout', 'true'); // 강제 로그아웃 플래그 설정
    
    try {
      console.log('서버 로그아웃 요청 시작');
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
        console.log('서버 로그아웃 성공:', response);
        
        // 클라이언트 측 쿠키 삭제
        console.log('로그아웃 전 쿠키:', document.cookie);
        
        // 모든 쿠키 삭제
        const cookies = document.cookie.split(";");
        cookies.forEach(function(cookie) {
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
          console.log('쿠키 삭제:', name);
          
          // 다양한 도메인과 경로로 쿠키 삭제
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname};`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname};`;
        });
        
        console.log('로그아웃 후 쿠키:', document.cookie);
        
        setIsAuthenticated(false);
        console.log('인증 상태를 false로 설정');
        
        // 로그아웃 완료 후 플래그 리셋 및 홈으로 이동
        setTimeout(() => {
          console.log('로그아웃 완료 - 페이지 완전 새로고침');
          setIsLoggingOut(false);
          localStorage.removeItem('isLoggingOut'); // localStorage에서 로그아웃 상태 제거
          localStorage.removeItem('forceLogout'); // 강제 로그아웃 플래그 제거
          // 페이지를 완전히 새로고침하여 모든 상태 초기화
          window.location.href = '/';
          window.location.reload();
        }, 1000); // 시간을 늘려서 충분한 지연 확보
      }
    } catch (error: any) {
      console.error('로그아웃 중 에러 발생:', error);
      
      if (error.response) {
        console.error('서버 응답 에러:', {
          status: error.response.status,
          responseCode: error.response.data?.code,
          message: error.response.data?.message,
        });
      } else {
        console.error('네트워크 에러:', error);
      }
      
      // 에러가 발생해도 클라이언트 측 쿠키 삭제 및 로그아웃 처리
      console.log('에러 발생 시 쿠키 삭제 시작');
      const cookies = document.cookie.split(";");
      cookies.forEach(function(cookie) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        console.log('쿠키 삭제:', name);
        
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname};`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname};`;
      });
      
      setIsAuthenticated(false);
      console.log('에러 발생 시에도 인증 상태를 false로 설정');
      
      // 에러 발생 시에도 플래그 리셋 및 홈으로 이동
      setTimeout(() => {
        console.log('에러 발생 시에도 로그아웃 완료 - 페이지 완전 새로고침');
        setIsLoggingOut(false);
        localStorage.removeItem('isLoggingOut'); // localStorage에서 로그아웃 상태 제거
        localStorage.removeItem('forceLogout'); // 강제 로그아웃 플래그 제거
        // 페이지를 완전히 새로고침하여 모든 상태 초기화
        window.location.href = '/';
        window.location.reload();
      }, 1000);
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
    const forceLogoutStored = localStorage.getItem('forceLogout') === 'true';
    
    if (!isLoggingOutStored && !forceLogoutStored) {
      console.log('앱 초기화 - 로그인 상태 체크 시작');
      login();
    } else {
      console.log('저장된 로그아웃 상태로 인해 로그인 체크 건너뜀');
      if (isLoggingOutStored) {
        localStorage.removeItem('isLoggingOut'); // 초기화 시 제거
      }
      if (forceLogoutStored) {
        localStorage.removeItem('forceLogout'); // 초기화 시 제거
      }
      setIsAuthenticated(false);
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
