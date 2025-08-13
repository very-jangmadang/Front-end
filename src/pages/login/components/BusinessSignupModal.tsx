import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Modal from '../../../components/Modal/Modal';
import { useModalContext } from '../../../components/Modal/context/ModalContext';
import EnterModal from './EnterModal';
import axiosInstance from '../../../apis/axiosInstance';
import { AxiosError } from 'axios';
import media from '../../../styles/media';
import logo from '../../../assets/logo.png';
import { Icon } from '@iconify/react';

interface ModalProps {
  onClose: () => void;
  businessNumber: string;
}

const RequestBusinessSignUp = async (businessName: string, businessNumber: string) => {
  console.log('사업자 회원가입 요청 시작:', { businessName, businessNumber, baseURL: axiosInstance.defaults.baseURL });
  
  try {
    const response = await axiosInstance.post('/api/permit/business-signup', {
      businessName,
      businessNumber,
      isBusiness: true,
    }, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
    console.log('사업자 회원가입 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('사업자 회원가입 요청 실패:', error);
    throw error;
  }
};

const BusinessSignupModal: React.FC<ModalProps> = ({ onClose, businessNumber }) => {
  const { openModal } = useModalContext();
  const [isError, setIsError] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 745 : false,
  );

  const regex = /^[가-힣a-zA-Z0-9]{2,10}$/;

  const handleChangeBusinessName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessName(event.target.value);
  };

  useEffect(() => {
    console.log('사업자명:', businessName);
    
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 745);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [businessName]);

  const handleOpenNextModal = async () => {
    console.log('=== 사업자 회원가입 프로세스 시작 ===');
    console.log('입력된 사업자명:', businessName);
    console.log('사업자 번호:', businessNumber);
    console.log('정규식 테스트 결과:', regex.test(businessName));
    console.log('현재 axiosInstance baseURL:', axiosInstance.defaults.baseURL);
    console.log('현재 쿠키:', document.cookie);
    
    if (!regex.test(businessName)) {
      setIsError('사업자명은 2~10자의 한글 또는 영어만 사용 가능합니다.');
      return;
    }

    console.log('사업자 회원가입 프로세스 시작:', { businessName, businessNumber, baseURL: axiosInstance.defaults.baseURL });

    try {
      const response = await RequestBusinessSignUp(businessName, businessNumber);
      console.log('사업자 회원가입 성공 응답:', response);

      if (response.code === 'COMMON_200') {
        setIsError('');
        console.log('사업자 회원가입 성공 - EnterModal 열기');
        openModal(({ onClose }) => <EnterModal onClose={onClose} />);
      } else if (response.code === 'BUSINESS_4008') {
        console.log('사업자명 중복');
        setIsError('중복된 사업자명입니다');
      } else {
        console.log('알 수 없는 응답 코드:', response.code);
        setIsError('회원가입 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error('사업자 회원가입 처리 중 에러:', err);
      const error = err as AxiosError<{
        isSuccess: boolean;
        code: string;
        message: string;
      }>;

      if (error.response) {
        console.error('에러 응답:', error.response.data);
        if (error.response.data?.code === 'BUSINESS_4008') {
          setIsError('중복된 사업자명입니다');
        } else {
          setIsError('회원가입 중 오류가 발생했습니다.');
        }
      } else {
        setIsError('네트워크 오류가 발생했습니다.');
      }
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
        <Title>회원 정보</Title>
        <Line />
        <InputContainer>
          <Label>사업자명</Label>
          <Input
            type="text"
            placeholder="사업자명을 입력하세요. (한글, 숫자, 영어 2~10자)"
            value={businessName}
            onChange={handleChangeBusinessName}
            style={{ borderColor: isError ? '#c908ff' : '#8f8e94' }}
          />
          {isError && <ErrorText>{isError}</ErrorText>}
        </InputContainer>
        <Button onClick={handleOpenNextModal}>회원가입</Button>
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

const Title = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  margin-top: 127px;
  margin-bottom: 25px;
  ${media.notLarge`
    margin-top: 0px;
  `}
`;

const Line = styled.div`
  width: 302px;
  height: 1px;
  background: #8f8e94;
  margin-bottom: 32px;
  ${media.medium`
    width: 344px;
  `}
  ${media.small`
    width: 302px;
  `}
`;

const InputContainer = styled.div`
  margin-bottom: 32px;
`;

const Label = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #000000;
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

const ErrorText = styled.div`
  color: #ff0000;
  font-size: 12px;
  margin-top: 8px;
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
    width: 344px;
    height: 45px;
    `}
  ${media.small`
     width: 325px;
     height: 45px;
     `}
`;

export default BusinessSignupModal; 