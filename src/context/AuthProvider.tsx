import { useState, useEffect, ReactNode } from 'react';
import { AuthContext, AuthContextType } from './AuthContext';
import axiosInstance from '../apis/axiosInstance';
import { analyzeSessionCookies, checkSessionBeforeLogout } from '../utils/cookieUtils';

const MAX_RETRIES = 1; // 재시도 횟수를 제한 (예: 1번)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 로그인 함수
  const login = async (retryCount = 0) => {
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
    console.log('=== 로그아웃 시작 ===');
    console.log('현재 도메인:', window.location.hostname);
    console.log('현재 URL:', window.location.href);
    
    // 쿠키 상태 확인
    console.log('현재 쿠키:', document.cookie);
    console.log('쿠키 개수:', document.cookie.split(';').length);
    
    // 세션 관련 쿠키 확인
    const cookies = document.cookie.split(';');
    const sessionCookies = cookies.filter(cookie => 
      cookie.trim().toLowerCase().includes('session') || 
      cookie.trim().toLowerCase().includes('jsessionid') ||
      cookie.trim().toLowerCase().includes('connect.sid')
    );
    console.log('세션 관련 쿠키:', sessionCookies);
    
    try {
      // 로그아웃 전 인증 상태 확인
      console.log('로그아웃 전 인증 상태:', isAuthenticated);
      
      // API 설정 정보 확인
      console.log('API 설정 정보:', {
        baseURL: import.meta.env.VITE_API_BASE_URL,
        hasAccessToken: !!import.meta.env.VITE_API_ACCESS_TOKEN,
        currentDomain: window.location.hostname
      });
      
      // 쿠키 강제 전송을 위한 추가 설정
      const requestConfig: any = {
        withCredentials: true,
        headers: {
          'X-Client-Domain': window.location.hostname,
          'X-Client-Origin': window.location.origin,
          'X-Requested-With': 'XMLHttpRequest'
        }
      };

      // 현재 쿠키를 헤더에 명시적으로 포함 (백업 방법)
      const cookies = document.cookie;
      if (cookies) {
        requestConfig.headers['Cookie'] = cookies;
      }

      console.log('로그아웃 요청 설정:', requestConfig);
      
      const response = await axiosInstance.post(
        '/api/permit/logout',
        {},
        requestConfig
      );
      
      if (response.status === 200) {
        console.log('✅ 백엔드 로그아웃 성공:', response.data);
        setIsAuthenticated(false);
        
        // 로그아웃 후 세션 상태 확인 (디버깅용)
        setTimeout(async () => {
          try {
            const checkResponse = await axiosInstance.get('/api/permit/user-info', {
              withCredentials: true,
            });
            console.log('로그아웃 후 세션 상태 확인:', checkResponse.data);
          } catch (checkError) {
            console.log('로그아웃 후 세션 확인 실패 (예상됨):', checkError);
          }
        }, 1000);
        
        window.location.replace('/');
      }
    } catch (error: any) {
      if (error.response) {
        console.error('❌ 로그아웃 중 에러 발생:', {
          status: error.response.status,
          responseCode: error.response.data?.code,
          message: error.response.data?.message,
          headers: error.response.headers,
        });
      } else {
        console.error('❌ 로그아웃 중 에러 발생:', error);
      }
    }
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
    login();
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
