import styled from 'styled-components';
import DonutChart from './DonutChart';
import NpDonutChart from './NpDonutChart';
import DonutText from './DonutText';
import { RaffleDetailProps } from '../../../types/RaffleDetail';
import useRaffleStore from '../../../store/raffleStore';
import React, { useEffect, useState } from 'react';
import BigTitle from '../../../components/BigTitle';
import media from '../../../styles/media';
import useScreenSize from '../../../styles/useScreenSize';

const Probability: React.FC<RaffleDetailProps> = (raffle) => {
  const { isApplying, isChecked } = useRaffleStore();
  const { isSmallScreen, isMediumScreen, isLargeScreen } = useScreenSize();
  useEffect(() => {}, [isApplying, isChecked]);

  return (
    <Wrapper>
      {!isLargeScreen && <BigTitle>래플 현황</BigTitle>}
      {raffle.raffleStatus === 'UNOPENED' && (
        <>
          <SmallContainer>
            오픈 대기
            <UnOpenBox>
              해당 래플은 아직 개최되지
              <br />
              않았습니다.
            </UnOpenBox>
          </SmallContainer>
          <PinkText>
            찜하기 버튼을 누르면 래플 개최 시 <br />
            이메일로 알림을 발송해드립니다.
          </PinkText>
        </>
      )}

      {raffle.raffleStatus === 'ACTIVE' && (
        <>
          {(raffle.userStatus === 'nonParticipant' ||
            raffle.userStatus === 'host') && (
            <CenteredContainer>
              <TitleBox>지금 참여하면 당첨될 확률은?</TitleBox>
              <NpDonutChart participant={raffle.applyCount} />
            </CenteredContainer>
          )}
          {raffle.userStatus === 'participant' && (
            <CenteredContainer>
              <TitleBox>지금 당신이 당첨될 확률은?</TitleBox>
              <DonutChart participant={raffle.applyCount} />
            </CenteredContainer>
          )}
          <InfoContainer>
            <ParticipantBox>
              현재 참여자 수 : {raffle.applyCount}명
            </ParticipantBox>
            <ParticipantBox>
              판매자 희망 최소 참여자 : {raffle.minUser}명
            </ParticipantBox>
          </InfoContainer>
        </>
      )}

      {raffle.raffleStatus === 'ENDED' && ( //DRAW 확인 전
        <>
          {(raffle.userStatus === 'nonParticipant' ||
            raffle.userStatus === 'host') && (
            <CenteredContainer>
              <TitleBox>누군가 당첨될 확률은?</TitleBox>
              <DonutChart participant={raffle.applyCount} />
              <InfoContainer>
                <ParticipantBox>
                  현재 참여자 수 : {raffle.applyCount}명
                </ParticipantBox>
                <ParticipantBox>
                  판매자 희망 최소 참여자 : {raffle.minUser}명
                </ParticipantBox>
              </InfoContainer>
            </CenteredContainer>
          )}
          {raffle.userStatus === 'participant' && (
            <>
              {raffle.isWinner === 'hope' && (
                <CenteredContainer>
                  <TitleBox>지금 당신이 당첨될 확률은?</TitleBox>
                  <DonutChart participant={raffle.applyCount} />
                  <InfoContainer>
                    <ParticipantBox>
                      현재 참여자 수 : {raffle.applyCount}명
                    </ParticipantBox>
                    <ParticipantBox>
                      판매자 희망 최소 참여자 : {raffle.minUser}명
                    </ParticipantBox>
                  </InfoContainer>
                </CenteredContainer>
              )}
              {(raffle.isWinner === 'yes' || raffle.isWinner === 'no') && (
                <CenteredContainer>
                  <TitleBox>해당 래플은 종료되었습니다</TitleBox>
                  <DonutText text="래플 종료" />
                </CenteredContainer>
              )}
            </>
          )}
        </>
      )}

      {raffle.raffleStatus === 'COMPLETED' && ( //완전 종료
        <>
          {(raffle.userStatus === 'nonParticipant' ||
            raffle.userStatus === 'host') && (
            <CenteredContainer>
              <TitleBox>누군가 당첨될 확률은?</TitleBox>
              <DonutChart participant={raffle.applyCount} />
              <InfoContainer>
                <ParticipantBox>
                  현재 참여자 수 : {raffle.applyCount}명
                </ParticipantBox>
                <ParticipantBox>
                  판매자 희망 최소 참여자 : {raffle.minUser}명
                </ParticipantBox>
              </InfoContainer>
            </CenteredContainer>
          )}
          {raffle.userStatus === 'participant' && (
            <CenteredContainer>
              <TitleBox>해당 래플은 종료되었습니다</TitleBox>
              <DonutText text="래플 종료" />
            </CenteredContainer>
          )}
        </>
      )}

      {raffle.raffleStatus === 'CANCELLED' && (
        <>
          {raffle.applyCount < raffle.minUser && ( //미달 취소
            <FailedContainer>
              래플 종료
              <FailedBox>
                해당 래플은 판매자 희망 최소 참여자
                <br />
                이상 모이지 않아 취소되었습니다.
                <br />
                취소된 래플에 대한 티켓은 다시
                <br />
                적립됩니다.
              </FailedBox>
            </FailedContainer>
          )}
          {raffle.applyCount >= raffle.minUser && ( //ENDED에서 배송/운송 관련으로 취소, 추후 멘트 필요.
            <SmallContainer>
              래플 종료
              <FailedBox>
                해당 래플은 당첨 포기/취소로 인해 <br />
                강제 종료 되었습니다.
              </FailedBox>
            </SmallContainer>
          )}
        </>
      )}
      {raffle.raffleStatus === 'UNFULFILLED' && (
        <FailedContainer>
          대기 상태
          <FailedBox>
            해당 래플은 판매자가 설정한 최소 참여자 수에 미치지 못해, 현재
            판매자가 당첨자 선정 여부를 결정해야 하는 대기 상태에 있습니다.
          </FailedBox>
        </FailedContainer>
      )}
    </Wrapper>
  );
};

