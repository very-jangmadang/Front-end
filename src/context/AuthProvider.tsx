import { useState, useEffect, ReactNode } from 'react';
import { AuthContext, AuthContextType } from './AuthContext';
import axiosInstance from '../apis/axiosInstance';

const MAX_RETRIES = 1; // 재시도 횟수를 제한 (예: 1번)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 로그인 함수
  const login = async (retryCount = 0) => {
    // 로그아웃 후 재로그인 방지 체크
    const logoutTime = localStorage.getItem('logoutTime');
    if (logoutTime) {
      const timeSinceLogout = Date.now() - parseInt(logoutTime);
      if (timeSinceLogout < 5000) { // 5초 이내면 재로그인 방지
        console.log('⚠️ 로그아웃 후 5초 이내 재로그인 시도 감지, 방지합니다.');
        setIsAuthenticated(false);
        return;
      } else {
        // 5초가 지났으면 로그아웃 시간 기록 삭제
        localStorage.removeItem('logoutTime');
      }
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

  // 로그아웃 함수 (CORS 에러 방지)
  const logout = async () => {
    console.log('=== 로그아웃 시작 ===');
    console.log('현재 도메인:', window.location.hostname);
    console.log('현재 URL:', window.location.href);
    console.log('현재 쿠키:', document.cookie);
    
    try {
      // 간단한 로그아웃 요청 (CORS 허용된 헤더만)
      const response = await axiosInstance.post(
        '/api/permit/logout',
        {},
        {
          withCredentials: true, // ✅ 반드시 필요 - 쿠키 전송을 위해
          headers: {
            'X-Requested-With': 'XMLHttpRequest' // 일반적으로 허용됨
          }
        }
      );
      
      if (response.status === 200) {
        console.log('✅ 백엔드 로그아웃 성공:', response.data);
        
        // 양쪽 도메인에서 모두 쿠키 삭제 (크로스도메인 문제 해결)
        const cookiesToDelete = ['JSESSIONID', 'access', 'refresh', 'idtoken'];
        
        cookiesToDelete.forEach(cookieName => {
          // 1. 현재 도메인에서 삭제
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          
          // 2. jangmadang.site 도메인에서 삭제
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.jangmadang.site;`;
          
          // 3. api.jangmadang.site 도메인에서 삭제
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.api.jangmadang.site;`;
          
          // 4. vercel.app 도메인에서 삭제
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.vercel.app;`;
          
          // 5. 현재 도메인에서 다시 삭제 (확실히)
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
        });
        
        console.log('✅ 양쪽 도메인에서 쿠키 삭제 완료');
        console.log('삭제 후 쿠키:', document.cookie);
        
        // 브라우저 스토리지도 정리
        localStorage.clear();
        sessionStorage.clear();
        
        // 로그아웃 시간 기록 (재로그인 방지)
        localStorage.setItem('logoutTime', Date.now().toString());
        
        setIsAuthenticated(false);
        
        // 강제로 페이지 새로고침 (완전한 로그아웃)
        window.location.href = '/';
      }
    } catch (error: any) {
      console.error('❌ 로그아웃 중 에러 발생:', error);
      
      // 에러가 발생해도 클라이언트 측에서 로그아웃 처리
      console.log('클라이언트 측에서 로그아웃 처리합니다.');
      setIsAuthenticated(false);
      window.location.replace('/');
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
