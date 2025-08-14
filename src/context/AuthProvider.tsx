import { useState, useEffect, ReactNode } from 'react';
import { AuthContext, AuthContextType } from './AuthContext';
import axiosInstance from '../apis/axiosInstance';

const MAX_RETRIES = 1; // 재시도 횟수를 제한 (예: 1번)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);
  const [isBusiness, setIsBusiness] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

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
    
    // 상태 업데이트가 완료될 때까지 잠시 대기
    await new Promise(resolve => setTimeout(resolve, 100));
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
        // 백엔드 세션이 무효화되지 않는 문제를 해결하기 위해 더 강력한 방법 사용
        setTimeout(() => {
          // 1초 후 강제 새로고침
          window.location.reload();
        }, 1000);
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

  // 사업자 여부 확인 함수
  const checkBusinessStatus = async () => {
    try {
      console.log('=== AuthProvider: /api/permit/me API 호출 시작 ===');
      const response = await axiosInstance.get('/api/permit/me', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      console.log('=== AuthProvider: /api/permit/me API 응답 ===', response.data);
      
      if (response.data.isSuccess) {
        console.log('=== AuthProvider: 사업자 계정입니다 ===');
        setIsBusiness(true);
      } else {
        console.log('=== AuthProvider: 일반 사용자 계정입니다 ===');
        setIsBusiness(false);
      }
    } catch (err) {
      console.log('=== AuthProvider: /api/permit/me API 실패 - 일반 사용자로 처리 ===', err);
      setIsBusiness(false);
    }
  };

  // 앱 로드 시 로그인 상태 체크
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await login();
        // login 함수가 완전히 완료된 후에만 초기화 완료로 설정
        console.log('=== AuthProvider: 인증 초기화 완료 ===');
        // 상태 업데이트가 완료될 때까지 추가 대기
        await new Promise(resolve => setTimeout(resolve, 200));
        setIsInitialized(true);
      } catch (error) {
        console.error('=== AuthProvider: 인증 초기화 실패 ===', error);
        // 에러가 발생해도 초기화는 완료로 설정 (무한 대기 방지)
        setIsInitialized(true);
      }
    };
    initializeAuth();
  }, []);

  // 로그인 상태가 변경될 때마다 사업자 여부도 확인
  useEffect(() => {
    if (isAuthenticated) {
      checkBusinessStatus();
    } else {
      setIsBusiness(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    console.log('isAuthenticated 변경됨:', isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    console.log('isBusiness 변경됨:', isBusiness);
  }, [isBusiness]);

  const value: AuthContextType = {
    isAuthenticated,
    isBusiness,
    isInitialized,
    login,
    logout,
    checkBusinessStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
