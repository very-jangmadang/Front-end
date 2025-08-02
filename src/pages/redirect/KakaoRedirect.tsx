import { useEffect } from 'react';
import { useModalContext } from '../../components/Modal/context/ModalContext';
import ConsentModal from '../login/components/ConsentModal';
import styled from 'styled-components';
import { SetCookie } from '../../apis/payAPI';
import { useSearchParams } from 'react-router-dom';

function KakaoRedirect() {
  const { openModal } = useModalContext();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    console.log('KakaoRedirect useEffect 실행됨!');
    console.log('현재 URL:', window.location.href);
    console.log('URL 파라미터:', Object.fromEntries(searchParams.entries()));
    
    const handleKakaoLogin = async () => {
      try {
        // URL 파라미터에서 토큰과 이메일 추출
        const token = searchParams.get('token');
        const email = searchParams.get('email');
        const isNewUser = searchParams.get('isNewUser') === 'true';
        
        console.log('추출된 파라미터:', { token, email, isNewUser });

        if (token) {
          console.log('토큰 설정 시작...');
          // 토큰을 서버에 전송하여 쿠키 설정
          await SetCookie(token);
          
          console.log('쿠키 설정 완료');
          console.log('현재 쿠키:', document.cookie);
        } else {
          console.warn('토큰이 없습니다!');
        }

        // 약간의 지연 후 다음 모달 열기
        setTimeout(() => {
          if (isNewUser) {
            console.log('신규 사용자 - 약관 동의 모달 열기');
            // 신규 사용자인 경우 이메일 정보와 함께 약관 동의 모달 열기
            openModal(({ onClose }) => <ConsentModal onClose={onClose} email={email} />);
          } else {
            console.log('기존 사용자 - 홈으로 리다이렉트');
            // 기존 사용자인 경우 바로 홈으로 리다이렉트
            window.location.href = '/';
          }
        }, 100);
        
      } catch (error) {
        console.error('카카오 로그인 처리 중 오류:', error);
        // 오류 발생 시 홈으로 리다이렉트
        window.location.href = '/';
      }
    };

    handleKakaoLogin();
  }, [searchParams, openModal]);

  return <Container></Container>;
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default KakaoRedirect;
