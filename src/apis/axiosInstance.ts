import axios from 'axios';

// 환경 변수 디버깅
console.log('API 설정 정보:', {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  hasAccessToken: !!import.meta.env.VITE_API_ACCESS_TOKEN,
  currentDomain: window.location.hostname,
  currentOrigin: window.location.origin,
  userAgent: navigator.userAgent,
  cookies: document.cookie,
  isSecure: window.location.protocol === 'https:'
});

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
  headers: {
    // Authorization 헤더는 토큰이 있을 때만 설정
    ...(import.meta.env.VITE_API_ACCESS_TOKEN && {
      Authorization: `Bearer ${import.meta.env.VITE_API_ACCESS_TOKEN}`
    })
  },
  withCredentials: true,
});

// 요청 인터셉터 추가
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('API 요청:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      withCredentials: config.withCredentials,
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('API 요청 에러:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('API 응답:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API 응답 에러:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;
