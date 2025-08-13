import { useEffect, useRef } from 'react';
import { useModalContext } from '../../components/Modal/context/ModalContext';
import ConsentModal from '../login/components/ConsentModal';
import styled from 'styled-components';
import axiosInstance from '../../apis/axiosInstance';

function KakaoRedirect() {
  const { openModal } = useModalContext();
  const hasProcessed = useRef(false);

  useEffect(() => {
    console.log('=== KakaoRedirect useEffect 실행됨 ===');
    console.log('현재 URL:', window.location.href);
    console.log('현재 쿠키:', document.cookie);
    console.log('이미 처리됨:', hasProcessed.current);
    
    // 이미 처리되었다면 중복 실행 방지
    if (hasProcessed.current) {
      console.log('이미 처리됨 - 중복 실행 방지');
      return;
    }
    
    const handleKakaoLogin = async () => {
      try {
        console.log('카카오 로그인 처리 시작');
        
        // axiosInstance를 사용하여 올바른 baseURL로 요청
        const response = await axiosInstance.get('/api/permit/user-info', {
          withCredentials: true
        });
        
        console.log('사용자 정보 응답:', response.data);
        
        if (response.data.result === 'user') {
          // 기존 사용자 - 홈으로 리다이렉트
          console.log('기존 사용자 - 홈으로 리다이렉트');
          hasProcessed.current = true;
          window.location.href = '/';
        } else {
          // 신규 사용자 - 약관 동의 모달 열기
          console.log('신규 사용자 - 약관 동의 모달 열기');
          hasProcessed.current = true;
          openModal(({ onClose }) => <ConsentModal onClose={onClose} />);
        }
        
      } catch (error) {
        console.error('카카오 로그인 처리 중 오류:', error);
        
        // 에러가 발생해도 신규 사용자로 간주하고 약관 동의 모달 열기
        console.log('에러 발생으로 인해 신규 사용자로 간주, 약관 동의 모달 열기');
        hasProcessed.current = true;
        openModal(({ onClose }) => <ConsentModal onClose={onClose} />);
      }
    };

    // 약간의 지연을 두어 카카오 로그인 처리가 완료될 시간을 줍니다
    setTimeout(() => {
      handleKakaoLogin();
    }, 1000);
  }, []); // openModal을 의존성 배열에서 제거

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
