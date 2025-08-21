import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import ticketIcon from '../../../../assets/ticket.svg';
import veryLogo from '../../../../assets/charge/very-logo.svg';
import { Icon } from '@iconify/react';
import { useModalContext } from '../../../../components/Modal/context/ModalContext';
import ChangeModal from '../modal/ChangeModal';
import useScreenSize from '../../../../styles/useScreenSize';
import media from '../../../../styles/media';
import Checkbox from '@mui/material/Checkbox';
import { useMutation, useQuery } from '@tanstack/react-query';
import { GetMyTicket, PostExchange } from '../../apis/chargeAPI';
import ChargeOkModal from '../modal/ChargeOkModal';
import ChangeOkModal from '../modal/ChangeOkModal';
import { useNavigate } from 'react-router-dom';
import { useWepin } from '../../../../context/WepinContext';
import { useWepinLogin } from '../../../../hooks/useWepinLogin';
import CircleChecked from '@mui/icons-material/CheckCircleOutline';
import CircleUnchecked from '@mui/icons-material/RadioButtonUnchecked';
import axiosInstance from '../../../../apis/axiosInstance';

interface TabTypeProps {
  type: number;
}

// --- Wepin 트랜잭션 관련 설정 (실제 값으로 변경 필요) ---
const WEPIN_NETWORK = 'Verychain';
const SERVICE_WALLET_ADDRESS = '0x789e278621f6359239ede24643ce22ce341bc5ee'; // 서비스의 입금 주소
const TICKET_PRICE_IN_CRYPTO = 0.1; // 1 티켓 당 전송할 암호화폐 양 (예시)

function TabPage({ type }: TabTypeProps) {
  const [ticket, setTicket] = useState<string>('');
  const [checked, setChecked] = useState(false);
  const { openModal } = useModalContext();
  const { isSmallScreen, isLargeScreen } = useScreenSize();
  const navigate = useNavigate();

  const { wepin } = useWepin();
  const { handleWepinLogin } = useWepinLogin();
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

  const handleOpenChargeOkModal = useCallback(
    (txId: string) => {
      openModal(({ onClose }) => (
        <ChargeOkModal txId={txId} onClose={onClose} />
      ));
    },
    [openModal],
  );
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

  // 인증된 Wepin SDK 인스턴스를 가져오는 헬퍼 함수
  const getAuthenticatedWepin = async () => {
    if (wepin) {
      return wepin;
    }
    console.log('Wepin 로그인이 필요하여 로그인 위젯을 엽니다.');
    return handleWepinLogin();
  };

  const handleCharge = async () => {
    if (!ticket || Number(ticket) <= 0) {
      alert('충전할 티켓 수량을 입력해주세요.');
      return;
    }

    const sdk = await getAuthenticatedWepin();

    if (!sdk) {
      console.log('Wepin 로그인이 완료되지 않았습니다.');
      return;
    }

    // 3. Wepin SDK를 사용하여 트랜잭션을 실행합니다.
    try {
      console.log(`계정정보 가져오기`);
      const accounts = await sdk.getAccounts();

      if (!accounts || accounts.length === 0) {
        alert(
          `Wepin 지갑에서 ${WEPIN_NETWORK} 계정을 찾을 수 없습니다. Wepin 지갑을 열어 계정을 확인해주세요.`,
        );
        await sdk.openWidget(); // 사용자가 확인할 수 있도록 지갑을 열어줌
        return;
      }

      const userAccount = accounts[0]; // 첫 번째 계정을 사용
      const amountToSend = (Number(ticket) * TICKET_PRICE_IN_CRYPTO).toString();

      console.log('트랜잭션 전송을 시작합니다...');
      // `send` 메서드는 사용자에게 PIN 입력 등 확인을 요청하는 위젯을 띄웁니다.
      const result = await sdk.send({
        // userAccount는 이미 주소와 네트워크 정보를 포함한 Account 객체입니다.
        account: userAccount,
        txData: {
          toAddress: SERVICE_WALLET_ADDRESS,
          amount: amountToSend,
        },
      });
      try {
        const response = await axiosInstance.post('/api/member/tickets/vary', {
          txid: result.txId,
        });
        console.log('API 응답:', response.data);
      } catch (e) {
        console.error('API 요청 오류:', e);
      }
      console.log('트랜잭션 성공! TxID:', result.txId);
      // 성공 모달을 띄웁니다.
      handleOpenChargeOkModal(result.txId);
    } catch (error) {
      console.error('Wepin 트랜잭션 처리 중 오류 발생:', error);
      alert('티켓 충전 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
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
          <VeryLogoIcon src={veryLogo} alt="Very Logo" />
          <Kakao>베리코인으로 충전하기</Kakao>
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
  background-color: #c908ff;
  color: white;
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

const VeryLogoIcon = styled.img`
  width: 27px; /* 15px * 1.8 = 27px */
  height: 23.4px; /* 13px * 1.8 = 23.4px */
  margin-left: -5px; /* 왼쪽으로 5픽셀 이동 */
  ${media.notLarge`
    width: 34.2px; /* 19px * 1.8 = 34.2px */
    height: 27px; /* 15px * 1.8 = 27px */
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
