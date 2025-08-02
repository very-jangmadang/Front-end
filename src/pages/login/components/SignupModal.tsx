import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import logo from '../../../assets/logo.png';
import EnterModal from './EnterModal';
import Modal from '../../../components/Modal/Modal';
import media from '../../../styles/media';
import { useModalContext } from '../../../components/Modal/context/ModalContext';
import { Icon } from '@iconify/react';
import axiosInstance from '../../../apis/axiosInstance';
import { AxiosError } from 'axios';

interface ModalProps {
  onClose: () => void;
  email?: string | null;
}

const RequestSignUp = async (nickname: string, email: string | null) => {
  const requestBody: any = { nickname };
  
  // 이메일이 있으면 request body에 추가
  if (email) {
    requestBody.email = email;
  }
  
  const response = await axiosInstance.post('/api/permit/nickname', requestBody, {
    withCredentials: true
  });
  return response.data;
};

const SignupModal: React.FC<ModalProps> = ({ onClose, email }) => {
  const { openModal } = useModalContext();
  const [isError, setIsError] = useState('');
  const [name, setName] = useState('');

  const regex = /^[가-힣a-zA-Z0-9]{2,10}$/;

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  useEffect(() => {
    console.log(name);
  }, [name]);

  const handleOpenNextModal = async () => {
    if (!regex.test(name)) {
      setIsError('닉네임은 2~10자의 한글 또는 영어만 사용 가능합니다.');
      return;
    }

    console.log('🔍 회원가입 시도:', { nickname: name, email });

    try {
      const response = await RequestSignUp(name, email || null);
      console.log('✅ 회원가입 성공:', response);

      if (response.code === 'COMMON_200') {
        setIsError('');
        openModal(({ onClose }) => <EnterModal onClose={onClose} />);
      } else if (response.code === 'USER_4008') {
        console.log('닉네임 중복');
        setIsError('중복된 닉네임입니다');
      } else {
        console.log('⚠️ 예상치 못한 응답 코드:', response.code);
        setIsError('');
      }
    } catch (err) {
      console.error('❌ 회원가입 에러:', err);
      
      const error = err as AxiosError<{
        isSuccess: boolean;
        code: string;
        message: string;
      }>;

      if (error.response) {
        console.error('📡 서버 응답 에러:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers
        });
        
        if (error.response.status === 400) {
          const errorCode = error.response.data?.code;

          if (errorCode === 'USER_4008') {
            console.log('닉네임 중복');
            setIsError('중복된 닉네임입니다');
          } else {
            console.log('⚠️ 400 에러 - 알 수 없는 코드:', errorCode);
            setIsError(`회원가입 실패: ${error.response.data?.message || '알 수 없는 오류'}`);
          }
        } else if (error.response.status === 401) {
          console.log('🔐 인증 실패 - 로그인이 필요합니다');
          setIsError('로그인이 필요합니다. 다시 로그인해주세요.');
        } else if (error.response.status === 403) {
          console.log('🚫 권한 없음');
          setIsError('권한이 없습니다.');
        } else if (error.response.status === 500) {
          console.log('💥 서버 내부 오류');
          setIsError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } else {
          console.log('⚠️ 기타 HTTP 에러:', error.response.status);
          setIsError(`서버 오류 (${error.response.status}): ${error.response.data?.message || '알 수 없는 오류'}`);
        }
      } else if (error.request) {
        console.error('🌐 네트워크 에러:', {
          request: error.request,
          message: error.message
        });
        setIsError('네트워크 연결을 확인해주세요.');
      } else {
        console.error('❓ 기타 에러:', {
          message: error.message,
          stack: error.stack
        });
        setIsError('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  useEffect(() => {
    console.log('현재 isError 상태:', isError);
  }, [isError]);

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
        </>
      )}
      <Logo>
        <Img src={logo} />
      </Logo>
      <Container>
        {isLargeScreen ? (
          <>
            <Line />
            <Info>회원 정보</Info>
          </>
        ) : (
          <Border>
            <ShortLine />
            <And>회원가입</And>
            <ShortLine />
          </Border>
        )}

        <Box>
          <Name>닉네임</Name>
          <Error>{isError}</Error>
        </Box>
        <Input
          isError={!!isError}
          value={name}
          onChange={handleChangeName}
          placeholder="닉네임을 입력하세요. (한글 및 영어 2~5자)"
        />
        <Button disabled={!name} onClick={handleOpenNextModal}>
          회원가입
        </Button>
      </Container>
    </Contents>
  );

  return isLargeScreen ? <Modal onClose={onClose}>{Content}</Modal> : Content;
};

