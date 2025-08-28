import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import ticketIcon from '../../../../assets/ticket.svg';
import { WepinProvider } from '@wepin/provider-js';
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
import { ethers } from 'ethers';

interface TabTypeProps {
  type: number;
}

// --- 상수 (필요 시 값 교체) ---
const WEPIN_NETWORK = 'Verychain';
const SERVICE_WALLET_ADDRESS = '0x789e278621f6359239ede24643ce22ce341bc5ee';
const TICKET_PRICE_IN_CRYPTO = 1;
const EXCHANGE_CONTRACT_ADDRESS = '0x789e278621f6359239ede24643ce22ce341bc5ee';
const EXCHANGE_CONTRACT_ABI = [
  { stateMutability: 'payable', type: 'fallback' },
  {
    inputs: [],
    name: 'getVaultBalance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  { stateMutability: 'payable', type: 'receive' },
];

// --- 이 페이지 안에서 WepinProvider 생성 + 초기화 + EVM Provider/Signer 준비 ---
const wepinProvider = new WepinProvider({
  appId: import.meta.env.VITE_WEPIN_APP_ID as string,
  appKey: import.meta.env.VITE_WEPIN_APP_KEY as string,
});

async function initWepinProvider() {
  if (!wepinProvider.isInitialized()) {
    await wepinProvider.init({
      defaultLanguage: 'ko',
      defaultCurrency: 'KRW',
    });
    console.log('WepinProvider 초기화 완료');
  }
  return wepinProvider;
}

async function getWepinEvmProvider(): Promise<any> {
  const wp = await initWepinProvider();
  // VERY Mainnet: evmvery (chainId 4613 = 0x1205)
  const provider = await wp.getProvider('evmvery');
  return provider; // EIP-1193 provider
}

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
  const handleOpenChangeOkModal = useCallback(
    (txId: string) => {
      openModal(({ onClose }) => (
        <ChangeOkModal txId={txId} onClose={onClose} />
      ));
    },
    [openModal],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleNext = () => {
    handleExchange();
  };

  // 인증된 Wepin SDK (기존 충전 로직에서 사용)
  const getAuthenticatedWepin = async () => {
    if (wepin) return wepin;
    console.log('Wepin 로그인이 필요하여 로그인 위젯을 엽니다.');
    return handleWepinLogin();
    // 로그인 후 wepin context에 인스턴스가 들어있다고 가정
  };

  // --- 환전: EVM Provider + ethers 로 컨트랙트 함수 실행 ---
  const handleExchange = async () => {
    if (!ticket || Number(ticket) <= 0) {
      alert('환전할 티켓 수량을 입력해주세요.');
      return;
    }
    if (Number(Tickets?.result?.ticket ?? 0) < Number(ticket)) {
      alert('보유한 티켓이 부족합니다.');
      return;
    }

    try {
      // 1) VERY EVM Provider
      const evmProvider = await getWepinEvmProvider();

      // 2) 계정/체인 확인
      const accounts: string[] = await evmProvider.request({
        method: 'eth_requestAccounts',
      });
      if (!accounts?.length) {
        await evmProvider.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }],
        });
        throw new Error('계정이 없습니다.');
      }

      const chainIdHex: string = await evmProvider.request({
        method: 'eth_chainId',
      });
      if (chainIdHex.toLowerCase() !== '0x1205') {
        await evmProvider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1205' }],
        });
      }

      // 3) ethers 서명자
      const browserProvider = new ethers.BrowserProvider(evmProvider);
      const signer = await browserProvider.getSigner();

      // 4) 컨트랙트 인스턴스
      const contract = new ethers.Contract(
        EXCHANGE_CONTRACT_ADDRESS,
        EXCHANGE_CONTRACT_ABI,
        signer,
      );

      // 5) 금액(티켓 × 단가) → Wei(BigInt)
      const weiAmount = ethers.parseEther(
        (Number(ticket) * TICKET_PRICE_IN_CRYPTO).toString(),
      );

      // 6) withdraw(uint256) 실행 (nonpayable → value 0)
      const tx = await contract.withdraw(weiAmount);
      const receipt = await tx.wait();
      console.log('환전 트랜잭션 완료, 영수증:', tx);

      // 7) 후처리
      try {
        await axiosInstance.post('/api/member/payment/exchange', {
          amount: Number(ticket),
        });
      } catch (e) {
        console.error('API 요청 오류:', e);
      }

      handleOpenChangeOkModal(tx.hash);
    } catch (err) {
      console.error('환전 트랜잭션 오류:', err);
      alert('티켓 환전 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  // --- 충전: 기존 위핀 SDK send 사용 (그대로 유지) ---
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

    try {
      const accounts = await sdk.getAccounts();
      if (!accounts || accounts.length === 0) {
        alert(
          `Wepin 지갑에서 ${WEPIN_NETWORK} 계정을 찾을 수 없습니다. Wepin 지갑을 열어 계정을 확인해주세요.`,
        );
        await sdk.openWidget();
        return;
      }

      const userAccount = accounts[0];
      const amountToSend = (Number(ticket) * TICKET_PRICE_IN_CRYPTO).toString();

      const result = await sdk.send({
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

      handleOpenChargeOkModal(result.txId);
    } catch (error) {
      console.error('Wepin 트랜잭션 처리 중 오류 발생:', error);
      alert(
        '티켓 충전 중 오류가 발생했습니다. 잔액 확인 후 다시 시도해주세요.',
      );
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
          onClick={() =>
            setTicket((prev) => ((prev ? Number(prev) : 0) + 10).toString())
          }
        >
          + 10개
        </Button>
        <Button
          onClick={() =>
            setTicket((prev) => ((prev ? Number(prev) : 0) + 100).toString())
          }
        >
          + 100개
        </Button>
        <Button
          onClick={() =>
            setTicket((prev) => ((prev ? Number(prev) : 0) + 1000).toString())
          }
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
          <div>{Number(ticket) || 0} VERY</div>
        </Option>
        <Line />
        <div
          style={{
            width: '400px',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        ></div>
      </Options>
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
  width: 27px;
  height: 23.4px;
  margin-left: -5px;
  ${media.notLarge`
    width: 34.2px;
    height: 27px;
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
