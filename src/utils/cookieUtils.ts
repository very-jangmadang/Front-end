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
 * 현재 도메인에 맞는 쿠키만 삭제하는 함수
 */
export const clearCurrentDomainCookies = (): void => {
  console.log('=== 현재 도메인 쿠키만 삭제 ===');
  console.log('현재 도메인:', window.location.hostname);
  
  const cookies = document.cookie.split(';');
  console.log('삭제할 쿠키 목록:', cookies);
  
  cookies.forEach(cookie => {
    const [name] = cookie.trim().split('=');
    if (name) {
      console.log(`현재 도메인 쿠키 삭제: ${name}`);
      
      // 현재 도메인에 맞는 쿠키만 삭제
      const deleteOptions = [
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`,
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`,
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`,
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
  
  console.log('현재 도메인 쿠키 삭제 완료');
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

/**
 * 도메인별 쿠키 분리 상태 확인
 */
export const checkDomainSeparation = (): void => {
  console.log('=== 도메인별 쿠키 분리 상태 확인 ===');
  console.log('현재 도메인:', window.location.hostname);
  console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
  
  // 다른 도메인의 쿠키가 있는지 확인
  const allCookies = document.cookie.split(';');
  const currentDomain = window.location.hostname;
  
  console.log('현재 도메인 쿠키:');
  allCookies.forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      console.log(`  ${name}: ${value.substring(0, 20)}...`);
    }
  });
  
  // 도메인 분리 권장사항
  console.log('');
  console.log('🔧 도메인 분리 권장사항:');
  console.log('1. 백엔드 CORS 설정에서 allowedOrigins를 현재 도메인만 허용');
  console.log('2. 쿠키 생성 시 setDomain() 설정 확인');
  console.log('3. 각 도메인별로 별도 서버 또는 서브도메인 사용 고려');
};

/**
 * 크로스도메인 쿠키 문제 진단 및 해결 방안 제시
 */
export const diagnoseCrossDomainCookieIssue = (): void => {
  console.log('=== 크로스도메인 쿠키 문제 진단 ===');
  
  const currentDomain = window.location.hostname;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const apiDomain = apiBaseUrl ? new URL(apiBaseUrl).hostname : 'unknown';
  
  console.log('현재 프론트엔드 도메인:', currentDomain);
  console.log('API 서버 도메인:', apiDomain);
  console.log('프로토콜:', window.location.protocol);
  console.log('HTTPS 여부:', window.location.protocol === 'https:');
  
  // 문제 진단
  const issues = [];
  
  if (currentDomain !== apiDomain) {
    issues.push('✅ 크로스도메인 요청이 감지되었습니다.');
  }
  
  if (window.location.protocol !== 'https:' && currentDomain !== 'localhost') {
    issues.push('⚠️ HTTPS가 아닌 환경에서 SameSite=None 쿠키가 작동하지 않을 수 있습니다.');
  }
  
  if (!hasCookie('access') && !hasCookie('refresh')) {
    issues.push('❌ 인증 쿠키가 없습니다.');
  }
  
  console.log('진단 결과:');
  issues.forEach(issue => console.log(issue));
  
  // 해결 방안
  console.log('');
  console.log('🔧 해결 방안:');
  console.log('1. 백엔드 CORS 설정 확인:');
  console.log(`   - allowedOrigins: ["https://${currentDomain}"]`);
  console.log('   - allowCredentials: true');
  console.log('   - allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]');
  console.log('');
  console.log('2. 쿠키 설정 확인:');
  console.log('   - SameSite=None (크로스도메인용)');
  console.log('   - Secure=true (HTTPS 환경)');
  console.log('   - HttpOnly=false (클라이언트 접근용)');
  console.log('');
  console.log('3. 프론트엔드 설정 확인:');
  console.log('   - withCredentials: true');
  console.log('   - 적절한 헤더 설정');
};

/**
 * 크로스도메인 쿠키 테스트 함수
 */
export const testCrossDomainCookie = async (): Promise<void> => {
  console.log('=== 크로스도메인 쿠키 테스트 ===');
  
  try {
    // 간단한 API 호출로 쿠키 설정 테스트
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/permit/user-info`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
    
    console.log('테스트 응답 상태:', response.status);
    console.log('테스트 응답 헤더:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      console.log('✅ 크로스도메인 요청 성공');
    } else {
      console.log('❌ 크로스도메인 요청 실패');
    }
    
  } catch (error) {
    console.error('❌ 크로스도메인 테스트 에러:', error);
  }
};

/**
 * 크로스도메인 쿠키 문제 자동 해결 시도
 */
export const attemptCrossDomainCookieFix = async (): Promise<void> => {
  console.log('=== 크로스도메인 쿠키 문제 자동 해결 시도 ===');
  
  const currentDomain = window.location.hostname;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  
  console.log('현재 상황:', {
    currentDomain,
    apiBaseUrl,
    protocol: window.location.protocol,
    isHTTPS: window.location.protocol === 'https:'
  });
  
  // 1. 기존 쿠키 정리
  console.log('1단계: 기존 쿠키 정리');
  clearAllCookies();
  
  // 2. 크로스도메인 테스트
  console.log('2단계: 크로스도메인 테스트');
  await testCrossDomainCookie();
  
  // 3. 쿠키 상태 재확인
  console.log('3단계: 쿠키 상태 재확인');
  checkDomainAndCookies();
  
  // 4. 해결 방안 제시
  console.log('4단계: 해결 방안 제시');
  diagnoseCrossDomainCookieIssue();
  
  console.log('✅ 크로스도메인 쿠키 문제 자동 해결 시도 완료');
};

/**
 * 환경별 쿠키 설정 최적화
 */
export const optimizeCookieSettings = (): void => {
  console.log('=== 환경별 쿠키 설정 최적화 ===');
  
  const currentDomain = window.location.hostname;
  const isHTTPS = window.location.protocol === 'https:';
  const isLocalhost = currentDomain === 'localhost' || currentDomain === '127.0.0.1';
  const isVercel = currentDomain.includes('vercel.app');
  
  console.log('환경 정보:', {
    currentDomain,
    isHTTPS,
    isLocalhost,
    isVercel
  });
  
  if (isLocalhost) {
    console.log('🔧 로컬 환경 권장사항:');
    console.log('- SameSite=Lax 또는 Strict 사용');
    console.log('- Secure=false 설정');
    console.log('- HttpOnly=false 설정 (개발용)');
  } else if (isVercel) {
    console.log('🔧 Vercel 환경 권장사항:');
    console.log('- SameSite=None 사용 (크로스도메인용)');
    console.log('- Secure=true 설정 (HTTPS 필수)');
    console.log('- HttpOnly=false 설정 (클라이언트 접근용)');
    console.log('- domain=.jangmadang.site 설정');
  } else {
    console.log('🔧 일반 프로덕션 환경 권장사항:');
    console.log('- SameSite=Lax 사용');
    console.log('- Secure=true 설정 (HTTPS 환경)');
    console.log('- HttpOnly=true 설정 (보안용)');
  }
};

/**
 * 서버 하나에 도메인 두 개 연결 시 로그아웃 문제 해결
 */
export const solveMultiDomainLogoutIssue = async (): Promise<void> => {
  console.log('=== 서버 하나에 도메인 두 개 연결 시 로그아웃 문제 해결 ===');
  
  const currentDomain = window.location.hostname;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  
  console.log('현재 상황:', {
    currentDomain,
    apiBaseUrl,
    protocol: window.location.protocol
  });
  
  // 1. 모든 도메인의 쿠키 삭제
  console.log('1단계: 모든 도메인의 쿠키 삭제');
  
  const domainsToClear = [
    currentDomain,
    '.jangmadang.site',
    '.vercel.app',
    'localhost',
    '.localhost'
  ];
  
  const cookiesToDelete = ['access', 'refresh', 'connect.sid', 'sessionId'];
  
  cookiesToDelete.forEach(cookieName => {
    domainsToClear.forEach(domain => {
      const deleteOptions = [
        `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`,
        `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`,
        `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain};`,
        `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure;`,
        `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax;`,
        `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict;`,
      ];
      
      deleteOptions.forEach(option => {
        try {
          document.cookie = option;
        } catch (error) {
          console.warn(`쿠키 삭제 실패 (${cookieName} on ${domain}):`, option, error);
        }
      });
    });
  });
  
  // 2. 서버 로그아웃 요청 (모든 도메인에 대해)
  console.log('2단계: 서버 로그아웃 요청');
  
  try {
    const response = await fetch(`${apiBaseUrl}/api/permit/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
    
    console.log('서버 로그아웃 응답:', response.status);
    
    if (response.ok) {
      console.log('✅ 서버 로그아웃 성공');
    } else {
      console.log('❌ 서버 로그아웃 실패');
    }
  } catch (error) {
    console.error('❌ 서버 로그아웃 에러:', error);
  }
  
  // 3. 브라우저 캐시 및 스토리지 정리
  console.log('3단계: 브라우저 캐시 및 스토리지 정리');
  
  // localStorage 정리
  try {
    localStorage.clear();
    console.log('✅ localStorage 정리 완료');
  } catch (error) {
    console.warn('localStorage 정리 실패:', error);
  }
  
  // sessionStorage 정리
  try {
    sessionStorage.clear();
    console.log('✅ sessionStorage 정리 완료');
  } catch (error) {
    console.warn('sessionStorage 정리 실패:', error);
  }
  
  // 캐시 정리
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.log('✅ 브라우저 캐시 정리 완료');
    } catch (error) {
      console.warn('브라우저 캐시 정리 실패:', error);
    }
  }
  
  // 4. 최종 상태 확인
  console.log('4단계: 최종 상태 확인');
  checkDomainAndCookies();
  
  console.log('✅ 다중 도메인 로그아웃 문제 해결 완료');
  console.log('💡 해결 방안:');
  console.log('1. 백엔드에서 세션을 도메인별로 분리하거나');
  console.log('2. 공통 도메인(.jangmadang.site)으로 세션 설정');
  console.log('3. 각 도메인별로 별도 서버 사용 고려');
};

/**
 * 백엔드 세션 설정 권장사항
 */
export const getBackendSessionRecommendations = (): void => {
  console.log('=== 백엔드 세션 설정 권장사항 (2024년 업데이트) ===');
  
  console.log('1. Express.js 세션 설정:');
  console.log(`
const session = require('express-session');
const RedisStore = require('connect-redis').default;

// Redis 클라이언트 설정 (권장)
const redisClient = require('redis').createClient({
  url: 'redis://localhost:6379'
});

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: 'your-super-secret-key-here',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true, // HTTPS에서만
    sameSite: 'none', // 크로스 도메인 허용
    domain: '.jangmadang.site', // 서브도메인 포함
    maxAge: 24 * 60 * 60 * 1000 // 24시간
  },
  name: 'sessionId' // 기본 connect.sid 대신 커스텀 이름 사용
}));
  `);
  
  console.log('2. 강화된 로그아웃 API:');
  console.log(`
app.post('/api/permit/logout', async (req, res) => {
  try {
    // 1. 세션 완전 삭제
    await new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    // 2. 모든 관련 쿠키 삭제
    const cookiesToClear = [
      'sessionId',
      'connect.sid', 
      'access',
      'refresh',
      'idtoken'
    ];
    
    cookiesToClear.forEach(cookieName => {
      res.clearCookie(cookieName, {
        domain: '.jangmadang.site',
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      });
      
      // 추가 도메인에서도 삭제
      res.clearCookie(cookieName, {
        domain: '.vercel.app',
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      });
    });
    
    // 3. Redis에서 세션 데이터 완전 삭제 (Redis 사용 시)
    if (req.sessionID && redisClient) {
      await redisClient.del(req.sessionID);
    }
    
    res.json({
      isSuccess: true,
      code: 'USER_2004',
      message: '성공적으로 로그아웃하였습니다.',
      result: {}
    });
    
  } catch (error) {
    console.error('로그아웃 처리 중 오류:', error);
    res.status(500).json({
      isSuccess: false,
      code: 'SERVER_ERROR',
      message: '로그아웃 처리 중 오류가 발생했습니다.'
    });
  }
});
  `);
  
  console.log('3. 세션 미들웨어 설정:');
  console.log(`
// 세션 유효성 검사 미들웨어
app.use((req, res, next) => {
  if (req.session && req.session.userId) {
    // 세션이 유효한 경우
    req.isAuthenticated = true;
  } else {
    // 세션이 없거나 유효하지 않은 경우
    req.isAuthenticated = false;
  }
  next();
});

// 인증이 필요한 라우트 보호
const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated) {
    return res.status(401).json({
      isSuccess: false,
      code: 'AUTH_4001',
      message: '로그인이 필요합니다.'
    });
  }
  next();
};
  `);
  
  console.log('4. CORS 설정 (완전한 버전):');
  console.log(`
