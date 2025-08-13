import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Checkbox from '@mui/material/Checkbox';
import CircleChecked from '@mui/icons-material/CheckCircleOutline';
import CircleUnchecked from '@mui/icons-material/RadioButtonUnchecked';
import BusinessCheckModal from './BusinessCheckModal';
import Modal from '../../../components/Modal/Modal';
import { useModalContext } from '../../../components/Modal/context/ModalContext';
import media from '../../../styles/media';
import UnderAgeModal from './UnderAgeModal';
import logo from '../../../assets/logo.png';
import { Icon } from '@iconify/react';

interface ModalProps {
  onClose: () => void;
}

const AgeModal: React.FC<ModalProps> = ({ onClose }) => {
  const [checked, setChecked] = React.useState([false, false]);
  const { openModal } = useModalContext();
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 745 : false,
  );

  useEffect(() => {
    console.log('=== AgeModal 열림 ===');
    console.log('현재 체크 상태:', checked);
    
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 745);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [checked]);

  const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([event.target.checked, false]);
  };

  const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([false, event.target.checked]);
  };

  useEffect(() => {
    console.log('Checked State:', checked);
  }, [checked]);

  const handleOpenNextModal = () => {
    console.log('AgeModal - 계속하기 버튼 클릭');
    console.log('체크 상태:', checked);
    
    if (checked[0]) {
      console.log('만 14세 이상 선택 - BusinessCheckModal 열기');
      onClose(); // 현재 모달 닫기
      openModal(({ onClose }) => <BusinessCheckModal onClose={onClose} />);
    } else if (checked[1]) {
      console.log('만 14세 미만 선택 - UnderAgeModal 열기');
      onClose(); // 현재 모달 닫기
      openModal(({ onClose }) => <UnderAgeModal onClose={onClose} />);
    } else {
      console.log('나이 선택이 완료되지 않음');
      return;
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
          <Title>최소 연령 확인</Title>
        </NewOption>
        <Line />
        <Option style={{ marginBottom: '26px' }}>
          <Checkbox
            checked={checked[0]}
            onChange={handleChange1}
            icon={<CircleUnchecked />}
            checkedIcon={<CircleChecked />}
            sx={{
              '& .MuiSvgIcon-root': { fontSize: 17 },
              '&.Mui-checked': {
                color: '#C908FF',
              },
            }}
          />
          <Short>만 14세 이상입니다.</Short>
        </Option>
        <Option>
          <Checkbox
            checked={checked[1]}
            onChange={handleChange2}
            icon={<CircleUnchecked />}
            checkedIcon={<CircleChecked />}
            sx={{
              '& .MuiSvgIcon-root': {
                fontSize: 17,
              },
              '&.Mui-checked': {
                color: '#C908FF',
              },
            }}
          />
          <Short>만 14세 미만입니다.</Short>
        </Option>
        <Button onClick={handleOpenNextModal}>계속하기</Button>
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

const Option = styled.div`
  display: flex;
  column-gap: 35px;
  align-items: center;
`;

const Title = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  ${media.medium`
    font-size: 18px;
    `}
`;

export default AgeModal;
