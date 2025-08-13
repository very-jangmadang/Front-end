import axios from 'axios';

// 환경 변수가 없을 때 기본값 설정
const API_BASE_URL = 'https://api.beta.jangmadang.site';

// 환경 변수 디버깅
console.log('API 설정 정보:', {
  envBaseURL: import.meta.env.VITE_API_BASE_URL,
  actualBaseURL: API_BASE_URL,
  hasAccessToken: !!import.meta.env.VITE_API_ACCESS_TOKEN,
  currentDomain: window.location.hostname,
  currentOrigin: window.location.origin,
  userAgent: navigator.userAgent,
  cookies: document.cookie,
  isSecure: window.location.protocol === 'https:',
});

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    // Authorization 헤더는 토큰이 있을 때만 설정
    ...(import.meta.env.VITE_API_ACCESS_TOKEN && {
      Authorization: `Bearer ${import.meta.env.VITE_API_ACCESS_TOKEN}`,
    }),
  },
  withCredentials: true,
  // 크로스도메인 요청을 위한 추가 설정
  timeout: 10000,
});

// 요청 인터셉터 추가
axiosInstance.interceptors.request.use(
  (config) => {
    // 크로스도메인 요청을 위한 헤더 설정 (CORS 허용된 헤더만)
    if (config.headers) {
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      // CORS 에러 방지를 위해 커스텀 헤더 제거
      // config.headers['X-Client-Domain'] = window.location.hostname;
      // config.headers['X-Client-Origin'] = window.location.origin;
    }

    return config;
  },
  (error) => {
    console.error('API 요청 에러:', error);
    return Promise.reject(error);
  },
);

// 응답 인터셉터 추가
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API 응답 에러:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message,
      // CORS 에러인지 확인
      isCorsError:
        error.message.includes('Network Error') ||
        error.message.includes('CORS'),
      // 쿠키 관련 에러인지 확인
      isCookieError:
        error.response?.status === 401 || error.response?.status === 403,
    });

    // CORS 에러인 경우 특별한 처리
    if (
      error.message.includes('Network Error') ||
      error.message.includes('CORS')
    ) {
      console.error('🚨 CORS 에러 발생! 백엔드 CORS 설정을 확인하세요.');
      console.error('백엔드에서 다음 설정이 필요합니다:');
      console.error('- allowedOrigins에 현재 도메인 추가');
      console.error('- allowCredentials: true 설정');
      console.error('- allowedHeaders에 필요한 헤더들 추가');
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
