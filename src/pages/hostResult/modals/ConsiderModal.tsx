import React from 'react';
import styled from 'styled-components';
import Modal from '../../../components/Modal/Modal';
import questionVector from '../../../assets/questionVector.png';
import { Navigate, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../apis/axiosInstance';

interface ModalProps {
  onClose: () => void;
  deliveryId: number;
}

const ConsiderModal: React.FC<ModalProps> = ({ onClose, deliveryId }) => {
  const navigate = useNavigate();
  const handleClick = async () => {
    try {
      const { data } = await axiosInstance.post(
        `/api/member/delivery/${deliveryId}/owner/wait`,
      );
      console.log(data);
      onClose();
      navigate(``);
    } catch (error) {
      console.error('POST 요청 실패', error);
    }
  };
  return (
    <Modal onClose={onClose}>
      <Container>
        <Img src={questionVector} />
        <Title>배송지 입력을 기다리시겠습니까?</Title>
        <Short>종료한 래플은 재개할 수 없습니다.</Short>
        <Button onClick={handleClick}>기다리기 (24시간)</Button>
      </Container>
    </Modal>
  );
};

export default ConsiderModal;

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
