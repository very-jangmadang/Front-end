import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ticket from '../../../assets/ticketLogo.png';
import { Icon } from '@iconify/react';
import Modal from '../../../components/Modal/Modal';
import media from '../../../styles/media';

interface ModalProps {
  onClose: () => void;
}

const LogInModal: React.FC<ModalProps> = ({ onClose }) => {
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

  const handleLogin = () => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    window.location.href = `${apiBaseUrl}/login/oauth2/code/kakao`;
  };

  const Content = (
    <Contents>
      <Container>
        <Img src={ticket} />
        <Title>응모로 성사되는 즐거운 중고거래 장마당</Title>
        <Short>간편하게 가입하고 응모하러 가볼까요?</Short>
        <LoginButtons onClick={handleLogin}>
          <Icon
            icon="raphael:bubble"
            style={{
              width: '16px',
              height: '13px',
              color: 'black',
            }}
          />
          <Kakao>5초 만에 카카오로 시작하기</Kakao>
        </LoginButtons>
        <Border>
          <Line />
          <And>또는</And>
          <Line />
        </Border>
        <Circles>
          <Circle />
          <Circle />
          <Circle />
        </Circles>
      </Container>
    </Contents>
  );

  return isLargeScreen ? <Modal onClose={onClose}>{Content}</Modal> : Content;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

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

const Img = styled.img`
  width: 102px;
  height: 47px;
  margin-top: 54px;

  ${media.medium`
    width: 102px;
    height: 47px;
  `}
`;

const Circle = styled.div`
  width: 45px;
  height: 45px;
  border: 0;
  border-radius: 100%;
  background-color: #d9d9d9;
`;

const Circles = styled.div`
  display: flex;
  column-gap: 30px;
  justify-content: center;
`;

const Border = styled.div`
  display: flex;
  column-gap: 10.7px;
  align-items: center;
  margin-bottom: 24px;
`;

const And = styled.div`
  color: #7d7d7d;
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const Line = styled.div`
  width: 127.931px;
  height: 1.325px;
  background-color: #7d7d7d;
`;

const Kakao = styled.div`
  display: flex;
  width: 169px;
  height: 17px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  transform: translateY(1px);
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  font-family: Pretendard;
`;

const LoginButtons = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 275px;
  height: 39px;
  border-radius: 7px;
  border: 0;
  background-color: #fbe44e;
  color: black;
  margin-bottom: 17px;
  ${media.medium`
    width: 344px;
    height: 45px;
    margin-bottom: 22px;
  `}
  ${media.small`
    width: 325px;
    height: 45px;
    margin-bottom: 22px;
  `}
`;

const Short = styled.div`
  color: #7d7d7d;
  text-align: center;
  font-family: Pretendard;
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: 18px;
  margin-bottom: 95px;
  ${media.medium`
    margin-bottom: 316px;
    font-size: 17px;
  `}
  ${media.small`
    margin-bottom: 219px;
    font-size: 15px;
  `}
`;

const Title = styled.div`
  margin-top: 11px;
  text-align: center;
  font-size: 17px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px;
  margin-bottom: 13px;

  ${media.notLarge`
    margin-top: 31px;
    font-size: 20px;
  `}
`;

export default LogInModal;
