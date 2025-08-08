import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from '../../../../components/Modal/Modal';
import { useWepin } from '../../../../context/WepinContext';

interface ModalProps {
  onClose: () => void;
  amount: number;
}

const ChargeModal: React.FC<ModalProps> = ({ onClose, amount }) => {
  const [checked, setChecked] = useState(false);
  const { wepin } = useWepin(); // Wepin Context에서 wepin 객체 가져오기

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleNextModal = async () => {
    if (!checked) {
      alert('[필수] 전체동의에 체크해주세요.');
      return;
    }

    // Wepin 지갑이 연결되었는지 확인
    if (!wepin) {
      alert('Wepin 지갑이 초기화되지 않았습니다. 먼저 로그인해주세요.');
      return;
    }

    // ChargeButton의 로직을 여기에 적용합니다.
    // 실제 서비스에서는 Wepin SDK의 결제/송금 함수를 호출해야 합니다.
    // 아래는 getAccounts()를 사용한 연결 확인 예시입니다.
    try {
      console.log('Wepin 지갑 정보를 조회합니다.');
      const accounts = await wepin.getAccounts();
      console.log('Wepin 계정 정보:', accounts);
      alert(`Wepin 지갑 연결 확인!\n${JSON.stringify(accounts, null, 2)}`);

      // Wepin 지갑 확인 후, 실제 충전 로직(예: Wepin 결제 위젯 호출)을 여기에 추가합니다.
      // 예: wepin.wallet.sendTransaction(...) 또는 wepin.openWidget(...)
    } catch (error) {
      console.error('Wepin 계정 정보 조회에 실패했습니다:', error);
      alert('계정 정보 조회 중 오류가 발생했습니다.');
    }
  };

  return (
    <Modal onClose={onClose}>
      <Container>
        <Button onClick={handleNextModal}>충전하기</Button>
      </Container>
    </Modal>
  );
};

const Consent = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  transform: translateY(1px);
`;

const CheckBox = styled.div`
  display: flex;
  margin-bottom: 48px;
  column-gap: 30px;
  align-items: center;
  transform: translateX(35px);
`;

const Short = styled.div`
  color: #8f8e94;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
`;

const Box = styled.div`
  width: 290px;
  height: 43px;
  border: 1px solid #c1c1c1;
  margin-top: 228px;
  margin-bottom: 15px;
  display: flex;
  column-gap: 15px;
  align-items: center;
  padding-left: 10px;
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default ChargeModal;
