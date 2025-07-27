import { PostCharge } from '../apis/payAPI';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';

const usePay = () => {
  const { mutate: postMutation } = useMutation({
    mutationFn: PostCharge,
    onSuccess: (data) => {
      if (!data?.redirectUrl) {
        console.error('🚨 redirectUrl이 존재하지 않습니다.');
        return;
      }

      console.log('🔍 원본 redirectUrl:', data.redirectUrl);

      try {
        let fullRedirectUrl = data.redirectUrl;

        // 만약 상대경로라면 절대경로로 변환
        if (!fullRedirectUrl.startsWith('http')) {
          fullRedirectUrl = `${window.location.origin}${fullRedirectUrl}`;
        }

        console.log('🌍 변환된 URL:', fullRedirectUrl);

        const urlParams = new URLSearchParams(new URL(fullRedirectUrl).search);
        const actualUrl = urlParams.get('url');

        let tid = urlParams.get('tid'); // tid 추출

        if (!tid) {
          console.warn('⚠️ TID가 없어서 "tid"라는 기본 값을 사용합니다.');
          tid = 'tid'; // tid가 없을 경우 기본값 설정
        }

        console.log('🔄 now tid:', tid); // tid 로그 출력

        // 쿠키를 '/api/payment/approve' 경로에 설정
        Cookies.set('tid', tid, {
          expires: 1,
          path: '/', // 전체 경로에서 쿠키 유효
          domain: 'jangmadang.site', // www.jangmadang.site와 api.jangmadang.site에서 쿠키 공유
          secure: true, // HTTPS에서만 쿠키 유효
          sameSite: 'Lax', // SameSite 설정 변경 (보안을 위해 Lax로 설정)
        });

        console.log('쿠키 설정:', document.cookie); // 쿠키가 제대로 설정되었는지 확인

        if (actualUrl && actualUrl.startsWith('https://')) {
          console.log('🔄 Redirecting to:', actualUrl);
          window.location.href = actualUrl;
        } else {
          console.error('🚨 URL parameter "url" not found or invalid.');
        }
      } catch (error) {
        console.error('🚨 Error processing redirect URL:', error);
      }
    },
    onError: (error) => {
      console.log('충전 요청 실패 : ', error);
    },
  });

  return { postMutation };
};

export default usePay;
