import React, { PropsWithChildren, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import { useModalContext } from '../../../../components/Modal/context/ModalContext';
import yellow from '../../../../assets/yellowVector.svg';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../../apis/axiosInstance';
import { useParams, useLocation } from 'react-router-dom';
import useRaffleStore from '../../../../store/raffleStore';

interface RandomOkModalProps {
  onClose: () => void;
  winnerNickname: string;
  deliveryId: number;
  image: string;
  win: boolean;
  raffleId: number;
}

export default function RandomOkModal({
  onClose,
  winnerNickname,
  deliveryId,
  image,
  win,
  raffleId,
}: PropsWithChildren<RandomOkModalProps>) {
  const { clearModals } = useModalContext();
  const navigate = useNavigate();
  const { type } = useParams<{ type?: string }>();
  const typeNumber = type ? Number(type) : undefined;
  const { isChecked, setIsChecked } = useRaffleStore();

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleClick = () => {
    try {
      const postCheck = async () => {
        const { data } = await axiosInstance.post(
          `/api/member/raffles/${typeNumber}/check`,
        );
      };
      postCheck();
      setIsChecked(!isChecked);

      if (win) {
        navigate(`/winner-page`, {
          state: { deliveryId: deliveryId, image: image },
        }); //state로 devliery_id 전달
      } else {
        console.log('win? : ', win);
     
        console.log('래플 결과 확인 완료');
        navigate(`/raffles/${raffleId}`);
      }
    } catch (error) {
      console.log('에러 : ', error);
    } finally {
      onClose(); // 모달 닫기
    }
  };

  return ReactDOM.createPortal(
    <ModalOverlay onClick={clearModals}>
      <ModalContent
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Icon
            icon={'ei:close-o'}
            style={{
              width: '30px',
              height: '30px',
              color: '#FFFFFF',
              transform: 'translateX(-14px)',
            }}
            onClick={onClose}
          />
        </div>
        <ContainerBox onClick={(e) => e.stopPropagation()}>
          <Container>
            <Name>당첨자는</Name>
            <Final>
              <img src={yellow} />
              <FinalName>{winnerNickname}</FinalName>
              <img src={yellow} />
            </Final>
            <Name>축하합니다!</Name>
          </Container>
          <Button onClick={handleClick}>다음으로</Button>
        </ContainerBox>
      </ModalContent>
    </ModalOverlay>,
    document.getElementById('modal-root') as HTMLElement,
  );
}

const FinalName = styled.div`
  color: #faff00;
  text-align: center;
  font-family: Pretendard;
  font-size: 26px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%;
`;

const Final = styled.div`
  display: flex;
  column-gap: 34px;
`;

const Name = styled.div`
  color: #fff;
  text-align: center;
  font-family: Pretendard;
  font-size: 25px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%;
`;

const Button = styled.button`
  width: 302px;
  height: 39px;
  border-radius: 7px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #c908ff;
  border: none;

  font-family: Pretendard;
  font-size: 14px;
  font-weight: 700;
  line-height: 18px;
`;

const ContainerBox = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Container = styled.div`
  margin-top: 63px;
  /* height: 200px;
  width: 229px; */
  margin-bottom: 119px;
  display: flex;
  flex-direction: column;
  row-gap: 45px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ModalContent = styled.div`
  display: flex;
  position: relative;
  width: 425px;
  height: auto;
  flex-direction: column;
  background-color: #c908ff;
  border-radius: 6px;
  padding-top: 14px;
  padding-bottom: 58px;
`;
