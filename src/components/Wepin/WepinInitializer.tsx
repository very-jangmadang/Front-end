import { useEffect } from 'react';
import { useWepin } from '../../context/WepinContext';
import { WepinSDK } from '@wepin/sdk-js';
import { WepinLogin } from '@wepin/login-js';
import axiosInstance from '../../apis/axiosInstance';
import axios from 'axios';
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
      try {
        const response = await axiosInstance.get('/api/permit/idtoken');
        const idToken = response.data.result;
        console.log('Received idToken:', idToken);
        // idToken이 비어있으면 중단합니다.
        if (!idToken) {
          console.log(
            'Received an empty idToken. Wepin initialization skipped.',
          );
          return;
        }

        console.log('Wepin 로그인 일원화를 시작합니다...');
        const wepinLogin = new WepinLogin({
          appId: import.meta.env.VITE_WEPIN_APP_ID,
          appKey: import.meta.env.VITE_WEPIN_APP_KEY,
        });
        await wepinLogin.init('ko');

        if (wepinLogin.isInitialized()) {
          console.log('wepinSDK is initialized!');
        } else {
          console.log('wepinSDK is not initialized!');
        }

        // 공식 문서에 따라 'token' 파라미터를 사용합니다.
        const loginResult = await wepinLogin.loginWithIdToken({
          token: idToken,
        });
        console.log('Wepin Firebase 로그인 결과:', loginResult);
        if (loginResult.error || !loginResult.token) {
          console.error('Wepin Firebase 로그인 실패:', loginResult.error);
          return;
        }

        // Firebase 인증 토큰을 Wepin 서비스용 토큰으로 교환합니다.
        const userInfo = await wepinLogin.loginWepin(loginResult);
        if (!userInfo || !userInfo.token) {
          throw new Error(
            'Wepin 서비스 로그인에 실패했습니다 (Failed to get Wepin service token).',
          );
        }

        const userStatus = userInfo.userStatus;
        if (
          userStatus.loginStatus === 'pinRequired' ||
          userStatus.loginStatus === 'registerRequired'
        ) {
          console.log('User needs to register.');
        }

        console.log('Wepin Login 성공. Wepin SDK를 초기화합니다.');

        // 위젯
        const wepinSdk = new WepinSDK({
          appId: import.meta.env.VITE_WEPIN_APP_ID,
          appKey: import.meta.env.VITE_WEPIN_APP_KEY,
        });
        await wepinSdk.init({
          type: 'hide',
          defaultLanguage: 'ko',
          defaultCurrency: 'KRW',
          loginProviders: ['google'],
        });
        if (wepinSdk.isInitialized()) {
          console.log('wepinSDK is initialized!');
        }
        const status = await wepinSdk.getStatus();
        console.log('Wepin SDK 상태:', status);

        // loginWepin()을 통해 얻은 Wepin 전용 토큰을 사용해야 합니다.
        await wepinSdk.setToken(userInfo.token);

        console.log('Wepin SDK 인증 완료.');
        setWepin(wepinSdk); // 인증된 SDK 인스턴스를 Context에 저장
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          console.log(
            'User not logged in. Wepin initialization skipped.',
            error,
          );
        } else {
          console.error('Wepin SDK 초기화 또는 로그인에 실패했습니다:', error);
        }
      }
    };

    initWepin();
  }, [wepin, setWepin]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다.
};

export default WepinInitializer;
