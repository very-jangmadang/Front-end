import React from 'react';
import Modal from '../../../../components/Modal/Modal';
import styled from 'styled-components';
import vector from '../../../../assets/Vector.png';
import { useModalContext } from '../../../../components/Modal/context/ModalContext';
import { useQuery } from '@tanstack/react-query';
import { GetExchangeHistory } from '../../apis/chargeAPI';
import { THistory } from '../../apis/chargeType';
import ticket from '../../../../assets/ticket.svg';
import { useNavigate, useLocation } from 'react-router-dom';

interface ModalProps {
  onClose: () => void;
  txId: string;
}

const ChangeOkModal: React.FC<ModalProps> = ({ onClose, txId }) => {
  const { clearModals } = useModalContext();
  const navigate = useNavigate();

  const {
    data: history = { result: [] },
    isPending,
    isError,
  } = useQuery({
    queryFn: () => GetExchangeHistory('recent'),
    queryKey: ['history'],
  });

  if (isPending) {
    return <p>로딩중...</p>;
  }
  if (isError) {
    return <p>에러</p>;
  }

  const chargeData: THistory = history?.result?.[0] || {
    amount: 0,
    user_ticket: 0,
    confirmedAt: '',
  };

  return (
    <Modal onClose={onClose}>
      <Container>
        <Img src={vector} />
        <Title>티켓 환전 완료!</Title>
        <TicketBox>
          <img src={ticket} style={{ width: '21px', height: '12px' }} />
          <Ticket>{chargeData?.amount}개</Ticket>
        </TicketBox>
        <Option>
          <Name>Tx ID</Name>
          <Name
            as="a"
            href={`https://www.veryscan.io/tx/${txId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {txId.slice(0, 15) + '...' + txId.slice(-4)}
          </Name>
        </Option>
        <Line />

        <Option>
          <Sname>환전한 티켓</Sname>
          <Sname>{chargeData?.amount}개</Sname>
        </Option>
        <Option>
          <Name>입금 받은 금액</Name>
          <Price>{Number(chargeData?.amount)}VERY</Price>
        </Option>
        <Option>
          <div></div>
          <Sname style={{ color: '#C908FF' }}>
            잔여 티켓: {chargeData.user_ticket}개
          </Sname>
        </Option>
        <Button onClick={() => navigate('/mypage/payment')}>
          충전/환전 내역 조회하기
        </Button>
      </Container>
    </Modal>
  );
};

const Ticket = styled.div`
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  transform: translateY(2px);
`;

const TicketBox = styled.div`
  display: flex;
  column-gap: 16px;
  margin-bottom: 34px;
  align-items: center;
`;

const Button = styled.button`
  margin-top: 65px;
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

const Price = styled.div`
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
`;

const Sname = styled.div`
  color: #8f8e94;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
`;

const Line = styled.div`
  width: 275px;
  height: 1px;
  margin-bottom: 9px;
  background: #000;
`;

const Name = styled.div`
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;

  &[href] {
    color: #c908ff;
    text-decoration: none;
  }
`;

const Option = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 9px;
  width: 265px;
`;

const Title = styled.div`
  font-family: Pretendard;
  font-size: 22px;
  font-style: normal;
  font-weight: 600;
  margin-bottom: 50px;
`;

const Img = styled.img`
  margin-top: 29px;
  width: 33px;
  height: 33px;
  margin-bottom: 25px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default ChangeOkModal;
