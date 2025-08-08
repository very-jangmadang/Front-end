import { useEffect } from 'react';
import { useWepin } from '../../context/WepinContext';
import { getCookie } from '../../utils/cookieUtils';
import { WepinSDK } from '@wepin/sdk-js';
import { WepinLogin } from '@wepin/login-js';
/**
 * Wepin SDK를 초기화하고 idToken으로 로그인하는 컴포넌트.
 * 이 컴포넌트는 UI를 렌더링하지 않으며, 로그인 후 메인 페이지 레이아웃에 한 번만 포함시키면 됩니다.
 */
const WepinInitializer = () => {
  const { wepin, setWepin } = useWepin();

  useEffect(() => {
    // 이미 초기화되었다면 중복 실행 방지
    if (wepin) {
      return;
    }

    const initWepin = async () => {
      let idToken: string | null = null;

      // 로컬 개발 환경에서는 .env.local 파일의 테스트 토큰을 우선적으로 사용합니다.
      if (import.meta.env.DEV) {
        idToken = import.meta.env.VITE_WEPIN_TEST_ID_TOKEN || null;
        if (idToken) {
          console.warn('Local Dev: Using test idToken from .env.local');
        }
      }

      // 테스트 토큰이 없거나 운영 환경일 경우 쿠키에서 가져옵니다.
      if (!idToken) {
        idToken = getCookie('idToken');
      }

      // idToken이 있을 때만 Wepin 초기화 진행
      if (idToken) {
        try {
          console.log('Wepin 로그인 일원화를 시작합니다...');

          // 1. @wepin/login-js를 사용하여 외부 idToken으로 로그인
          const wepinLogin = new WepinLogin({
            appId: import.meta.env.VITE_WEPIN_APP_ID,
            appKey: import.meta.env.VITE_WEPIN_APP_KEY,
          });
          await wepinLogin.init();

          // 공식 문서에 따라 'token' 파라미터를 사용합니다.
          const loginResult = await wepinLogin.loginWithIdToken({
            token: idToken,
          });

          console.log('Wepin Login 성공. Wepin SDK를 초기화합니다.');

          // 2. @wepin/sdk-js를 Wepin의 토큰으로 초기화
          const wepinSDK = new WepinSDK({
            appId: import.meta.env.VITE_WEPIN_APP_ID,
            appKey: import.meta.env.VITE_WEPIN_APP_KEY,
          });
          await wepinSDK.init({ defaultLanguage: 'ko' });
          await wepinSDK.setToken({
            accessToken: loginResult.token.idToken,
            refreshToken: loginResult.token.refreshToken,
          });

          console.log('Wepin SDK 인증 완료.');
          setWepin(wepinSDK); // 인증된 SDK 인스턴스를 Context에 저장
        } catch (error) {
          console.error('Wepin SDK 초기화 또는 로그인에 실패했습니다:', error);
        }
      } else {
        // 토큰이 없는 경우에 대한 로그
        if (import.meta.env.DEV) {
          console.log(
            'Local Dev: idToken not found. Please add VITE_WEPIN_TEST_ID_TOKEN to your .env.local file.',
          );
        } else {
          console.log(
            'Production: idToken cookie not found. Login is required.',
          );
        }
      }
    };

    initWepin();
  }, [wepin, setWepin]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다.
};

export default WepinInitializer;
