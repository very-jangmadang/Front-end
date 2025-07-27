import React from 'react';
import Modal from '../../../components/Modal/Modal';
import styled from 'styled-components';
import questionVector from '../../../assets/questionVector.png';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../apis/axiosInstance';
import useDeliveryStore from '../../../store/deliveryStore';

interface ModalProps {
  onClose: () => void;
  deliveryId: number;
}

const WaitShippingModal: React.FC<ModalProps> = ({ onClose, deliveryId }) => {
  const navigate = useNavigate();
  const { setDeliveryStatus } = useDeliveryStore();

  const handleClick = async () => {
    try {
      await axiosInstance.post(
        `/api/member/delivery/${deliveryId}/winner/wait`,
        {},
      );
      setDeliveryStatus('READY');
    } catch (error) {
      console.error(error);
    }
    onClose();
    navigate(`/`);
  };

  return (
    <Modal onClose={onClose}>
      <Container>
        <Img src={questionVector} />
        <Title>운송장을 기다리시겠습니까?</Title>
        <Short>운송장 입력 시간을 최대 24시간 연장합니다.</Short>
        <Button onClick={handleClick}>기다리기</Button>
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

export default WaitShippingModal;
