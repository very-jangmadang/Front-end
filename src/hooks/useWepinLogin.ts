import { WepinSDK } from '@wepin/sdk-js';
import { useWepin } from '../context/WepinContext';

export const useWepinLogin = () => {
  const { setWepin } = useWepin();

  const handleWepinLogin = async (): Promise<WepinSDK | null> => {
    try {
      const wepinSdk = new WepinSDK({
        appId: import.meta.env.VITE_WEPIN_APP_ID,
        appKey: import.meta.env.VITE_WEPIN_APP_KEY,
      });
      await wepinSdk.init({
        type: 'show', // 사용자가 상호작용할 수 있도록 'show'로 변경해야 합니다.
        defaultLanguage: 'ko',
        defaultCurrency: 'KRW',
        loginProviders: ['google'],
      });

      // 사용자가 로그인을 완료하면 사용자 정보를 반환합니다.
      const userInfo = await wepinSdk.loginWithUI();

      if (userInfo && userInfo.status === 'success') {
        console.log('Wepin 로그인 성공:', userInfo);

        const loginStatus = userInfo.userStatus.loginStatus;
        if (
          loginStatus === 'registerRequired' ||
          loginStatus === 'pinRequired'
        ) {
          console.log('최초 사용자입니다. Wepin 지갑 생성을 시작합니다.');
          await wepinSdk.register();
        }

        // 전역 Context에 저장하고,
        setWepin(wepinSdk);
        // 즉시 사용할 수 있도록 인스턴스를 반환합니다.
        return wepinSdk;
      } else {
        console.log('Wepin 로그인 실패 또는 취소');
        return null;
      }
    } catch (error) {
      console.error('Wepin 로그인 중 오류 발생:', error);
      return null;
    }
  };

  return { handleWepinLogin };
};
