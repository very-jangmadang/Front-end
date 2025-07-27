import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import BigTitle from '../../components/BigTitle';
import axiosInstance from '../../apis/axiosInstance';
import { useNavigate, useLocation } from 'react-router-dom';
import media from '../../styles/media';
import { TAddress } from '../address/addressSetPage';
import { TDeliveryStatus } from '../../types/deliveryStatus';
import icWarning from '../../assets/icWarning.svg';
import { useModalContext } from '../../components/Modal/context/ModalContext';
import GiveUpModal from './modals/GiveUpModal';
import { Icon } from '@iconify/react';
import CompletedModal from './modals/CompletedModal';
import CircleChecked from '@mui/icons-material/CheckCircleOutline';
import CircleUnchecked from '@mui/icons-material/RadioButtonUnchecked';
import Checkbox from '@mui/material/Checkbox';
import WaitShippingModal from './modals/WaitShippingModal';
import useDeliveryStore from '../../store/deliveryStore';
import { formatMinutesToHoursAndMinutes } from '../../utils/FormatMinuitesToHourAndMinutes';
import PayOkModal from './modals/PayOkModal';
import usePay from '../../hooks/usePay';

export type TRaffleInfo = {
  raffleName: string;
  raffleImage: string;
  drawAt: string;
  extendableMinutes: number;
};

export type TWinner = {
  raffleId: number;
  winnerId: number;
  deliveryStatus: TDeliveryStatus;
  addressDeadline: string;
  shippingDeadline: string;
  shippingFee: number;
  invoiceNumber: string;
  address: TAddress | null;
  raffleInfo: TRaffleInfo;
  shippingExtended: boolean;
};

const WinnerPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const deliveryId = location.state?.deliveryId ?? '';
  const { openModal } = useModalContext();
  const [checked, setChecked] = useState(false);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
  const { deliveryStatus, setDeliveryStatus } = useDeliveryStore();

  const [winnerData, setWinnerData] = useState<TWinner>();
  const [address, setAddress] = useState<TAddress>();
  const [raffleId, setRaffleId] = useState<number>(0);

  const queryParams = new URLSearchParams(location.search);
  const approvedAt = queryParams.get('approvedAt');

  useEffect(() => {
    //배송비 결제 이후
    if (!approvedAt) return;
    const handleDelivery = async () => {
      try {
        await axiosInstance.post(
          `/api/member/delivery/${deliveryId}/winner`,
          {},
        );
        console.log('배송지 입력함');
      } catch (error) {
        console.error(error);
      }
    };
    handleDelivery();

    const timer = setTimeout(() => {
      openModal(({ onClose }) => <PayOkModal onClose={onClose} />);
    }, 100);
    return () => clearTimeout(timer);
  }, [approvedAt]);

  const { postMutation } = usePay();
  const handleNextModal = async () => {
    if (checked) {
      postMutation({
        itemId: '배송비',
        itemName: '배송비',
        totalAmount: winnerData?.shippingFee ?? 9999,
      });
    }
  };
  //결제코드 끝

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/api/member/delivery/${deliveryId}/winner`,
        );
        setWinnerData(data.result);
        setDeliveryStatus(data.result.deliveryStatus);
        setAddress(data.result.address);
        setRaffleId(data.result.raffleId);
        console.log(data.result);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAddress();
  }, [deliveryStatus]);

  const handleGiveUpModal = () => {
    openModal(({ onClose }) => (
      <GiveUpModal
        onClose={onClose}
        deliveryId={deliveryId}
        raffleId={raffleId}
      />
    ));
  };

  const handleCompletedModal = () => {
    openModal(({ onClose }) => (
      <CompletedModal onClose={onClose} deliveryId={deliveryId} />
    ));
  };

  const handleWaitdModal = () => {
    openModal(({ onClose }) => (
      <WaitShippingModal onClose={onClose} deliveryId={deliveryId} />
    ));
  };

  const formatDate = (isoString: string) => {
    if (!isoString) {
      return isoString; //유효하지 않은 값이면 기본 메시지 반환
    }

    return new Date(isoString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (deliveryStatus === 'SHIPPING_EXPIRED') {
    // 운송장 입력기한 만료 (당첨자의 선택이 필요함)
    return (
      <Wrapper>
        <BigTitle>래플 결과</BigTitle>
        <RaffleLayout>
          <Box src={winnerData?.raffleInfo.raffleImage} alt="상품 이미지" />
          <RaffleContainer>
            <NameBox>{winnerData?.raffleInfo.raffleName}</NameBox>
            <DateBox>
              당첨 일시 : {formatDate(winnerData?.raffleInfo.drawAt ?? '')}
            </DateBox>
          </RaffleContainer>
        </RaffleLayout>
        <Mark>!</Mark>
        <InfoBox1>해당 래플 개최자가 운송장을 입력하지 않았습니다.</InfoBox1>
        <InfoBox2>당첨을 포기하겠습니까?</InfoBox2>

        <ButtonLayout2>
          <PurpleButton onClick={handleGiveUpModal}>당첨 포기하기</PurpleButton>
          <WarningContainer>
            <img src={icWarning} />
            <WarningBox>
              당첨을 포기 할 경우 티켓과 배송비는 환불됩니다. 개최자는 일주일간
              활동정지되며, 미발송 상점 횟수가 프로필에 표시됩니다.
            </WarningBox>
          </WarningContainer>

          <PurpleButton onClick={handleWaitdModal}>
            기다리기 (
            {formatMinutesToHoursAndMinutes(
              winnerData?.raffleInfo.extendableMinutes ?? 0,
            )}
            )
          </PurpleButton>
        </ButtonLayout2>
      </Wrapper>
    );
  } else {
    //배송지 설정 및 결제 필요
    if (deliveryStatus === 'WAITING_ADDRESS') {
      return (
        <Wrapper>
          <BigTitle>당첨자 정보</BigTitle>
          <AdressWrapper>
            <AddressLayout>
              <AddressContainer>
                <TitleSpan>{address?.addressName ?? '?'}</TitleSpan>
                <DefaultBox>기본 배송지</DefaultBox>
                <AddressSpan>
                  {address?.addressDetail ??
                    '배송지 설정 페이지에서 배송지를 입력하세요'}
                </AddressSpan>
              </AddressContainer>
            </AddressLayout>
            <OtherAddressBox onClick={() => navigate('/address')}>
              다른 배송지 선택하기
            </OtherAddressBox>
          </AdressWrapper>
          <InfoLayout>
            <InfoContainer>
              <SmallTitleSpan>당첨자 배송비 입력현황</SmallTitleSpan>
              <SmallGraySpan>입력 대기</SmallGraySpan>
            </InfoContainer>
            <Hr />
            <InfoContainer>
              <SmallTitleSpan>개최자 운송장번호 입력현황</SmallTitleSpan>
              <SmallGraySpan>입력 대기</SmallGraySpan>
            </InfoContainer>
            <Hr />
            <InfoContainer>
              <SmallTitleSpan>운송장번호</SmallTitleSpan>
              <SmallGraySpan>-------</SmallGraySpan>
            </InfoContainer>
            <Hr />
            <AgreeBox>
              <Checkbox
                style={{
                  transform: 'translateY(0px)',
                }}
                sx={{
                  '& .MuiSvgIcon-root': { fontSize: 25 },
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
            </AgreeBox>
            <CheckBox2>
              <Short>개인정보 제공</Short>
              <Icon
                icon="weui:arrow-outlined"
                style={{
                  width: '23px',
                  height: '25px',
                  cursor: 'pointer',
                  color: '#8F8E94',
                }}
              />
            </CheckBox2>

            <FeeContainer>
              <FeeTitleBox>배송비</FeeTitleBox>
              <FeeAmountBox>{winnerData?.shippingFee} 원</FeeAmountBox>
            </FeeContainer>
          </InfoLayout>

          <ButtonLayout>
            <KakaoButtons
              onClick={handleNextModal}
              disabled={!checked || !address}
            >
              <ResponsiveIcon icon="raphael:bubble" />
              <Kakao>카카오페이로 결제하기</Kakao>
            </KakaoButtons>
            <PurpleButton onClick={() => navigate('/')}>
              나중에 결제하기 (입력기한 :{' '}
              {formatDate(winnerData?.addressDeadline ?? '')})
            </PurpleButton>
          </ButtonLayout>
        </Wrapper>
      );
    } else {
      //배송비 결제 이후 상품 운송 기다리는 중
      return (
        <Wrapper>
          <BigTitle>당첨자 정보</BigTitle>

          <InfoLayout>
            <InfoContainer>
              <SmallTitleSpan>당첨자 배송비 입력현황</SmallTitleSpan>
              <SmallPurpleSpan>입력 완료</SmallPurpleSpan>
            </InfoContainer>
            <Hr />
            <InfoContainer>
              <SmallTitleSpan>개최자 운송장번호 입력현황</SmallTitleSpan>
              {deliveryStatus === 'SHIPPED' && (
                <SmallPurpleSpan>입력 완료</SmallPurpleSpan>
              )}
              {deliveryStatus === 'READY' && (
                <SmallPurpleSpan>입력 완료</SmallPurpleSpan>
              )}
            </InfoContainer>
            <Hr />
            <InfoContainer>
              <SmallTitleSpan>운송장번호</SmallTitleSpan>
              {deliveryStatus === 'SHIPPED' && (
                <SmallPurpleSpan>{winnerData?.invoiceNumber}</SmallPurpleSpan>
              )}
              {deliveryStatus === 'READY' && (
                <SmallGraySpan>입력 대기</SmallGraySpan>
              )}
            </InfoContainer>
            <Hr />
            <DeliveryStatusBox>배송 현황</DeliveryStatusBox>
            <FeeContainer>
              <FeeTitleBox>배송비</FeeTitleBox>
              <FeeAmountBox>{winnerData?.shippingFee} 원</FeeAmountBox>
            </FeeContainer>
          </InfoLayout>

          <ButtonLayout>
            {deliveryStatus === 'SHIPPED' && (
              <>
                <PurpleButton onClick={handleCompletedModal}>
                  거래 완료
                </PurpleButton>
                <PurpleButton onClick={() => navigate('/')}>
                  홈 화면으로 돌아가기
                </PurpleButton>
              </>
            )}
            {deliveryStatus === 'READY' && (
              <>
                <GrayButton>거래 완료</GrayButton>
                <PurpleButton onClick={() => navigate('/')}>
                  홈 화면으로 돌아가기
                </PurpleButton>
              </>
            )}
          </ButtonLayout>
        </Wrapper>
      );
    }
  }
};

export default WinnerPage;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 63px;
`;

const AdressWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 46px 0 118px 0;
  gap: 24px;
  ${media.medium`width:596px;
  align-items: center;`};
`;

const AddressLayout = styled.div`
  display: flex;
  width: 805px;
  align-items: center;
  gap: 40px;
  ${media.medium`width:100%;`}
`;

const AddressContainer = styled.div`
  display: flex;
  box-sizing: content-box;
  max-height: 59px;
  padding: 17px 41px;
  align-items: center;
  justify-content: space-between;
  flex: 1 0 0;
  border-radius: 21px;
  border: 1px solid #8f8e94;
`;

const TitleSpan = styled.span`
  color: #000;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  // width: 100px;
`;

const AddressSpan = styled.span`
  color: #000;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 20.363px; /* 113.13% */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 460px;
  ${media.medium`
  width: 300px;
`}
`;

const OtherAddressBox = styled.div`
  display: inline-flex;
  height: 30px;
  padding: 0px 14px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  margin-left: auto;

  border-radius: 11px;
  border: 1px solid #8f8e94;
  cursor: pointer;

  color: #8f8e94;
  text-align: center;
  font-family: 'Pretendard Variable';
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 36.832px; /* 245.546% */
`;

const DeliveryStatusBox = styled.div`
  display: inline-flex;
  width: 91px;
  height: 22px;
  padding: 0px 14px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  margin-left: auto;
  margin-bottom: 50px;

  border-radius: 11px;
  border: 1px solid #8f8e94;
  cursor: pointer;

  color: #8f8e94;
  text-align: center;
  font-family: 'Pretendard Variable';
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 36.832px; /* 263.085% */
`;

const DefaultBox = styled.div`
  display: flex;
  height: 25px;
  padding: 0px 14px;
  justify-content: center;
  align-items: center;
  gap: 10px;

  border-radius: 31px;
  border: 1px solid #c908ff;

  color: #c908ff;
  text-align: center;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 36.832px; /* 263.085% */
`;

const InfoLayout = styled.div`
  min-width: 490px;
  display: flex;
  flex-direction: column;
  margin-top: 66px;
