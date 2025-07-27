import React from 'react';
import styled from 'styled-components';
import Modal from '../../../components/Modal/Modal';
import questionVector from '../../../assets/questionVector.png';
import axiosInstance from '../../../apis/axiosInstance';
import useDeliveryStore from '../../../store/deliveryStore';
import { useModalContext } from '../../../components/Modal/context/ModalContext';
import NewDrawerOkModal from './NewDrawerOkModal copy';

interface ModalProps {
  onClose: () => void;
  raffleId: number;
}

const NewDrawerModal: React.FC<ModalProps> = ({ onClose, raffleId }) => {
  // const { deliveryId, setDeliveryId } = useDeliveryStore();
  const { openModal } = useModalContext();

  const handleClick = async () => {
    try {
      const { data } = await axiosInstance.post(
        `/api/member/raffles/${raffleId}/redraw`,
      );
      openModal(({ onClose }) => (
        <NewDrawerOkModal onClose={onClose} raffleId={raffleId} />
      ));
    } catch (error) {
      console.error('POST 요청 실패', error);
    } finally {
      onClose();
    }
  };
  return (
    <Modal onClose={onClose}>
      <Container>
        <Img src={questionVector} />
        <Title>새로운 당첨자를 뽑으시겠습니까?</Title>
        <Short>해당 결정은 번복할 수 없습니다. </Short>
        <Button onClick={handleClick}>새로운 당첨자 뽑기</Button>
      </Container>
    </Modal>
  );
};

const Short = styled.div`
  margin-bottom: 127px;
  color: #c908ff;
  text-align: center;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
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
`;

const Title = styled.div`
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  margin-bottom: 12px;
`;

const Img = styled.img`
  width: 67px;
  height: 65px;
  margin-top: 75px;
  margin-bottom: 41px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default NewDrawerModal;