const Border = styled.div`
  display: flex;
  column-gap: 10.7px;
  align-items: center;
  ${media.medium`
    margin-bottom: 67px;
    `}
  ${media.small`
    margin-bottom: 48px;
    `}
`;

const And = styled.div`
  color: #c1c1c1;
  text-align: center;
  font-size: 17px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  ${media.small`
    font-size: 12px;
    font-weight: 600;  
   `}
`;

const ShortLine = styled.div`
  width: 177px;
  height: 1px;
  background-color: #c1c1c1;
  ${media.small`
    width: 119px;   
  `}
`;

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

const Box = styled.div`
  display: flex;
  column-gap: 28px;
  margin-bottom: 7px;
  ${media.medium`
    column-gap: 40px;
    `}
  ${media.small`
    column-gap: 28px;
    transform: translateX(40px);
    `}
`;

const Error = styled.div`
  width: 234px;
  height: 17px;
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  color: #c908ff;
  font-family: 'Noto Sans KR';
  transform: translateX(-20px);
  ${media.medium`
    font-size: 15px;
    width: 320.583px;
    height: 20.197px;
    `}
  ${media.small`
      font-size: 11px;
      `}
`;

const Container = styled.div`
  padding-left: 61px;
  ${media.notLarge`
    padding-left: 0px;
    padding-top: 0px;
    display: flex;
    flex-direction: column;
    align-items: center
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

const Img = styled.img`
  width: 134px;
  height: 63px;
  ${media.notLarge`
    width: 172px;
    height: 80px;
  `}
`;

const Button = styled.button`
  margin-top: 145px;
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
     margin-top: 330px;
     width: 325px;
     height: 45px;
     margin-bottom: 47px;
    `}
`;

const Input = styled.input<{ isError: boolean }>`
  padding-left: 14px;
  width: 273px;
  height: 30px;
  border-radius: 7px;
  border: ${({ isError }) => (isError ? '1px solid #C908FF' : 'none')};
  background-color: #f7f7f7;
  font-size: 11px;
  outline: none;
  &::placeholder {
    font-size: 11px;
    font-style: normal;
    font-weight: 300;
    color: #7d7d7d;
    font-family: Pretendard;
    transform: translateY(1px);
  }
  ${media.medium`
    width: 420px;
    height: 44px;
    font-size: 16px;
    &::placeholder {
    font-size: 16px;
    transform: translateY(2px);
  }
  `}
  ${media.small`
    width: 302px;
    height: 36px;
    font-size: 13px;
    &::placeholder {
    font-size: 13px;
    transform: translateY(2px);
  }
      `}
`;

const Name = styled.div`
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  ${media.medium`
    font-size: 18px;
    font-weight: 500;
  `}
  ${media.small`
    font-size: 15px;
    font-weight: 500;
    width: 50px;
  `}
`;

const Info = styled.div`
  color: #c908ff;
  font-family: Pretendard;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  margin-bottom: 42px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  ${media.medium`
    margin-top: 175px;
    margin-bottom: 64px;
  `}
  ${media.small`
    margin-top: 167px;
    margin-bottom: 34px;
  `}
`;

const Line = styled.div`
  width: 302px;
  height: 1px;
  background-color: #8f8e94;
  margin-top: 23px;
  margin-bottom: 11px;
`;

export default SignupModal;