export default Probability;

const Wrapper = styled.div`
  display: flex;
  width: 280px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

const SmallContainer = styled.div`
  width: 285px;
  height: 157px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 29px;
  box-sizing: border-box;

  border: 1px solid #8f8e94;

  color: #000;
  text-align: center;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 27px */

  ${media.medium`
    margin-top: 80px;
  `}
`;

const PinkText = styled.p`
  width: 244px;
  height: 40px;
  margin-top: 27px;

  color: #ff008c;
  text-align: center;
  font-family: 'Pretendard Variable';
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 21px */
`;

const UnOpenBox = styled.div`
  display: flex;
  width: 234px;
  height: 83px;
  flex-direction: column;
  justify-content: center;
  margin: 12px auto 26px auto;
  box-sizing: border-box;

  color: #8f8e94;
  text-align: center;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 27px */
`;

const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;

  ${media.medium`
    margin-top: 80px;
  `}
`;

const TitleBox = styled.div`
  display: flex;
  width: 257px;
  height: 29px;
  margin-bottom: 32px;
  flex-direction: column;
  justify-content: center;

  color: #8d8d8d;
  text-align: center;
  font-family: Pretendard;
  font-size: 22px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 31.6px;
`;

const ParticipantBox = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
`;

const FailedContainer = styled.div`
  width: 285px;
  height: 195px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 23px 0 30px 0;
  box-sizing: border-box;

  border: 1px solid #8f8e94;

  color: #000;
  text-align: center;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 27px */

  ${media.medium`
    margin-top: 80px;
  `}
`;

const FailedBox = styled.div`
  width: 234px;
  height: 96px;
  margin: 19px auto 0 auto;
  color: #8f8e94;
  text-align: center;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
`;
