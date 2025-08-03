// 쿠키 관련 유틸리티 함수들

/**
 * 쿠키 값을 가져오는 함수
 * @param name 쿠키 이름
 * @returns 쿠키 값 또는 null
 */
export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

/**
 * 쿠키가 존재하는지 확인하는 함수
 * @param name 쿠키 이름
 * @returns 쿠키 존재 여부
 */
export const hasCookie = (name: string): boolean => {
  return getCookie(name) !== null;
};

/**
 * 모든 쿠키를 로그로 출력하는 함수
 */
export const logAllCookies = (): void => {
  console.log('현재 모든 쿠키:', document.cookie);
  const cookies = document.cookie.split(';');
  cookies.forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    console.log(`쿠키: ${name} = ${value}`);
  });
};

/**
 * 특정 쿠키들을 확인하는 함수
 * @param cookieNames 확인할 쿠키 이름 배열
 */
export const checkSpecificCookies = (cookieNames: string[]): void => {
  console.log('특정 쿠키 확인:');
  cookieNames.forEach(name => {
    const value = getCookie(name);
    console.log(`${name}: ${value ? '존재함' : '없음'} (${value || 'N/A'})`);
  });
};

/**
 * 인증 관련 쿠키들을 확인하는 함수
 */
export const checkAuthCookies = (): void => {
  checkSpecificCookies(['access', 'refresh']);
};

/**
 * 도메인 정보와 쿠키 상태를 상세히 확인하는 함수
 */
export const checkDomainAndCookies = (): void => {
  console.log('=== 도메인 및 쿠키 상태 확인 ===');
  console.log('현재 도메인:', window.location.hostname);
  console.log('현재 프로토콜:', window.location.protocol);
  console.log('현재 origin:', window.location.origin);
  console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
  console.log('전체 쿠키:', document.cookie);
  
  const authCookies = ['access', 'refresh'];
  authCookies.forEach(name => {
    const value = getCookie(name);
    console.log(`인증 쿠키 ${name}: ${value ? '존재함' : '없음'}`);
    if (value) {
      console.log(`  - 값: ${value.substring(0, 20)}...`);
    }
  });
  
  // 쿠키가 없는 경우 해결 방안 제시
  if (!hasCookie('access') && !hasCookie('refresh')) {
    console.warn('⚠️ 인증 쿠키가 없습니다. 다음 중 하나를 시도해보세요:');
    console.warn('1. 로그아웃 후 다시 로그인');
    console.warn('2. 브라우저 쿠키 삭제 후 다시 로그인');
    console.warn('3. 시크릿 모드에서 테스트');
  }
};

/**
 * 강력한 쿠키 삭제 함수 (SameSite=None + Secure 문제 해결)
 */
export const clearAllCookies = (): void => {
  console.log('=== 강력한 쿠키 삭제 시작 ===');
  
  // 현재 쿠키 목록 가져오기
  const cookies = document.cookie.split(';');
  console.log('삭제할 쿠키 목록:', cookies);
  
  // 각 쿠키를 다양한 설정으로 삭제 시도
  cookies.forEach(cookie => {
    const [name] = cookie.trim().split('=');
    if (name) {
      console.log(`쿠키 삭제 시도: ${name}`);
      
      // 다양한 도메인과 경로 조합으로 삭제
      const deleteOptions = [
        // 기본 삭제
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`,
        
        // 현재 도메인으로 삭제
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`,
        
        // 서브도메인 포함 삭제
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`,
        
        // localhost 특별 처리
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;`,
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.localhost;`,
        
        // vercel.app 도메인 삭제
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.vercel.app;`,
        
        // jangmadang.site 도메인 삭제
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.jangmadang.site;`,
        
        // SameSite=None + Secure 설정으로 삭제 (HTTPS 환경)
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure;`,
        
        // SameSite=Lax로 삭제
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax;`,
        
        // SameSite=Strict로 삭제
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict;`,
      ];
      
      deleteOptions.forEach(option => {
        try {
          document.cookie = option;
        } catch (error) {
          console.warn(`쿠키 삭제 실패 (${name}):`, option, error);
        }
      });
    }
  });
  
  console.log('쿠키 삭제 완료');
  console.log('삭제 후 쿠키 상태:', document.cookie);
};

/**
 * 특정 쿠키만 강력하게 삭제하는 함수
 */
export const clearSpecificCookies = (cookieNames: string[]): void => {
  console.log(`=== 특정 쿠키 삭제: ${cookieNames.join(', ')} ===`);
  
  cookieNames.forEach(name => {
    console.log(`쿠키 삭제 시도: ${name}`);
    
    const deleteOptions = [
      `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`,
      `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`,
      `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`,
      `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;`,
      `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.localhost;`,
      `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.vercel.app;`,
      `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.jangmadang.site;`,
      `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure;`,
      `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax;`,
      `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict;`,
    ];
    
    deleteOptions.forEach(option => {
      try {
        document.cookie = option;
      } catch (error) {
        console.warn(`쿠키 삭제 실패 (${name}):`, option, error);
      }
    });
  });
  
  console.log('특정 쿠키 삭제 완료');
};

/**
 * 브라우저 개발자 도구에서 쿠키를 확인하는 안내 함수
 */
export const showCookieDebugInfo = (): void => {
  console.log('=== 쿠키 디버깅 안내 ===');
  console.log('1. 브라우저 개발자 도구 열기 (F12)');
  console.log('2. Application 탭 클릭');
  console.log('3. 왼쪽 사이드바에서 Cookies 클릭');
  console.log('4. 현재 도메인 확인');
  console.log('5. access, refresh 쿠키가 있는지 확인');
  console.log('6. 쿠키의 Domain, Path, SameSite 설정 확인');
  console.log('');
  console.log('현재 페이지 URL:', window.location.href);
  console.log('현재 도메인:', window.location.hostname);
  console.log('현재 프로토콜:', window.location.protocol);
}; 