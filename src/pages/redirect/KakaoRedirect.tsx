import { useEffect } from 'react';
import { useModalContext } from '../../components/Modal/context/ModalContext';
import ConsentModal from '../login/components/ConsentModal';
import styled from 'styled-components';

function KakaoRedirect() {
  const { openModal } = useModalContext();

  useEffect(() => {
    console.log('KakaoRedirect useEffect 실행됨');
    console.log('현재 URL:', window.location.href);
    
    const handleKakaoLogin = async () => {
      try {
        console.log('카카오 로그인 처리 시작');
        
        // 세션 방식으로 처리 (기존 방식 유지)
        // 서버에서 세션을 통해 사용자 정보를 확인
        const response = await fetch('/api/permit/user-info', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('사용자 정보:', data);
          
          if (data.result === 'user') {
            // 기존 사용자 - 홈으로 리다이렉트
            console.log('기존 사용자 - 홈으로 리다이렉트');
            window.location.href = '/';
          } else {
            // 신규 사용자 - 약관 동의 모달 열기
            console.log('신규 사용자 - 약관 동의 모달 열기');
            openModal(({ onClose }) => <ConsentModal onClose={onClose} />);
          }
        } else {
          console.error('사용자 정보 조회 실패');
          window.location.href = '/';
        }
        
      } catch (error) {
        console.error('카카오 로그인 처리 중 오류:', error);
        window.location.href = '/';
      }
    };

    handleKakaoLogin();
  }, [openModal]);

  return <Container></Container>;
}

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
`;

export default KakaoRedirect;
