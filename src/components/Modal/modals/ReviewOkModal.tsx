import React from 'react';
import styled from 'styled-components';
import Modal from '../Modal';
import smileVector from '../../../assets/SmileVector.png';

interface ModalProps {
  onClose: () => void;
}

const ReviewOkModal: React.FC<ModalProps> = ({ onClose }) => {
  return (
    <Modal onClose={onClose}>
      <Container>
        <Img src={smileVector} />
        <Title>후기 작성이 완료되었습니다.</Title>
        <Button onClick={onClose}>프로필로 돌아가기</Button>
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
`;

const Title = styled.div`
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  margin-bottom: 158px;
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

export default ReviewOkModal;
