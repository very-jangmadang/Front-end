import React, { useContext, useState } from 'react';
import Modal from '../Modal';
import styled from 'styled-components';
import vector from '../../../assets/Vector.png';
import { useModalContext } from '../context/ModalContext';
import AccountOkModal from './AccountOkModal';

interface ModalProps {
  onClose: () => void;
}

const AccountEditModal: React.FC<ModalProps> = ({ onClose }) => {
  const [account, setAccount] = useState('');
  const { openModal } = useModalContext();

  const handleSubmit = () => {
    openModal(({ onClose }) => <AccountOkModal onClose={onClose} />);
  };

  return (
    <Modal onClose={onClose}>
      <Container>
        <Img src={vector} />
        <Title>계좌번호 변경하기</Title>
        {/* <Error>{isError}</Error> */}
        <Input
          value={account}
          onChange={(event) => setAccount(event.target.value)}
          placeholder="변경할 계좌번호를 입력하세요."
          //   isError={!!isError}
        />
        <Button onClick={handleSubmit}>변경하기</Button>
      </Container>
    </Modal>
  );
};

const Error = styled.div`
  margin-top: 28px;
  width: 234px;
  height: 17px;
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  color: #c908ff;
  font-family: 'Noto Sans KR';
  transform: translateX(-18px);
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

const Input = styled.input`
  margin-top: 46px;
  margin-bottom: 151px;
  border-radius: 5px;
  border: none;
  background: #f7f7f7;
  width: 272px;
  height: 31px;
  display: inline-flex;
  padding: 3.2px 14px;
  justify-content: center;
  align-items: center;
  outline: none;
  &::placeholder {
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 300;
  }
`;

const Title = styled.div`
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  font-family: Pretendard;
`;

const Img = styled.img`
  margin-top: 64px;
  width: 31px;
  height: 30px;
  margin-bottom: 20px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default AccountEditModal;
