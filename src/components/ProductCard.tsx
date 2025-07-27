import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ticket from '../assets/ProductCard/ticket.svg';
import icLike from '../assets/ProductCard/like.svg';
import icUnlike from '../assets/ProductCard/unlike.svg';
import { Link } from 'react-router-dom';
import RaffleProps from '../types/RaffleProps';
import { getFormatTime } from '../utils/formateTime';
import { useAuth } from '../context/AuthContext';
import useLike from '../hooks/useLike';
import { OpenLogInModal } from '../utils/OpenLogInModal';

const ProductCard: React.FC<RaffleProps> = ({
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
              src={isLiked ? icLike : icUnlike}
              alt={isLiked ? 'Liked' : 'Unliked'}
            />
          </LikeBox>
        </ImageContainer>
        <InfoContainer>
          <TitleContainer>
            <TitleBox>{name}</TitleBox>
            <ParticipantsBox>{participantNum}명 응모중</ParticipantsBox>
          </TitleContainer>

          <ContentContainer>
            <TicketBox>
              <img src={ticket} alt="ticket" /> {ticketNum}
            </TicketBox>
            {!finish && <TimeBox>{getFormatTime(timeUntilEnd)}뒤 마감</TimeBox>}
          </ContentContainer>
        </InfoContainer>
      </StyledLink>
    </Wrapper>
  );
};

export default ProductCard;

const Wrapper = styled.div`
  width: 228px;
  height: 314px;
  flex-shrink: 0;
  border-radius: 2px;
  background: #fff;
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
  width: 228px;
  height: 227px;
  border-radius: 5px;
  background-color: #f7f7f7;
  position: relative;
  margin-top: 6px;

  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`;

const RaffleClosingBox = styled.div`
  width: 134.961px;
  height: 47.585px;

  flex-shrink: 0;
  border-radius: 4px;
  border-radius: 34px;
  border: 2px solid #8f8e94;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;

  color: #8f8e94;
  text-align: center;
  font-family: 'Pretendard Variable';
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px; /* 100% */
`;

const TextBox = styled.div`
  width: 78.929px;
  height: 26px;
  flex-shrink: 0;
  border-radius: 42px;
  background: rgba(201, 8, 255, 0.2);

  position: absolute;
  top: 188px;
  right: 135.07px;
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
  width: 42px;
  height: 42px;
  flex-shrink: 0;

  position: absolute;
  top: 188px;
  right: 0px;
  cursor: pointer;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 0px 5.6px 16px 5px;
`;

const TitleContainer = styled.div`
  display: flex;
  height: 21px;
  margin-top: 14px;
  margin-bottom: 10px;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`;

const TitleBox = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: #000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px; /* 글자 수 제한 */
`;

const ParticipantsBox = styled.div`
  display: flex;
  align-items: center;

  color: #c908ff;
  text-align: right;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 18px; /* 150% */
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TicketBox = styled.div`
  display: flex;
  gap: 11px;

  color: #000;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 150%; /* 24px */
`;

const TimeBox = styled.div`
  color: #8f8e94;
  text-align: right;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%; /* 18.2px */
`;

const EndBox = styled.div`
  width: 100%;
  height: 100%;

  border-radius: 3px;
  background: rgba(193, 193, 193, 0.8);
  z-index: 1;
`;