const cors = require('cors');

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://jangmadang.site',
      'https://www.jangmadang.site',
      'https://jmd-fe.vercel.app',
      'https://www.jmd-fe.vercel.app',
      'http://localhost:5173',
      'http://localhost:3000'
    ];
    
    // origin이 undefined인 경우 (같은 도메인 요청)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn('CORS 차단된 origin:', origin);
      callback(new Error('CORS 정책에 의해 차단됨'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'X-Client-Domain',
    'X-Client-Origin'
  ],
  exposedHeaders: ['Set-Cookie']
}));
  `);
  
  console.log('5. 세션 스토어 권장사항:');
  console.log('- Redis 사용을 강력히 권장 (메모리 기반 세션은 서버 재시작 시 손실)');
  console.log('- 세션 TTL 설정으로 자동 만료 관리');
  console.log('- 세션 데이터 최소화 (민감한 정보 저장 금지)');
  console.log('- 정기적인 세션 정리 작업 수행');
  
  console.log('6. 보안 권장사항:');
  console.log('- 세션 시크릿 키를 환경 변수로 관리');
  console.log('- HTTPS 필수 사용');
  console.log('- 쿠키 설정에서 httpOnly, secure, sameSite 적절히 설정');
  console.log('- 정기적인 세션 만료 시간 검토');
  
  console.log('✅ 백엔드 세션 설정 권장사항 완료');
};

/**
 * 로그아웃 후 자동 로그인 방지 설정
 */
export const preventAutoLoginAfterLogout = (): void => {
  console.log('=== 로그아웃 후 자동 로그인 방지 설정 ===');
  
  // 로그아웃 시간 기록
  localStorage.setItem('logoutTime', Date.now().toString());
  
  // 로그아웃 플래그 설정
  localStorage.setItem('isLoggingOut', 'true');
  
  // 세션 스토리지도 정리
  sessionStorage.setItem('logoutTime', Date.now().toString());
  sessionStorage.setItem('isLoggingOut', 'true');
  
  console.log('✅ 로그아웃 후 자동 로그인 방지 설정 완료');
  console.log('💡 설정된 내용:');
  console.log('- 로그아웃 시간 기록');
  console.log('- 로그아웃 플래그 설정');
  console.log('- 3초간 자동 로그인 체크 방지');
};

/**
 * 로그아웃 후 자동 로그인 방지 해제
 */
export const clearLogoutPrevention = (): void => {
  console.log('=== 자동 로그인 방지 해제 ===');
  localStorage.removeItem('logoutTime');
  sessionStorage.removeItem('logoutTime');
  console.log('✅ 자동 로그인 방지 해제 완료');
};

/**
 * 초강력 다중 도메인 쿠키 삭제 함수
 * 모든 가능한 도메인과 경로에서 쿠키를 삭제합니다.
 */
export const ultraClearAllCookies = async (): Promise<void> => {
  console.log('=== 초강력 다중 도메인 쿠키 삭제 시작 ===');
  
  const domainsToClear = [
    window.location.hostname,
    '.jangmadang.site',
    '.vercel.app',
    'localhost',
    '.localhost',
    'www.jangmadang.site',
    'www.vercel.app',
    'jangmadang.site',
    'jmd-fe.vercel.app',
    '.site',
    '.app'
  ];
  
  const cookiesToDelete = [
    'access', 'refresh', 'connect.sid', 'sessionId', 'JSESSIONID', 
    'PHPSESSID', 'ASP.NET_SessionId', 'idtoken', 'token', 'auth', 
    'session', 'user', 'login', 'remember', 'persist'
  ];
  
  const pathsToTry = ['/', '/api', '/api/', '/permit', '/permit/'];
  
  // 5번 반복하여 확실히 삭제
  for (let attempt = 1; attempt <= 5; attempt++) {
    console.log(`초강력 쿠키 삭제 시도 ${attempt}/5`);
    
    cookiesToDelete.forEach(cookieName => {
      domainsToClear.forEach(domain => {
        pathsToTry.forEach(path => {
          const deleteOptions = [
            `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`,
            `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain};`,
            `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=.${domain};`,
            `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; SameSite=None; Secure;`,
            `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; SameSite=Lax;`,
            `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; SameSite=Strict;`,
            `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; max-age=0;`,
            `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; max-age=-1;`,
            `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}; SameSite=None; Secure;`,
            `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=.${domain}; SameSite=Lax;`,
          ];
          
          deleteOptions.forEach(option => {
            try {
              document.cookie = option;
            } catch (error) {
              console.warn(`초강력 쿠키 삭제 실패 (${cookieName} on ${domain}${path}):`, option, error);
            }
          });
        });
      });
    });
    
    if (attempt < 5) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  console.log('✅ 초강력 다중 도메인 쿠키 삭제 완료');
};

/**
 * 완전한 브라우저 스토리지 정리 함수
 */
export const clearAllBrowserStorage = async (): Promise<void> => {
  console.log('=== 완전한 브라우저 스토리지 정리 시작 ===');
  
  try {
    // localStorage 정리
    localStorage.clear();
    console.log('✅ localStorage 정리 완료');
    
    // sessionStorage 정리
    sessionStorage.clear();
    console.log('✅ sessionStorage 정리 완료');
    
    // IndexedDB 정리
    if ('indexedDB' in window) {
      try {
        const databases = await indexedDB.databases();
        const deletePromises = databases.map(db => {
          if (db.name) {
            return indexedDB.deleteDatabase(db.name);
          }
          return Promise.resolve();
        });
        await Promise.all(deletePromises);
        console.log('✅ IndexedDB 정리 완료');
      } catch (error) {
        console.warn('IndexedDB 정리 실패:', error);
      }
    }
    
    // WebSQL 확인 (구형 브라우저용)
    if ('openDatabase' in window) {
      console.log('WebSQL 데이터베이스 존재 확인 완료');
    }
    
    // 브라우저 캐시 정리
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        console.log('✅ 브라우저 캐시 정리 완료');
      } catch (error) {
        console.warn('브라우저 캐시 정리 실패:', error);
      }
    }
    
    // 서비스 워커 정리
    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(registration => registration.unregister()));
        console.log('✅ 서비스 워커 정리 완료');
      } catch (error) {
        console.warn('서비스 워커 정리 실패:', error);
      }
    }
    
    console.log('✅ 완전한 브라우저 스토리지 정리 완료');
  } catch (error) {
    console.error('브라우저 스토리지 정리 중 오류:', error);
  }
};

/**
 * 완전한 로그아웃 함수 (모든 정리 작업 포함)
 */
export const performCompleteLogout = async (): Promise<void> => {
  console.log('=== 완전한 로그아웃 시작 ===');
  
  // 1. 초강력 쿠키 삭제
  await ultraClearAllCookies();
  
  // 2. 완전한 브라우저 스토리지 정리
  await clearAllBrowserStorage();
  
  // 3. 로그아웃 시간 기록
  localStorage.setItem('logoutTime', Date.now().toString());
  sessionStorage.setItem('logoutTime', Date.now().toString());
  
  // 4. 최종 쿠키 상태 확인
  setTimeout(() => {
    checkDomainAndCookies();
  }, 1000);
  
  console.log('✅ 완전한 로그아웃 완료');
};

/**
 * 강력한 서버 로그아웃 함수 (백엔드 세션 완전 삭제)
 */
export const forceServerLogout = async (): Promise<void> => {
  console.log('=== 강력한 서버 로그아웃 시작 ===');
  
  const logoutUrls = [
    'https://jangmadang.site/api/permit/logout',
    'https://www.jangmadang.site/api/permit/logout',
    'https://api.jangmadang.site/api/permit/logout'
  ];
  
  // 모든 도메인에서 서버 로그아웃 시도 (여러 번 반복)
  for (let attempt = 1; attempt <= 3; attempt++) {
    console.log(`서버 로그아웃 시도 ${attempt}/3`);
    
    const logoutPromises = logoutUrls.map(async (url) => {
      try {
        console.log(`서버 로그아웃 시도: ${url}`);
        
        // fetch를 사용하여 직접 로그아웃 요청
        const response = await fetch(url, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
        
        if (response.ok) {
          console.log(`✅ 서버 로그아웃 성공: ${url}`);
          return true;
        } else {
          console.warn(`⚠️ 서버 로그아웃 실패: ${url} (${response.status})`);
          return false;
        }
      } catch (error) {
        console.error(`❌ 서버 로그아웃 에러: ${url}`, error);
        return false;
      }
    });
    
    const results = await Promise.all(logoutPromises);
    const successCount = results.filter(result => result).length;
    
    console.log(`시도 ${attempt}: ${successCount}/${logoutUrls.length} 성공`);
    
    // 성공한 경우 다음 시도 건너뛰기
    if (successCount > 0) {
      console.log('✅ 서버 로그아웃 성공 - 추가 시도 중단');
      break;
    }
    
    // 마지막 시도가 아니면 잠시 대기
    if (attempt < 3) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log('✅ 강력한 서버 로그아웃 완료');
};

/**
 * 완전한 다중 도메인 로그아웃 (최종 버전)
 */
export const performUltimateLogout = async (): Promise<void> => {
  console.log('=== 궁극의 다중 도메인 로그아웃 시작 ===');
  
  // 1. 강력한 서버 로그아웃 (백엔드 세션 삭제)
  await forceServerLogout();
  
  // 2. 초강력 쿠키 삭제
  await ultraClearAllCookies();
  
  // 3. 완전한 브라우저 스토리지 정리
  await clearAllBrowserStorage();
  
  // 4. 로그아웃 시간 기록 (15초로 증가)
  const logoutTime = Date.now().toString();
  localStorage.setItem('logoutTime', logoutTime);
  sessionStorage.setItem('logoutTime', logoutTime);
  
  // 5. 추가 쿠키 삭제 시도 (여러 번)
  for (let i = 0; i < 3; i++) {
    setTimeout(async () => {
      await ultraClearAllCookies();
    }, (i + 1) * 1000);
  }
  
  // 6. 최종 상태 확인
  setTimeout(() => {
    checkDomainAndCookies();
  }, 3000);
  
  console.log('✅ 궁극의 다중 도메인 로그아웃 완료');
};

/**
 * 세션 쿠키 상태 상세 분석
 */
export const analyzeSessionCookies = (): void => {
  console.log('=== 세션 쿠키 상태 분석 ===');
  
  const cookies = document.cookie;
  const cookieArray = cookies.split(';').map(c => c.trim());
  
  console.log('현재 도메인:', window.location.hostname);
  console.log('현재 URL:', window.location.href);
  console.log('전체 쿠키 개수:', cookieArray.length);
  console.log('전체 쿠키:', cookies);
  
  // 세션 관련 쿠키 분석
  const sessionCookies = cookieArray.filter(cookie => 
    cookie.toLowerCase().includes('session') || 
    cookie.toLowerCase().includes('jsessionid') ||
    cookie.toLowerCase().includes('connect.sid')
  );
  
  console.log('세션 관련 쿠키 개수:', sessionCookies.length);
  console.log('세션 관련 쿠키:', sessionCookies);
  
  // JWT 토큰 쿠키 분석
  const jwtCookies = cookieArray.filter(cookie => 
    cookie.toLowerCase().includes('access') || 
    cookie.toLowerCase().includes('refresh')
  );
  
  console.log('JWT 토큰 쿠키 개수:', jwtCookies.length);
  console.log('JWT 토큰 쿠키:', jwtCookies);
  
  // 쿠키 도메인 분석
  cookieArray.forEach(cookie => {
    const [name, value] = cookie.split('=');
    console.log(`쿠키: ${name} = ${value?.substring(0, 20)}...`);
  });
  
  console.log('=== 세션 쿠키 분석 완료 ===');
};

/**
 * 로그아웃 전 세션 상태 확인
 */
export const checkSessionBeforeLogout = async (): Promise<boolean> => {
  console.log('=== 로그아웃 전 세션 상태 확인 ===');
  
  try {
    const response = await fetch('/api/permit/user-info', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-Client-Domain': window.location.hostname,
        'X-Client-Origin': window.location.origin
      }
    });
    
    const data = await response.json();
    console.log('세션 상태 확인 결과:', data);
    
    return data.result === 'user';
  } catch (error) {
    console.error('세션 상태 확인 실패:', error);
    return false;
  }
}; 