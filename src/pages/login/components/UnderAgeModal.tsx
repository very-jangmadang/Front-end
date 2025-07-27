import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import sadVector from '../../../assets/sadVector.png';
import Modal from '../../../components/Modal/Modal';
import media from '../../../styles/media';
import { useNavigate } from 'react-router-dom';

interface ModalProps {
  onClose: () => void;
}

const UnderAgeModal: React.FC<ModalProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 745 : false,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 745);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    console.log('KakaoRedirect useEffect 실행됨!');
    setTimeout(() => {
      navigate('/');
    }, 3500);
  }, []);

  const Content = (
    <Contents>
      <Container>
        <Img src={sadVector} />
        <Title>만 14세 미만은 이용할 수 없습니다.</Title>
      </Container>
    </Contents>
  );

  return isLargeScreen ? <Modal onClose={onClose}>{Content}</Modal> : Content;
};

const Contents = styled.div`
  ${media.notLarge`
    background-color: white;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    position: fixed; 
    top: 0;
    left: 0;
    display: flex;
  align-items: center; 
  justify-content: center;
  `}
`;

const Title = styled.div`
  font-family: Pretendard;
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  margin-bottom: 168px;
`;

const Img = styled.img`
  width: 67px;
  height: 65px;
  margin-top: 134px;
  margin-bottom: 42.5px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default UnderAgeModal;
