import { WepinSDK } from '@wepin/sdk-js';
import { useWepin } from '../context/WepinContext';

export const useWepinLogin = () => {
  const { setWepin } = useWepin();

  const handleWepinLogin = async () => {
    try {
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

      // 사용자가 로그인을 완료하면 사용자 정보를 반환합니다.
      const userInfo = await wepinSdk.loginWithUI();

      // 4. 로그인 성공 여부 확인
      if (userInfo && userInfo.status === 'success') {
        console.log('Wepin 로그인 성공:', userInfo);
        // 5. 사용자가 신규 가입하여 PIN 설정 등이 필요한지 확인
        const loginStatus = userInfo.userStatus.loginStatus;
        if (
          loginStatus === 'registerRequired' ||
          loginStatus === 'pinRequired'
        ) {
          console.log('최초 사용자입니다. Wepin 지갑 생성을 시작합니다.');
          // register()를 호출하면 PIN 설정 위젯이 나타납니다.
          const registerInfo = await wepinSdk.register();
          console.log('Wepin 지갑 생성 완료:', registerInfo);
        }

        // 6. 모든 과정이 완료된 인증된 SDK 인스턴스를 전역 Context에 저장
        setWepin(wepinSdk);
      } else {
        console.log('Wepin 로그인 실패 또는 취소');
      }
    } catch (error) {
      console.error('Wepin 로그인 중 오류 발생:', error);
    }
  };

  return { handleWepinLogin };
};
