import { useState, useEffect, ReactNode } from 'react';
import { AuthContext, AuthContextType } from './AuthContext';
import axiosInstance from '../apis/axiosInstance';
import { 
  clearAllCookies, 
  clearSpecificCookies, 
  checkDomainAndCookies, 
  showCookieDebugInfo,
  ultraClearAllCookies,
  clearCookiesViaIframe,
  clearAllBrowserStorage
} from '../utils/cookieUtils';

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

    // 로그아웃 후 강제 대기 시간 (5초로 증가)
    const logoutTime = localStorage.getItem('logoutTime');
    if (logoutTime) {
      const timeSinceLogout = Date.now() - parseInt(logoutTime);
      if (timeSinceLogout < 5000) { // 3초에서 5초로 증가
        console.log('로그아웃 후 대기 시간 중, 로그인 체크 건너뜀');
        setIsAuthenticated(false);
        return;
      } else {
        // 대기 시간이 지나면 로그아웃 시간 기록 삭제
        localStorage.removeItem('logoutTime');
      }
    }

    // 추가: sessionStorage에서도 로그아웃 상태 확인
    const sessionLogoutTime = sessionStorage.getItem('logoutTime');
    if (sessionLogoutTime) {
      const timeSinceSessionLogout = Date.now() - parseInt(sessionLogoutTime);
      if (timeSinceSessionLogout < 5000) {
        console.log('세션 로그아웃 후 대기 시간 중, 로그인 체크 건너뜀');
        setIsAuthenticated(false);
        return;
      } else {
        sessionStorage.removeItem('logoutTime');
      }
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
      
      // 크로스 도메인 쿠키 디버깅
      console.log('현재 도메인 정보:', {
        currentDomain: window.location.hostname,
        currentOrigin: window.location.origin,
        apiDomain: import.meta.env.VITE_API_BASE_URL,
        cookies: document.cookie,
        hasCredentials: true
      });
      
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
    console.log('=== 초강력 로그아웃 시작 (완전한 다중 도메인 대응) ===');
    checkDomainAndCookies(); // 로그아웃 전 상태 확인
    showCookieDebugInfo(); // 디버깅 안내
    
    setIsLoggingOut(true); // 로그아웃 시작
    setIsAuthenticated(false); // 즉시 인증 상태를 false로 설정
    
    // 로그아웃 시간 기록 (자동 로그인 방지용)
    localStorage.setItem('logoutTime', Date.now().toString());
    sessionStorage.setItem('logoutTime', Date.now().toString());
    
    // 1단계: 서버 로그아웃 요청 (여러 번 시도)
    console.log('1단계: 서버 로그아웃 요청 시작');
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`서버 로그아웃 시도 ${attempt}/3`);
        const response = await axiosInstance.post(
          '/api/permit/logout',
          {},
          { 
            withCredentials: true,
          },
        );
        
        console.log('서버 로그아웃 응답:', response);
        
        const responseData = response.data;
        if (responseData && responseData.isSuccess) {
          console.log('✅ 서버 로그아웃 성공:', responseData.message);
          break; // 성공하면 루프 종료
        } else {
          console.warn('⚠️ 로그아웃 응답 형식 이상:', responseData);
        }
        
      } catch (error: any) {
        console.error(`❌ 서버 로그아웃 시도 ${attempt} 실패:`, error);
        
        if (error.response) {
          console.error('서버 응답 에러:', {
            status: error.response.status,
            responseCode: error.response.data?.code,
            message: error.response.data?.message,
          });
        } else {
          console.error('네트워크 에러:', error);
        }
        
        // 마지막 시도가 아니면 잠시 대기 후 재시도
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    // 2단계: 초강력 다중 도메인 쿠키 정리
    console.log('2단계: 초강력 다중 도메인 쿠키 정리 시작');
    await ultraClearAllCookies();
    
    // 3단계: iframe을 사용한 크로스도메인 쿠키 삭제
    console.log('3단계: iframe을 사용한 크로스도메인 쿠키 삭제');
    await clearCookiesViaIframe();
    
    // 4단계: 브라우저 스토리지 정리 (초강화)
    console.log('4단계: 브라우저 스토리지 정리 (초강화)');
    await clearAllBrowserStorage();
    
    // 5단계: 추가 쿠키 삭제 시도 (최종)
    console.log('5단계: 최종 쿠키 삭제 시도');
    setTimeout(async () => {
      await ultraClearAllCookies();
    }, 1000);
    
    // 6단계: 최종 상태 확인
    console.log('6단계: 로그아웃 후 최종 쿠키 상태 확인');
    setTimeout(() => {
      checkDomainAndCookies();
    }, 2000);
    
    console.log('✅ 인증 상태를 false로 설정 완료');
    
    // 7단계: 완료 처리 (더 긴 대기 시간)
    setTimeout(() => {
      console.log('✅ 초강력 다중 도메인 로그아웃 완료 - 홈으로 이동');
      setIsLoggingOut(false);
      
      // URL 파라미터 정리
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      
      // 강제 새로고침으로 완전한 상태 초기화
      window.location.reload();
    }, 5000); // 시간을 더 늘려서 모든 정리 작업 완료 보장
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
