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
    // 로그아웃 중이면 로그인 체크하지 않음
    if (isLoggingOut) {
      console.log('로그아웃 중이므로 로그인 체크 건너뜀');
      return;
    }

    try {
      console.log('로그인 상태 체크 시작');
      const { data } = await axiosInstance.get('/api/permit/user-info', {
        withCredentials: true,
      });
      console.log('API 응답 데이터: ', data);
      
      // 로그아웃 중이면 서버 응답을 무시
      if (isLoggingOut) {
        console.log('로그아웃 중이므로 서버 응답 무시');
        return;
      }
      
      // 백엔드 응답 형식에 맞춰서 처리
      if (data && data.isSuccess) {
        if (data.result === 'user') {
          setIsAuthenticated(true);
          console.log('사용자 인증 성공 (user)');
        } else {
          setIsAuthenticated(false);
          console.log('게스트 인증 (guest)');
        }
      } else {
        console.warn('로그인 체크 응답 형식 이상:', data);
        setIsAuthenticated(false);
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

  // 수동 로그아웃 상태 초기화 함수
  const clearLogoutState = () => {
    console.log('수동으로 로그아웃 상태 초기화');
    setIsLoggingOut(false);
  };

  // 로그아웃 함수
  const logout = async () => {
    console.log('로그아웃 시작');
    setIsLoggingOut(true); // 로그아웃 시작
    
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
        
        // 백엔드 응답 형식 확인
        const responseData = response.data;
        if (responseData && responseData.isSuccess) {
          console.log('로그아웃 성공:', responseData.message);
        } else {
          console.warn('로그아웃 응답 형식 이상:', responseData);
        }
        
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
        
        // 로그아웃 완료 후 홈으로 이동
        setTimeout(() => {
          console.log('로그아웃 완료 - 홈으로 이동');
          setIsLoggingOut(false);
          window.location.href = '/';
        }, 1000);
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
      
      // 에러 발생 시에도 홈으로 이동
      setTimeout(() => {
        console.log('에러 발생 시에도 로그아웃 완료 - 홈으로 이동');
        setIsLoggingOut(false);
        window.location.href = '/';
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
    console.log('앱 초기화 - 로그인 상태 체크 시작');
    login();
  }, []);

  useEffect(() => {
    console.log('isAuthenticated 변경됨:', isAuthenticated);
  }, [isAuthenticated]);

  const value: AuthContextType = {
    isAuthenticated,
    login,
    logout,
    clearLogoutState, // 수동 초기화 함수 추가
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
