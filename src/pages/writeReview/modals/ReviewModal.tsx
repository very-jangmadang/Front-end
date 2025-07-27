import React from 'react';
import Modal from '../../../components/Modal/Modal';
import styled from 'styled-components';
import questionVector from '../../../assets/questionVector.png';
import axiosInstance from '../../../apis/axiosInstance';
import { useModalContext } from '../../../components/Modal/context/ModalContext';
import ReviewOkModal from './ReviewOkModal';
import ReviewFailModal from './ReviewFailModal';

interface ModalProps {
  onClose: () => void;
  raffleId: number;
  score: number;
  text: string;
  images: File[];
}

const ReviewModal: React.FC<ModalProps> = ({
  onClose,
  raffleId,
  score,
  text,
  images,
}) => {
  const { openModal } = useModalContext();
  const handleClick = async () => {
    const formData = new FormData();
    formData.append('raffleId', raffleId.toString());
    formData.append('score', score.toString());
    formData.append('text', text);
    images.forEach((image) => {
      formData.append('image', image);
    });

    try {
      await axiosInstance.post('/api/member/review', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      openModal(({ onClose }) => <ReviewOkModal onClose={onClose} />);
    } catch (error) {
      openModal(({ onClose }) => <ReviewFailModal onClose={onClose} />);
    } finally {
      onClose();
    }
  };

  return (
    <Modal onClose={onClose}>
      <Container>
        <Img src={questionVector} />
        <Title>후기를 작성하시겠습니까?</Title>
        <Button onClick={handleClick}>후기 남기기</Button>
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

export default ReviewModal;
