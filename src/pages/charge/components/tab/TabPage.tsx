import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import ticketIcon from '../../../../assets/ticket.svg';
import { Icon } from '@iconify/react';
import { useModalContext } from '../../../../components/Modal/context/ModalContext';
import ChangeModal from '../modal/ChangeModal';
import useScreenSize from '../../../../styles/useScreenSize';
import media from '../../../../styles/media';
import CircleChecked from '@mui/icons-material/CheckCircleOutline';
import CircleUnchecked from '@mui/icons-material/RadioButtonUnchecked';
import Checkbox from '@mui/material/Checkbox';
import { useMutation, useQuery } from '@tanstack/react-query';
import { GetMyTicket, PostCharge, PostExchange } from '../../apis/chargeAPI';
import ChargeModal from '../modal/ChargeModal';
import ChargeOkModal from '../modal/ChargeOkModal';
import ChangeOkModal from '../modal/ChangeOkModal';
import { useNavigate } from 'react-router-dom';

interface TabTypeProps {
  type: number;
}

function TabPage({ type }: TabTypeProps) {
  const [ticket, setTicket] = useState<string>('');
  const [checked, setChecked] = useState(false);
  const { openModal } = useModalContext();
  const { isSmallScreen, isLargeScreen } = useScreenSize();
  const navigate = useNavigate();

  const {
    data: Tickets,
    isPending,
    isError,
  } = useQuery({
    queryFn: GetMyTicket,
    queryKey: ['Tickets'],
  });

  useEffect(() => {
    console.log(ticket);
  }, [ticket]);

  const { mutate: postMutation } = useMutation({
    mutationFn: PostCharge,
    onSuccess: () => {
      console.log('충전 요청 성공');
    },
    onError: (error) => {
      console.log('충전 요청 실패 : ', error);
    },
  });

  const handleOpenChangeOkModal = useCallback(() => {
    openModal(({ onClose }) => <ChangeOkModal onClose={onClose} />);
  }, [openModal]);

  const { mutate: postExchanging } = useMutation({
    mutationFn: PostExchange,
    onSuccess: () => {
      console.log('환전 요청 성공');
      handleOpenChangeOkModal();
    },
    onError: (error) => {
      console.log('환전 요청 실패 : ', error);
    },
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleNext = () => {
    if (isLargeScreen) {
      console.log('환전 모달 열기');
      openModal(({ onClose }) => (
        <ChangeModal ticket={Number(ticket)} onClose={onClose} />
      ));
    } else {
      if (checked === true) {
        postExchanging({
          quantity: 1,
          amount: Number(ticket),
        });
      }
      return;
    }
  };

  const handleCharge = () => {
    if (isLargeScreen) {
      console.log('충전 모달 열기');
      openModal(({ onClose }) => (
        <ChargeModal amount={Number(ticket) * 100} onClose={onClose} />
      ));
    } else {
      if (checked === true) {
        postMutation({
          itemId: '티켓',
          itemName: '테스트상품',
          totalAmount: Number(ticket) * 100,
        });
      }
      return;
    }
  };

  return (
    <Container>
      {!isLargeScreen && (
        <HistoryContaienr onClick={() => navigate('/mypage/payment')}>
          <History>충전/환전 내역 조회하기</History>
          <Arrow>&gt;</Arrow>
        </HistoryContaienr>
      )}

      <Short>{type === 0 ? '충전할 응모 티켓' : '환전할 응모 티켓'}</Short>
      <TicketContainer>
        <InputContainer>
          <Img src={ticketIcon} />
          <Input
            value={ticket ?? ''}
            onChange={(event) => setTicket(event.target.value)}
            type="number"
          />
          <Icon
            icon={'ei:close-o'}
            style={{
              width: '25px',
              height: '25px',
              color: '#7D7D7D',
              transform: 'translateX(-14px)',
            }}
            onClick={() => setTicket('')}
          />
        </InputContainer>
        개
      </TicketContainer>
      <TicketContainer
        style={{ marginTop: '15px', transform: 'translateX(-15px)' }}
      >
        <Button
          onClick={() => {
            setTicket((prev) => ((prev ? Number(prev) : 0) + 10).toString());
          }}
        >
          + 10개
        </Button>
        <Button
          onClick={() => {
            setTicket((prev) => ((prev ? Number(prev) : 0) + 100).toString());
          }}
        >
          + 100개
        </Button>
        <Button
          onClick={() => {
            setTicket((prev) => ((prev ? Number(prev) : 0) + 1000).toString());
          }}
        >
          + 1000개
        </Button>
      </TicketContainer>
      {type === 0 ? (
        <KakaoButtons onClick={handleCharge}>
          <ResponsiveIcon icon="raphael:bubble" />
          <Kakao>카카오페이로 결제하기</Kakao>
        </KakaoButtons>
      ) : (
        <ChangeButton onClick={handleNext}>
          {isLargeScreen ? '환전하기' : '환전 신청하기'}
        </ChangeButton>
      )}
      <Options>
        <Option>
          <div>{type === 0 ? '충전 후 티켓' : '환전 후 티켓'}</div>

          {type === 0 ? (
            <div>
              {Number(Tickets?.result?.ticket ?? 0) + (Number(ticket) || 0)}개
            </div>
          ) : Number(Tickets?.result?.ticket) < Number(ticket) ? (
            <div style={{ color: '#FF008C' }}>티켓 부족</div>
          ) : (
            <div>
              {Number(Tickets?.result?.ticket ?? 0) - (Number(ticket) || 0)}개
            </div>
          )}
        </Option>
        <Line />
        <Option>
          <div>{type === 0 ? '티켓 금액' : '입금 받을 금액'}</div>
          <div>{(Number(ticket) || 0) * 100}원</div>{' '}
        </Option>
        <Line />
        <div
          style={{
            width: '400px',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          {!isSmallScreen && type === 1 && (
            <Info>환전 시 등록된 계좌로 정산됩니다.</Info>
          )}
        </div>
      </Options>
      {!isLargeScreen && (
        <>
          <Box>
            <Checkbox
              style={{
                transform: 'translateY(0px)',
              }}
              sx={{
                '& .MuiSvgIcon-root': { fontSize: 17 },
                '&.Mui-checked': {
                  color: '#C908FF',
                },
              }}
              checked={checked}
              onChange={(event) => {
                event.stopPropagation();
                handleChange(event);
              }}
              icon={<CircleUnchecked />}
              checkedIcon={<CircleChecked />}
            />
            <Consent>
              <span style={{ color: '#C908FF' }}>[필수]</span> 전체동의
            </Consent>
          </Box>
          <CheckBox>
            <NewShort>
              {type === 0
                ? '상품, 가격, 결제 전 주의사항 확인'
                : '환전 시 주의사항'}
            </NewShort>
            <Icon
              icon="weui:arrow-outlined"
              style={{
                width: '18px',
                height: '20px',
                cursor: 'pointer',
                color: '#8F8E94',
              }}
            />
          </CheckBox>
        </>
      )}
    </Container>
  );
}

const ResponsiveIcon = styled(Icon)`
  width: 15px;
  height: 13px;
  color: black;

  ${media.notLarge`
    width: 19px; 
    height: 15px;
  `}
`;

const Consent = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  transform: translateY(1px);
`;

const CheckBox = styled.div`
  display: flex;
  column-gap: 78px;
  align-items: center;
  transform: translateX(13px);
`;

const Box = styled.div`
  width: 299px;
  height: 38px;
  border: 1px solid #c908ff;
  margin-bottom: 12px;
  display: flex;
  column-gap: 19px;
  align-items: center;
  padding-left: 18px;

  ${media.medium`
      margin-top: 150px
    `}
  ${media.small`
    margin-top: 200px

    `}
`;

const Options = styled.div`
  ${media.large`
      margin-top: 125px;
  `}
  ${media.medium`
      margin-top: 0px;
  `}
   ${media.small`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    `}
`;

const HistoryContaienr = styled.div`
  display: flex;
  column-gap: 18px;
  align-items: center;
  position: absolute;
  top: 7px;
  right: 7px;
  cursor: pointer;
  ${media.small`
      top: -4px;
      right: -5px;
    `}
`;

const Arrow = styled.div`
  font-size: 13px;
  stroke-width: 1px;
  stroke: #8f8e94;
  color: #8f8e94;
`;

const History = styled.div`
  color: #8f8e94;
  text-align: center;
  font-family: Pretendard;
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  text-decoration-line: underline;
`;

const Info = styled.div`
  color: #c908ff;
  text-align: right;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
`;

const ChangeButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 193px;
  height: 36px;
  border-radius: 7px;
  border: 0;
  background-color: #c908ff;
  color: white;
  margin-top: 72px;
  font-size: 13px;
  font-style: normal;
  font-weight: 600;
  transform: translateX(-20px);
  ${media.medium`
        transform: translateY(400px);
        margin-top: 0px;
        width: 299px;
        height: 45px;
        column-gap: 30px;
    `}
  ${media.small`
    transform: translateY(427px);
    `}
`;

const Line = styled.div`
  border-top: 2px dashed #8f8e94;
  width: 402px;
  height: 2px;
  margin-top: 11px;
  margin-bottom: 15px;
  ${media.notLarge`
        border-top: 1px dashed #8F8E94;
        margin-top: 7px;
    `}
  ${media.small`
      width: 346px;
      height: 1px;
    `}
`;

const Option = styled.div`
  display: flex;
  justify-content: space-between;
  color: #8f8e94;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 17.308px;
  width: 375px;
  height: 20px;
  ${media.notLarge`
      font-size: 15px;
      font-style: normal;
      font-weight: 500;
      width: 345px;
    `}
`;

const KakaoButtons = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 193px;
  height: 36px;
  border-radius: 7px;
  border: 0;
  background-color: #fbe44e;
  color: black;
  margin-top: 72px;
  column-gap: 10px;
  transform: translateX(-20px);
  ${media.medium`
        transform: translateY(400px);
        margin-top: 0px;
        width: 299px;
        height: 45px;
        column-gap: 30px;
    `}
  ${media.small`
    transform: translateY(427px);
    `}
`;

const Kakao = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  transform: translateY(1px);
  font-size: 13px;
  font-style: normal;
  font-weight: 600;
  ${media.notLarge`
      font-size: 15px;
    `}
`;

const Button = styled.button`
  width: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 37px;
  padding: 0px 14px;

  background-color: white;
  color: #8f8e94;
  border-radius: 8px;
  border: 1px solid #8f8e94;

  text-align: center;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  ${media.notLarge`
      border: 1px solid #C1C1C1;
      background: #F5F5F5;
      font-weight: 500;
    `}
  ${media.medium`
      font-size: 17px;
    `}
    ${media.small`
      font-size: 15px;
      height: 32px;
      padding: 0px 20px;
    `}
`;

const Input = styled.input`
  outline: none;
  border: none;
  font-family: Pretendard;
  font-size: 22px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px;
  width: 223px;
  margin-right: 15px;
  transform: translateY(2px);
`;

const Img = styled.img`
  width: 29.81px;
  height: 19.562px;
  margin-right: 19px;
  ${media.small`
      width: 26.163px;
      height: 17.37px;
      margin-right: 15px;
    `}
`;

const InputContainer = styled.div`
  width: 304px;
  height: 49px;
  border-radius: 8px;
  border: 1px solid #000;
  display: flex;
  padding-left: 16px;
  align-items: center;
  ${media.notLarge`
      border: 0.5px solid #000;
    `}
  ${media.small`
        height: 46px
      `}
`;

const Short = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 17.308px;
  display: flex;
  justify-content: flex-start;
  width: 340px;
  margin-bottom: 5px;
`;

const NewShort = styled.div`
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 17.308px;
  display: flex;
  justify-content: center;
  color: #8f8e94;
`;

const TicketContainer = styled.div`
  display: flex;
  column-gap: 13px;
  align-items: center;
  font-size: 22px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px;
  ${media.notLarge`
    font-size: 17px;
font-style: normal;
font-weight: 500;
line-height: 18px;
  `}
`;

const Container = styled.div`
  width: auto;
  height: auto;
  display: flex;
  align-items: center;
  padding-top: 86px;
  flex-direction: column;
  position: relative;
  ${media.medium`
        padding-top: 70px;
    `}
  ${media.small`
        padding: 30px 20px 0px 20px;
    `}
`;

export default TabPage;
