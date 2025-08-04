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
    
    // 세션 쿠키 상태 상세 분석
    analyzeSessionCookies();
    
    // 로그아웃 전 세션 상태 확인
    const hasValidSession = await checkSessionBeforeLogout();
    console.log('로그아웃 전 유효한 세션 존재:', hasValidSession);
    
    try {
      // 로그아웃 전 인증 상태 확인
      console.log('로그아웃 전 인증 상태:', isAuthenticated);
      
      // API 설정 정보 확인
      console.log('API 설정 정보:', {
        baseURL: import.meta.env.VITE_API_BASE_URL,
        hasAccessToken: !!import.meta.env.VITE_API_ACCESS_TOKEN,
        currentDomain: window.location.hostname
      });
      
      // 세션이 유효하지 않은 경우 다른 방법으로 로그아웃 시도
      if (!hasValidSession) {
        console.log('⚠️ 유효한 세션이 없습니다. 다른 방법으로 로그아웃을 시도합니다.');
        
        // 방법 1: 먼저 세션 갱신 시도
        try {
          console.log('세션 갱신 시도...');
          const refreshResponse = await axiosInstance.post('/api/permit/refresh', {}, { withCredentials: true });
          console.log('세션 갱신 결과:', refreshResponse.data);
          
          // 갱신 후 다시 세션 확인
          const refreshedSession = await checkSessionBeforeLogout();
          if (refreshedSession) {
            console.log('✅ 세션 갱신 성공, 이제 로그아웃을 진행합니다.');
            // 세션이 갱신되었으므로 정상적인 로그아웃 진행
          } else {
            console.log('세션 갱신 실패, 다른 방법으로 로그아웃을 시도합니다.');
          }
        } catch (refreshError) {
          console.log('세션 갱신 실패:', refreshError);
        }
        
        // 방법 2: fetch를 사용한 직접 로그아웃 요청
        try {
          const fetchResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/permit/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
              'X-Client-Domain': window.location.hostname,
              'X-Client-Origin': window.location.origin
            }
          });
          
          if (fetchResponse.ok) {
            console.log('✅ fetch를 사용한 로그아웃 성공');
            setIsAuthenticated(false);
            window.location.replace('/');
            return;
          }
        } catch (fetchError) {
          console.log('fetch 로그아웃 실패:', fetchError);
        }
        
        // 방법 3: 클라이언트 측에서만 로그아웃 처리
        console.log('클라이언트 측에서만 로그아웃 처리합니다.');
        setIsAuthenticated(false);
        window.location.replace('/');
        return;
      }
      
      // 쿠키 강제 전송을 위한 추가 설정 (withCredentials: true 반드시 포함)
      const requestConfig: any = {
        withCredentials: true, // ✅ 반드시 필요 - 쿠키 전송을 위해
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
        console.log('🔍 현재 쿠키를 헤더에 포함:', cookies);
      } else {
        console.log('⚠️ 현재 쿠키가 없습니다!');
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
