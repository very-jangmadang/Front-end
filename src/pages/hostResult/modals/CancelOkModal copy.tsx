import React from 'react';
import styled from 'styled-components';
import Modal from '../../../components/Modal/Modal';
import smileVector from '../../../assets/SmileVector.png';
import { Navigate, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../apis/axiosInstance';
import { useEffect, useState } from 'react';

interface ModalProps {
  onClose: () => void;
  raffleId: number;
}

const CancelOkModal: React.FC<ModalProps> = ({ onClose, raffleId }) => {
  const navigate = useNavigate();

  return (
    <Modal onClose={() => navigate(`/mypage`)}>
      <Container>
        <Img src={smileVector} />
        <Title>해당 래플은 강제종료 되었습니다.</Title>
        <Button onClick={() => navigate(`mypage`)}>프로필로 이동하기</Button>
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

export default CancelOkModal;
