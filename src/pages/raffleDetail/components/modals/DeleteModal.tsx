import React from 'react';
import Modal from '../../../../components/Modal/Modal';
import styled from 'styled-components';
import questionVector from '../../../../assets/questionVector.png';
import axiosInstance from '../../../../apis/axiosInstance';
import useDeliveryStore from '../../../../store/deliveryStore';
import { useModalContext } from '../../../../components/Modal/context/ModalContext';
import DeleteOkModal from './DeleteOkModal';

interface ModalProps {
  onClose: () => void;
  raffleId: number;
}

const DeleteModal: React.FC<ModalProps> = ({ onClose, raffleId: raffleId }) => {
  const { setDeliveryStatus } = useDeliveryStore();
  const { openModal } = useModalContext();
  const handleClick = async () => {
    try {
      await axiosInstance.patch(`/api/member/raffles/${raffleId}`);
      openModal(({ onClose }) => <DeleteOkModal onClose={onClose} />);
    } catch (error) {
      console.error(error);
    } finally {
      onClose();
    }
  };

  return (
    <Modal onClose={onClose}>
      <Container>
        <Img src={questionVector} />
        <Title>래플을 삭제하시겠습니까?</Title>
        <Short>해당 결정은 번복할 수 없습니다.</Short>
        <Button onClick={handleClick}>래플 삭제하기</Button>
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

export default DeleteModal;
