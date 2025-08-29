import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import vector from '../../../assets/Vector.png';
import Modal from '../../../components/Modal/Modal';
import media from '../../../styles/media';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

interface ModalProps {
  onClose: () => void;
}

const EnterModal: React.FC<ModalProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 745 : false,
  );
  const { login } = useAuth();

  useEffect(() => {
    // EnterModal이 표시될 때 로그인 상태를 확인하고 갱신합니다.
    const performLogin = async () => {
      await login();
    };
    performLogin();
  }, [login]);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 745);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const Content = (
    <Contents>
      {!isLargeScreen && (
        <IconBox style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Icon
            icon={'ei:close-o'}
            style={{
              width: '30px',
              height: '30px',
              color: '#7D7D7D',
            }}
            onClick={onClose}
          />
        </IconBox>
      )}
      <Container>
        <Img src={vector} />
        <Title>장마당에 오신 것을 환영합니다.</Title>
        <Line />
        <Describe>
          장마당에서는 중고물품을 ‘응모’ 기반에 {'\n'}판매하고, 구매할 수 있는
          서비스를 제공{'\n'}합니다. 여러분께 즐거운 판매 기회와 {'\n'}득템의
          기회를 제공하기 위해 최선을 {'\n'}다하겠습니다.
        </Describe>
        <Button onClick={() => navigate('/')}>장마당 입장하기</Button>
      </Container>
    </Contents>
  );
  return isLargeScreen ? <Modal onClose={onClose}>{Content}</Modal> : Content;
};

const IconBox = styled.div`
  display: block;
  justify-content: flex-end;
  position: absolute;
  top: 14px;
  right: 14px;
`;

const Flex = styled.div`
  display: flex;
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
  flex-direction:column;
  overflow-y: auto; 
  overflow-x: hidden;
  `}
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 45px;

  ${media.medium`
    padding-left: 0px;
    padding-top: 289px;
    `}
  ${media.small`
    padding-left: 0px;
    padding-top: 195px;
    `}
`;

const Img = styled.img`
  width: 31px;
  height: 31px;
`;

const Button = styled.button`
  width: 302px;
  height: 39px;
  border-radius: 7px;
  background-color: #c908ff;
  border: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  ${media.medium`
    margin-top: 361px;
    width: 344px;
    height: 45px;
    margin-bottom: 181px;
    `}
  ${media.small`
     margin-top: 271px;
     width: 325px;
     height: 45px;
     margin-bottom: 47px;
    `}
`;

const Describe = styled.div`
  color: #7d7d7d;
  text-align: center;
  font-family: Pretendard;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  white-space: pre-line;
  margin-bottom: 105px;
  ${media.medium`
    margin-bottom: 0px;
    `}
  ${media.small`
    margin-bottom: 0px;
    `}
`;

const Line = styled.div`
  width: 204px;
  height: 1px;
  background: #d9d9d9;
  margin-bottom: 32px;
  ${media.medium`
    width: 344px;
    margin-bottom: 24px;
    `}
  ${media.small`
    width: 204px;
    margin-bottom: 24px;
    `}
`;

const Title = styled.div`
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  margin-bottom: 31px;
  margin-top: 25px;
`;

export default EnterModal;
