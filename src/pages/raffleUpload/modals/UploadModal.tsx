import React, { useState } from 'react';
import Modal from '../../../components/Modal/Modal';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../apis/axiosInstance';

interface ModalProps {
  onClose: () => void;
  images: File[];
  name: string;
  formData: FormData;
}

const UploadModal: React.FC<ModalProps> = ({
  onClose,
  images,
  name,
  formData,
}) => {
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleUpload = () => {
    if (isSubmit) return;
    setIsSubmit(true);
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    const postRaffle = async () => {
      await axiosInstance
        .post('/api/member/raffles', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((_) => console.log('업로드 완료'))
        .then((_) => navigate('/'))
        .catch((error) => console.error('Error:', error));
    };
    postRaffle();
  };

  const onCloseModal = () => {
    setIsSubmit(false);
    onClose();
  };

  return (
    <Modal onClose={onCloseModal}>
      <Container>
        <Img src={URL.createObjectURL(images[0])} />
        <Title>{name}</Title>
        <Short>해당 래플을 업로드하시겠습니까?</Short>
        <Button onClick={handleUpload}>업로드</Button>
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

const Short = styled.div`
  margin-top: 12px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  margin-bottom: 79px;
`;

const Title = styled.div`
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
`;

const Img = styled.img`
  width: 190px;
  height: 190px;
  flex-shrink: 0;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default UploadModal;
