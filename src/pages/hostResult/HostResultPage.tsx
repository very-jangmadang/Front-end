import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import BigTitle from '../../components/BigTitle';
import grayDelivery from '../../assets/hostResult/grayDelivery.svg';
import icMark from '../../assets/hostResult/icMark.svg';
import axiosInstance from '../../apis/axiosInstance';
import { useModalContext } from '../../components/Modal/context/ModalContext';
import DeliverModal from './modals/DeliverModal';
import CancleModal from './modals/CancelModal';
import NewDrawerModal from './modals/NewDrawerModal';
import MakeDrawerModal from './modals/MakeDrawerModal';
import ConsiderModal from './modals/ConsiderModal';
import WaitModal from './modals/WaitModal';
import { formatMinutesToHoursAndMinutes } from '../../utils/FormatMinuitesToHourAndMinutes';
import { formatDate } from '../../utils/formatDate';
import useHostResultStore from './store/hostResultStore';
import media from '../../styles/media';

const ResultPage: React.FC = () => {
  const { raffleData, deliveryData, setRaffleData, setDeliveryData } =
    useHostResultStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { openModal } = useModalContext();

  const raffleStatus = location.state?.status;
  const raffleId =
    location.state?.raffleId ?? deliveryData?.raffleId ?? raffleData?.raffleId;
  const deliveryId = location.state?.deliveryId ?? deliveryData?.deliveryId;
  const minTicket = deliveryData?.minTicket ?? raffleData?.minTicket ?? 0;
  const applyTicket = deliveryData?.applyTicket ?? raffleData?.applyTicket ?? 0;
  const totalAmount = deliveryData?.totalAmount ?? raffleData?.totalAmount ?? 0;
  const deliveryStatus = deliveryData?.deliveryStatus;
  const address = deliveryData?.address;

  useEffect(() => {
    if (raffleStatus === 'UNFULFILLED') {
      fetchResult();
    } else {
      fetchDelivery();
    }
  }, [deliveryId, deliveryStatus]);

  const fetchResult = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/member/raffles/${raffleId}/result`,
      );
      setRaffleData(data.result);
    } catch (error) {
      console.error('미충족 래플 결과 조회 실패', error);
    }
  };

  const fetchDelivery = async () => {
    if (!deliveryId) return;

    try {
      const { data } = await axiosInstance.get(
        `/api/member/delivery/${deliveryId}/owner`,
      );
      setDeliveryData(data.result);
    } catch (error) {
      console.error('배송 정보 조회 실패', error);
    }
  };

  const handleDelver = () => {
    openModal(({ onClose }) => (
      <DeliverModal onClose={onClose} deliveryId={deliveryId} />
    ));
  };

  const handleEnd = () => {
    openModal(({ onClose }) => (
      <CancleModal onClose={onClose} raffleId={raffleId} />
    ));
  };

  const handleNew = () => {
    openModal(({ onClose }) => (
      <NewDrawerModal onClose={onClose} raffleId={raffleId} />
    ));
  };

  const handleMake = () => {
    openModal(({ onClose }) => (
      <MakeDrawerModal onClose={onClose} raffleId={raffleId} />
    ));
  };

  const handleWait = () => {
    openModal(({ onClose }) => (
      <WaitModal onClose={onClose} deliveryId={deliveryId} />
    ));
  };

  const handleConsider = () => {
    openModal(({ onClose }) => (
      <ConsiderModal onClose={onClose} deliveryId={deliveryId} />
    ));
  };

  return (
    <Wrapper>
      <BigTitle>래플 결과</BigTitle>
      <ResultLayout>
        <ResultContainer>
          <TextBox>최소 마감 티켓</TextBox>
          <TextBox>{minTicket} 개</TextBox>
        </ResultContainer>
        <ResultContainer>
          <TextBox>현재 티켓</TextBox>
          {applyTicket >= minTicket && (
            <PurpleTextBox>{applyTicket} 개</PurpleTextBox>
          )}
          {applyTicket < minTicket && (
            <GrayTextBox>{applyTicket} 개</GrayTextBox>
          )}
        </ResultContainer>
        <HorizonBox />
        <ResultContainer>
          <TextBox>배송 후 정산금액</TextBox>
          <PurpleTextBox>{totalAmount} 원</PurpleTextBox>
        </ResultContainer>
        <ResultContainer>
          {raffleStatus === 'ENDED' && (
            <>
              <DeliverStausBox>당첨자 배송비 결제 현황</DeliverStausBox>
              {deliveryStatus === 'WAITING_ADDRESS' && (
                <>
                  <DeliveryWaitBox>배송지 입력 대기</DeliveryWaitBox>
                </>
              )}
              {(deliveryStatus === 'READY' || deliveryStatus === 'SHIPPED') && (
                <>
                  <DeliveryDoneBox>배송 가능</DeliveryDoneBox>
                </>
              )}
              {deliveryStatus === 'ADDRESS_EXPIRED' && (
                <>
                  <DeliveryTimeoverBox>
                    <img src={icMark} /> 배송지 입력기한 초과
                  </DeliveryTimeoverBox>
                </>
              )}
            </>
          )}
        </ResultContainer>
        {raffleStatus == 'ENDED' && (
          <>
            {(deliveryStatus === 'WAITING_ADDRESS' ||
              deliveryStatus === 'ADDRESS_EXPIRED') && (
              <GrayAddressBox>
                <img src={grayDelivery} />
              </GrayAddressBox>
            )}
            {deliveryStatus === 'READY' && (
              <WhiteAddressBox>
                <NameBox>{address.recipientName}</NameBox>
                <VerticalBox />
                <AddressBox>
                  ({address.addressId}){address.addressDetail}(
                  {address.phoneNumber})
                </AddressBox>{' '}
              </WhiteAddressBox>
            )}
          </>
        )}
      </ResultLayout>
      <ButtonContainer>
        {raffleStatus == 'ENDED' && (
          <>
            {deliveryStatus === 'WAITING_ADDRESS' && (
              <>
                <GrayButtonBox>운송장 입력하기</GrayButtonBox>
                <GrayButtonBox>
                  나중에 입력하기 (입력기한 :{' '}
                  {formatDate(deliveryData?.shippingDeadline)})
                </GrayButtonBox>
              </>
            )}
            {deliveryStatus === 'READY' && (
              <>
                <PurpleButtonBox onClick={handleDelver}>
                  운송장 입력하기
                </PurpleButtonBox>
                <PurpleButtonBox
                  onClick={() => navigate(`/raffles/${raffleId}`)}
                >
                  나중에 입력하기 (입력기한 :{' '}
                  {formatDate(deliveryData?.shippingDeadline)})
                </PurpleButtonBox>
              </>
            )}
            {deliveryStatus === 'SHIPPED' && (
              <>
                <GrayButtonBox>운송장 입력완료</GrayButtonBox>
                <PurpleButtonBox
                  onClick={() => navigate(`/raffles/${raffleId}`)}
                >
                  래플 보러가기
                </PurpleButtonBox>
              </>
            )}
            {deliveryStatus === 'ADDRESS_EXPIRED' && (
              <>
                <PurpleButtonBox onClick={handleEnd}>
                  래플 강제종료
                </PurpleButtonBox>
                <PurpleButtonBox onClick={handleNew}>
                  새로운 당첨자 뽑기
                </PurpleButtonBox>
                <PurpleButtonBox onClick={handleWait}>
                  기다리기(
                  {formatMinutesToHoursAndMinutes(
                    raffleData.remainedMinutes ?? 0,
                  )}
                  )
                </PurpleButtonBox>
              </>
            )}
          </>
        )}
        {raffleStatus === 'UNFULFILLED' && (
          <>
            <PurpleButtonBox onClick={handleEnd}>래플 강제종료</PurpleButtonBox>
            <PurpleButtonBox onClick={handleMake}>
              당첨자 추첨 진행
            </PurpleButtonBox>
            <PurpleButtonBox onClick={() => navigate(`/raffles/${raffleId}`)}>
              나중에 선택하기(
              {formatMinutesToHoursAndMinutes(raffleData.remainedMinutes ?? 0)})
            </PurpleButtonBox>
          </>
        )}
      </ButtonContainer>
    </Wrapper>
  );
};

export default ResultPage;

const Wrapper = styled.div`
  max-width: 1080px;
  max-height: 1498px;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 63px;
`;

const ResultLayout = styled.div`
  width: 636px;
  height: 310px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin: 105px auto 243px auto;
  ${media.medium`
  margin: 40px auto 222px auto;`}
`;

const ResultContainer = styled.div`
  width: 100%;
  height: 25px;
  margin-bottom: 26px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TextBox = styled.div`
  display: flex;
  height: 19.215px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;

  color: #000;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 5 100%; /* 20px */
`;

const GrayTextBox = styled.div`
  display: flex;
  height: 19.215px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;

  color: #8f8e94;
  text-align: right;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 100%; /* 20px */
`;

const PurpleTextBox = styled.div`
  display: flex;
  height: 19.215px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;

  color: #c908ff;
  text-align: right;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 100%; /* 20px */
`;

const HorizonBox = styled.hr`
  width: 100%;
  height: 1px;
  background: #000;
  margin: 2px 0 28px 0;
`;

const DeliverStausBox = styled.div`
  display: flex;
  width: 200px;
  height: 20px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;

  color: #8f8e94;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 100%; /* 18px */
`;

const DeliveryWaitBox = styled.div`
  display: flex;
  height: 25px;
  padding: 0px 14px;
  justify-content: center;
  align-items: center;

  border-radius: 31px;
  border: 1px solid #8f8e94;

  color: #8f8e94;
  text-align: right;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 36.832px; /* 263.085% */
`;

const DeliveryDoneBox = styled.div`
  display: flex;
  height: 25px;
  padding: 0px 14px;
  justify-content: center;
  align-items: center;

  border-radius: 31px;
  border: 1px solid #c908ff;

  color: #c908ff;
  text-align: right;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 36.832px; /* 263.085% */
`;

const DeliveryTimeoverBox = styled.div`
  display: flex;
  width: 194px;
  height: 20px;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 5px;

  color: #ff008c;
  text-align: right;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 36.832px; /* 263.085% */

  img {
    width: 15px;
    height: 15px;
  }
`;

const WhiteAddressBox = styled.div`
  width: 636px;
  height: 59px;
  box-sizing: border-box;
  border-radius: 10px;
  border: 1px solid #8f8e94;
  margin-top: 45px;
  padding: 0 2px 0 27.5px;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const NameBox = styled.div`
  display: flex;
  color: #000;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const VerticalBox = styled.div`
  width: 1px;
  height: 47px;
  background: #8f8e94;
  margin: 0 27.5px;
`;
const AddressBox = styled.div`
  display: flex;
  color: #000;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 15.763px; /* 112.59% */
`;

const GrayAddressBox = styled.div`
  width: 636px;
  height: 59px;
  margin-top: 45px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 47px;

  ${media.medium`gap:30px;`}
`;

const GrayButtonBox = styled.div`
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

const PurpleButtonBox = styled.button`
  width: 474px;
  height: 46px;
  flex-shrink: 0;
  border-radius: 7px;
  background: #c908ff;
  border: none;

  color: #fff;
  text-align: center;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px; /* 90% */
  letter-spacing: -0.165px;

  cursor: pointer;
`;

const VerticalLine = styled.div`
  width: 1px;
  height: 40px;
  background-color: #8f8e94;
  margin-right: 10px;
`;

const DottedLine = styled.div`
  flex-grow: 1;
  height: 2px;
  border-bottom: 2px dashed #8f8e94;
`;
