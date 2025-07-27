import React, { useState } from 'react';
import styled from 'styled-components';
import smallTicket from '../assets/smallProductCard/smallTicket.svg';
import smallUnlike from '../assets/smallProductCard/smallUnlike.svg';
import smallLike from '../assets/smallProductCard/smallLike.svg';
import { Link } from 'react-router-dom';
import RaffleProps from '../types/RaffleProps';
import { getFormatTime } from '../utils/formateTime';
import { useAuth } from '../context/AuthContext';
import useLike from '../hooks/useLike';
import { OpenLogInModal } from '../utils/OpenLogInModal';

const SmallProductCard: React.FC<RaffleProps> = ({
  raffleId,
  imageUrls,
  name,
  ticketNum,
  timeUntilEnd,
  finish,
  participantNum,
  like,
  raffleStatus,
}) => {
  const { isLiked, toggleLike, isProcessing } = useLike(like, raffleId);
  const { isAuthenticated, logout } = useAuth();
  const handleOpenModal = OpenLogInModal();

  return (
    <Wrapper>
      <StyledLink to={`/raffles/${raffleId}`}>
        <ImageContainer $backgroundImage={imageUrls[0] || ''}>
          {finish && (
            <>
              <RaffleClosingBox>응모 마감</RaffleClosingBox>
              <EndBox />
            </>
          )}
          {raffleStatus == 'UNOPENED' && (
            <>
              <RaffleClosingBox>응모 오픈 전</RaffleClosingBox>
              <EndBox />
            </>
          )}
          {raffleStatus != 'UNOPENED' &&
            timeUntilEnd > 0 &&
            timeUntilEnd <= 86400 && <TextBox>마감임박</TextBox>}
          <LikeBox
            onClick={(event) => {
              event.stopPropagation(); // 이벤트 전파 막기
              event.preventDefault(); // 기본 동작 막기
              if (isAuthenticated) {
                toggleLike(event);
              } else {
                handleOpenModal();
              }
            }}
          >
            <img
              src={isLiked ? smallLike : smallUnlike}
              alt={isLiked ? 'Liked' : 'Unliked'}
            />
          </LikeBox>
        </ImageContainer>
        <Layout>
          <TitleContainer>{name}</TitleContainer>
          <InfoContainer>
            <TicketBox>
              <img src={smallTicket} alt="smallTicket" /> {ticketNum}
            </TicketBox>
            {!finish && <TimeBox>{getFormatTime(timeUntilEnd)}뒤 마감</TimeBox>}
          </InfoContainer>
        </Layout>
      </StyledLink>
    </Wrapper>
  );
};

export default SmallProductCard;

const Wrapper = styled.div`
  width: 192px;
  height: 261px;
  background-color: #ffffff;
`;

const StyledLink = styled(Link)`
  text-decoration: none; /* 밑줄 제거 */
  color: inherit; /* 기본 색상 유지 */
`;

const ImageContainer = styled.div.attrs<{ $backgroundImage: string }>(
  ({ $backgroundImage }) => ({
    style: { backgroundImage: `url(${$backgroundImage})` },
  }),
)`
  width: 192px;
  height: 192px;
  flex-shrink: 0;
  border-radius: 3px;
  background-color: #f7f7f7;
  position: relative;
  margin-top: 14px;

  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`;

const RaffleClosingBox = styled.div`
  width: 94px;
  height: 33px;
  flex-shrink: 0;
  border-radius: 31px;
  border: 2px solid var(--Main-Grey, #8f8e94);

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;

  color: var(--Main-Grey, #8f8e94);
  text-align: center;
  font-family: 'Pretendard Variable';
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px; /* 128.571% */
`;

const TextBox = styled.div`
  width: 71px;
  height: 23px;
  flex-shrink: 0;
  border-radius: 42px;
  background: rgba(201, 8, 255, 0.2);

  position: absolute;
  top: 162px;
  right: 114px;
  display: flex;
  justify-content: center;
  align-items: center;

  color: #c908ff;
  text-align: center;
  font-family: Pretendard;
  font-size: 11px;
  font-style: normal;
  font-weight: 600;
  line-height: 18px; /* 163.636% */
`;

const LikeBox = styled.div`
  width: 30px;
  height: 30px;
  flex-shrink: 0;

  position: absolute;
  top: 163px;
  right: 0px;

  cursor: pointer;
`;

const Layout = styled.div`
  padding: 0 9px 5px 7px;
`;

const TitleContainer = styled.div`
  display: inline-flex;
  height: 31px;
  padding: 5px 0px 4px 0px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  color: #000;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TicketBox = styled.div`
  display: flex;
  gap: 8.61px;

  color: #000;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
`;

const TimeBox = styled.div`
  color: #8f8e94;
  text-align: right;
  font-family: Pretendard;
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
`;

const EndBox = styled.div`
  width: 100%;
  height: 100%;

  border-radius: 5px;
  background: rgba(193, 193, 193, 0.8);
  z-index: 1;
`;
