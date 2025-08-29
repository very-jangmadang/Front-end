import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Item from './components/Item';
import Market from './components/Market';
import Probability from './components/Probability';
import axiosInstance from '../../apis/axiosInstance';
import { useParams, useLocation } from 'react-router-dom';
import { TRaffleDetail, RaffleDetailProps } from '../../types/RaffleDetail';
import useRaffleStore from '../../store/raffleStore';
import { getClientId } from './utils/clientId';
import media from '../../styles/media';
import useScreenSize from '../../styles/useScreenSize';

const RaffleDetailPage: React.FC = () => {
  const { type } = useParams<{ type?: string }>();
  const [raffleData, setRaffleData] = useState<RaffleDetailProps>({
    imageUrls: [],
    name: '',
    category: '',
    ticketNum: 0,
    startAt: '',
    endAt: '',
    description: '',
    minUser: 0,
    view: 0,
    likeCount: 0,
    likeStatus: false,
    applyCount: 0,
    nickname: '',
    storeId: 0,
    followCount: 0,
    reviewCount: 0,
    userStatus: '',
    isWinner: '',
    raffleStatus: 'UNOPENED',
    deliveryId: 0,
    followStatus: false,
    storeImageUrl: '',
    minTicket: 0,
  });
  const clientId = getClientId();
  const typeNumber = type ? parseInt(type, 10) : undefined;
  const isApplying = useRaffleStore((s) => {
    console.log('리렌더링 확인:', s.isApplying);
    return s.isApplying;
  });
  const isChecked = useRaffleStore((s) => s.isChecked);
  const [followingState, setFollowingState] = useState<boolean>(false);
  const { isSmallScreen, isMediumScreen, isLargeScreen } = useScreenSize();

  useEffect(() => {
    console.log('래플 상세보기 useEffect');
    const fetchRaffleData = async () => {
      try {
        const { data }: { data: TRaffleDetail } = await axiosInstance.get(
          `/api/permit/raffles/${typeNumber}`,
        );

        console.log('API Response:', data.result);
        setRaffleData(data.result);
      } catch (error) {
        console.error('데이터 가져오기 실패', error);
      }
    };

    fetchRaffleData();
  }, [isApplying, followingState, isChecked]);

  return (
    <Wrapper>
      <Item {...raffleData} />
      {isLargeScreen && (
        <MoreInfoLayout>
          <Market
            {...raffleData}
            type={type}
            setFollowingState={setFollowingState}
          />
          <Probability {...raffleData} />
        </MoreInfoLayout>
      )}

      {isMediumScreen && (
        <>
          <Probability {...raffleData} />
          <Market
            {...raffleData}
            type={type}
            setFollowingState={setFollowingState}
          />
        </>
      )}
    </Wrapper>
  );
};

export default RaffleDetailPage;

const Wrapper = styled.div`
  max-width: 1440px;
  padding-bottom: 200px;
  display: flex;
  align-items: safe center;
  flex-direction: column;
  padding-top: 63px;
  ${media.medium`padding-bottom: 63px;
      `}
`;

const MoreInfoLayout = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;
