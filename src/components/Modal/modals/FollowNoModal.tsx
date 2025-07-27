import React from 'react';
import Modal from '../Modal';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // ✅ useNavigate import
import sadVector from '../../../assets/sadVector.png';

interface ModalProps {
  onClose: () => void;
  message: string;
}

const FollowNoModal: React.FC<ModalProps> = ({ onClose, message }) => {
  const navigate = useNavigate(); // ✅ useNavigate 사용

  const handleNavigateToProfile = () => {
    onClose(); // ✅ 모달 종료
    navigate('/mypage'); // ✅ /mypage로 이동
  };

  return (
    <Modal onClose={onClose}>
      <Container>
        <Img src={sadVector} />
        <Title>{message}</Title>
        <Button onClick={handleNavigateToProfile}>내 프로필로 이동하기</Button>
      </Container>
    </Modal>
  );
};

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
  cursor: pointer;
`;

const Title = styled.div`
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  margin-bottom: 158px;
  text-align: center;
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

export default FollowNoModal;
