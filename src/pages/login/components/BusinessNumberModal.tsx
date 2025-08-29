import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import BusinessSignupModal from './BusinessSignupModal';
import Modal from '../../../components/Modal/Modal';
import { useModalContext } from '../../../components/Modal/context/ModalContext';
import media from '../../../styles/media';
import logo from '../../../assets/logo.png';
import { Icon } from '@iconify/react';
import axiosInstance from '../../../apis/axiosInstance';
import { AxiosError } from 'axios';

interface ModalProps {
  onClose: () => void;
}

const BusinessNumberModal: React.FC<ModalProps> = ({ onClose }) => {
  const [businessCode, setBusinessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { openModal } = useModalContext();
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 745 : false,
  );

  useEffect(() => {
    console.log('=== BusinessNumberModal 열림 ===');
    console.log('사업자 등록번호:', businessCode);
    
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 745);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [businessCode]);

  const handleBusinessCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessCode(event.target.value);
  };

  const handleOpenNextModal = async () => {
    // 이미 로딩 중이면 중복 실행 방지
    if (isLoading) {
      return;
    }

    console.log('BusinessNumberModal - 계속하기 버튼 클릭');
    console.log('사업자 등록번호:', businessCode);
    
    if (!businessCode.trim()) {
      console.log('사업자 등록번호가 입력되지 않음');
      return;
    }

    // 로딩 상태 시작
    setIsLoading(true);

    try {
      // 사업자등록번호 검증 API 호출 (isBusiness: true와 함께)
      const response = await axiosInstance.post('/api/permit/business', {
        businessCode,
        isBusiness: true,
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (response.data.isSuccess) {
        console.log('사업자등록번호 검증 성공 - BusinessSignupModal 열기');
        onClose(); // 현재 모달 닫기
        openModal(({ onClose }) => <BusinessSignupModal onClose={onClose} />);
      } else {
        console.log('사업자등록번호 검증 실패:', response.data.message);
        // 에러 처리 로직 추가 가능
      }
    } catch (error) {
      console.error('사업자등록번호 검증 요청 실패:', error);
      // 에러 처리 로직 추가 가능
      return;
    } finally {
      // 로딩 상태 종료
      setIsLoading(false);
    }
  };

  const Content = (
    <Contents>
      {!isLargeScreen && (
        <>
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
          <Flex>
            <Img src={logo} />
          </Flex>
        </>
      )}
      <Container>
        <NewOption>
          <Circle />
          <Title>사업자 확인</Title>
        </NewOption>
        <Line />
        <Short style={{ marginBottom: '26px' }}>사업자 등록번호를 입력해주세요.</Short>
        <InputContainer>
          <Input
            type="text"
            placeholder="사업자 등록번호를 입력해주세요. (-미포함)"
            value={businessCode}
            onChange={handleBusinessCodeChange}
          />
        </InputContainer>
        <Button 
          onClick={handleOpenNextModal} 
          disabled={isLoading || !businessCode.trim()}
        >
          {isLoading ? '검증 중...' : '계속하기'}
        </Button>
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

const Img = styled.img`
  width: 172px;
  height: 80px;
  ${media.medium`
    margin-bottom:301px;
    margin-top: 231px;
  `}
  ${media.small`
    margin-bottom:220px;
    margin-top: 178px;
  `}
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
  padding-left: 61px;
  ${media.notLarge`
    padding-left: 0px;
    padding-top: 0px;
  `}
`;

const Circle = styled.div`
  width: 17px;
  height: 17px;
  background-color: #c908ff;
  border: 0;
  border-radius: 100%;
`;

const InputContainer = styled.div`
  margin-bottom: 26px;
`;

const Input = styled.input`
  width: 302px;
  height: 45px;
  border: 1px solid #8f8e94;
  border-radius: 7px;
  padding: 0 15px;
  font-size: 14px;
  font-family: Pretendard;
  
  &::placeholder {
    color: #8f8e94;
  }
  
  &:focus {
    outline: none;
    border-color: #c908ff;
  }
  
  ${media.medium`
    width: 344px;
  `}
  ${media.small`
    width: 325px;
  `}
`;

const Button = styled.button`
  margin-top: 77px;
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
    margin-top: 86px;
    width: 344px;
    height: 45px;
    margin-bottom: 181px;
    `}
  ${media.small`
     margin-top: 49px;
     width: 325px;
     height: 45px;
     margin-bottom: 47px;
    `}
`;

const Line = styled.div`
  width: 302px;
  height: 1px;
  background: #8f8e94;
  margin-top: 35px;
  margin-bottom: 34px;
  ${media.medium`
    width: 344px;
    margin-bottom: 24px;
    `}
  ${media.small`
    width: 302px;
    margin-bottom: 24px;
    `}
`;

const Short = styled.div`
  color: #000000;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
`;

const NewOption = styled.div`
  display: flex;
  column-gap: 39px;
  align-items: center;
  margin-top: 127px;
  transform: translateX(8px);
  ${media.notLarge`
    margin-top: 0px;
  `}
`;



const Title = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  ${media.medium`
    font-size: 18px;
    `}
`;

export default BusinessNumberModal; 