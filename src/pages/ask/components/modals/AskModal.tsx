import React, { useState } from 'react';
import Modal from '../../../../components/Modal/Modal';
import styled from 'styled-components';
import questionVector from '../../../../assets/questionVector.png';
import axiosInstance from '../../../../apis/axiosInstance';
import { useModalContext } from '../../../../components/Modal/context/ModalContext';
import AskOkModal from './AskOkModal';

interface ModalProps {
  onClose: () => void;
  type: string | undefined;
  title: string;
  content: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  setIsReload: React.Dispatch<React.SetStateAction<boolean>>;
}

const AskModal: React.FC<ModalProps> = ({
  onClose,
  type,
  title,
  content,
  setTitle,
  setContent,
  setIsReload,
}) => {
  const { openModal } = useModalContext();
  const [clicked, setClicked] = useState<boolean>(false);

  const onAskOk = () => {
    if (clicked) return; // 더블클릭 방지
    const postAsk = async () => {
      await axiosInstance
        .post('/api/member/inquiry', {
          raffleId: Number(type),
          title,
          content,
        })
        .then((_) => {
          setTitle('');
          setContent('');
          setClicked(false);
          console.log('postAsk OK');
        })
        .then((_) => {
          openModal(({ onClose }) => (
            <AskOkModal
              onClose={onClose}
              type={type}
              setIsReload={setIsReload}
            />
          ));
          onClose();
        });
    };
    setClicked(true);
    postAsk();
  };
  return (
    <Modal onClose={onClose}>
      <Container>
        <Img src={questionVector} />
        <Title>문의를 작성하시겠습니까?</Title>
        <Short>해당 문의는 삭제할 수 없습니다.</Short>
        <Button onClick={onAskOk}>문의하기</Button>
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

export default AskModal;
