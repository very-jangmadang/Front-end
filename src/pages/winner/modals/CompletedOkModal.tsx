import React from 'react';
import styled from 'styled-components';
import Modal from '../../../components/Modal/Modal';
import smileVector from '../../../assets/SmileVector.png';
import { useNavigate, useLocation } from 'react-router-dom';

interface ModalProps {
  onClose: () => void;
  deliveryId: number;
}

const CompletedOkModal: React.FC<ModalProps> = ({ onClose, deliveryId }) => {
  const navigate = useNavigate();
  return (
    <Modal onClose={() => navigate('/')}>
      <Container>
        <Img src={smileVector} />
        <Title>거래가 완료되었습니다.</Title>
        <ButtonLayout>
          <Button
            onClick={() =>
              navigate('/review', {
                state: { deliveryId: { deliveryId } },
              })
            }
          >
            후기 작성하기
          </Button>
          <Button onClick={() => navigate('/')}>홈화면으로 돌아가기</Button>
        </ButtonLayout>
      </Container>
    </Modal>
  );
};

const ButtonLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  margin-bottom: 103px;
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

export default CompletedOkModal;