`;

const InfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const SmallTitleSpan = styled.span`
  color: #000;
  font-family: Pretendard;
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: 17.308px; /* 115.385% */
`;

const SmallGraySpan = styled.span`
  color: #8f8e94;
  text-align: right;
  font-family: Pretendard;
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: 17.308px; /* 115.385% */
`;

const SmallPurpleSpan = styled.span`
  color: #c908ff;
  text-align: right;
  font-family: Pretendard;
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: 17.308px; /* 115.385% */
`;

const Hr = styled.div`
  width: 100%;
  height: 1px;
  background: #8f8e94;
  margin: 7.5px 0 14.8px 0;
`;

const ButtonLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  min-width: 474px;
  gap: 47px;
  ${media.medium`gap:30px;`}
`;

const PurpleButton = styled.button`
  all: unset;
  width: 100%;
  height: 46px;
  border-radius: 7px;
  background: #c908ff;

  color: #fff;
  text-align: center;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;

  cursor: pointer;
`;

const GrayButton = styled.div`
  width: 474px;
  min-height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 7px;
  border: 1px solid #8f8e94;
  background: #e4e4e4;

  color: #8f8e94;
  text-align: center;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 18px; /* 100% */
  letter-spacing: -0.165px;
`;

const Box = styled.img`
  width: 209px;
  height: 209px;
  flex-shrink: 0;
  background: #f5f5f5;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const NameBox = styled.div`
  display: flex;
  width: 209px;
  height: 29px;
  flex-direction: column;
  justify-content: center;

  color: #000;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%; /* 30px */
`;

const DateBox = styled.div`
  display: flex;
  width: 277px;
  height: 20px;
  flex-direction: column;
  justify-content: center;

  color: #000;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 30px */
`;

const RaffleLayout = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 725px;
  justify-content: center;
  align-items: center;
  gap: 76.5px;
  margin-top: 54px;
`;

const RaffleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 12px;
`;

const Mark = styled.div`
  display: flex;
  width: 71px;
  height: 71px;
  margin: 51px 0 27px 0;
  flex-direction: column;
  justify-content: center;
  background-color: #f5f5f5;

  border-radius: 50px;
  color: #8f8e94;
  text-align: center;
  font-family: Pretendard;
  font-size: 50px;
  font-style: normal;
  font-weight: 500;
  line-height: 134.814%; /* 67.407px */
`;

const InfoBox1 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: #8f8e94;
  text-align: center;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 134.814%; /* 24.266px */
`;

const InfoBox2 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: #8f8e94;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 134.814%;
`;

const ButtonLayout2 = styled.div`
  margin-top: 149px;
  ${media.medium`margin-top:80px;`}
`;

const WarningContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin: 17px 0 29px 0;

  ${media.medium`
  margin: 11px 0 29px 0;`}
`;

const WarningBox = styled.div`
  display: flex;
  width: 424px;
  height: 28px;
  flex-direction: column;
  justify-content: center;
  color: #c908ff;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const FeeContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  gap: 12px;
  margin: 89px 0 47px 0;
`;

const FeeTitleBox = styled.div`
  display: flex;
  width: 50px;
  height: 20px;
  flex-direction: column;
  justify-content: center;

  color: #000;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 17.308px; /* 96.154% */
`;

const FeeAmountBox = styled.div`
  display: flex;
  width: 92px;
  height: 20px;
  flex-direction: column;
  justify-content: center;

  color: #000;
  text-align: right;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 17.308px; /* 96.154% */
`;

const KakaoButtons = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 46px;
  border-radius: 7px;
  border: 0;
  background-color: #fbe44e;
  color: black;
  cursor: pointer;

  &:disabled {
    background-color: #d3d3d3; /* 회색 */
    color: #888;
  }
`;

const Kakao = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  transform: translateY(1px);
  color: #000;
  text-align: center;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const ResponsiveIcon = styled(Icon)`
  width: 24px;
  height: 20px;
  color: black;
  display: inline;
`;

const AgreeBox = styled.div`
  width: 100%;
  height: 43px;
  border-bottom: 1px solid #c1c1c1;
  margin-top: 228px;
  margin-bottom: 15px;
  display: flex;
  column-gap: 15px;
  align-items: center;
  padding-left: 10px;
`;

const CheckBox2 = styled.div`
  display: flex;
  margin-bottom: 48px;
  column-gap: 300px;
  align-items: center;
  transform: translateX(70px);
`;

const Consent = styled.div`
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  transform: translateY(1px);
`;

const Short = styled.div`
  color: #8f8e94;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 17.308px; /* 96.154% */
`;
