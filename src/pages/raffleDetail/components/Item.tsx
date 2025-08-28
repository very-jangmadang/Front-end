import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import BigTitle from '../../../components/BigTitle';
import icTicket from '../../../assets/raffleDetail/icon-ticket.svg';
import icLike from '../../../assets/raffleDetail/icon-like.svg';
import icUnlike from '../../../assets/raffleDetail/icon-unlike.svg';
import ImgSlider from './ImgSlider';
import ApplyModal from './modals/ApplyModal';
import { RaffleDetailProps } from '../../../types/RaffleDetail';
import axiosInstance from '../../../apis/axiosInstance';
import { useParams, useLocation } from 'react-router-dom';
import RandomModal from './modals/RandomModal';
import { useModalContext } from '../../../components/Modal/context/ModalContext';
import { useAuth } from '../../../context/AuthContext';
import { OpenLogInModal } from '../../../utils/OpenLogInModal';
import { postLike, deleteLike } from '../../../services/likeService';
import DeleteModal from './modals/DeleteModal';
import media from '../../../styles/media';
import useScreenSize from '../../../styles/useScreenSize';

const Item: React.FC<RaffleDetailProps> = ({ ...raffle }) => {
  const [isLiked, setIsLiked] = useState<boolean>(raffle.likeStatus);
  const [likeCount, setLikeCount] = useState<number>(raffle.likeCount);
  const navigate = useNavigate();
  const { type } = useParams<{ type?: string }>();
  const raffleId = type ? parseInt(type, 10) : 0;
  const { isAuthenticated, logout } = useAuth();
  const { openModal } = useModalContext();
  const handleOpenModal = OpenLogInModal();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const { isSmallScreen, isMediumScreen, isLargeScreen } = useScreenSize();

  useEffect(() => {
    setIsLiked(raffle.likeStatus ?? false);
    setLikeCount(raffle.likeCount ?? 0);
  }, [raffle.likeStatus, raffle.likeCount]);

  const toggleLike = async () => {
    if (raffle.likeStatus === undefined) {
      console.log('원래 좋아요:', isLiked);
    }

    if (isLiked) {
      await deleteLike(raffleId);
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      await postLike(raffleId);
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  const handleImageClick = (index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  const handleApply = async () => {
    openModal(({ onClose }) => (
      <ApplyModal
        onClose={onClose}
        name={raffle.name}
        ticket={raffle.ticketNum}
        image={raffle.imageUrls[0]}
        resultTime={raffle.endAt}
      />
    ));
  };

  const handleWinner = async () => {
    const { data } = await axiosInstance.get(
      `/api/member/raffles/${raffleId}/draw`,
    );
    const drawData = data.result;
    console.log('draw data:', drawData);
    openModal(({ onClose }) => (
      <RandomModal
        onClose={onClose}
        image={raffle.imageUrls[0]}
        {...drawData}
      />
    ));
  };

  const handleDelete = async () => {
    openModal(({ onClose }) => (
      <DeleteModal onClose={onClose} raffleId={raffleId} />
    ));
  };

  const formatDate = (isoString: string) =>
    new Date(isoString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

  const ActionArea = (
    <>
      <ButtonContainer>
        {/*래플 오픈 전*/}
        {raffle.raffleStatus === 'UNOPENED' && (
          <GrayButton>응모 오픈 전</GrayButton>
        )}

        {/*래플 응모 중*/}
        {raffle.raffleStatus === 'ACTIVE' && (
          <>
            {raffle.userStatus === 'host' && <GrayButton>래플 결과</GrayButton>}
            {raffle.userStatus === 'nonParticipant' && (
              <PurpleButton
                onClick={() => {
                  if (isAuthenticated) {
                    handleApply();
                  } else {
                    handleOpenModal();
                  }
                }}
              >
                응모하기
              </PurpleButton>
            )}
            {raffle.userStatus === 'participant' && (
              <LightPurpleButton>응모 완료</LightPurpleButton>
            )}
          </>
        )}

        {/*래플 응모 마감-개최자*/}
        {raffle.userStatus === 'host' && (
          <>
            {(raffle.raffleStatus === 'UNFULFILLED' ||
              raffle.raffleStatus === 'ENDED') && (
              <PinkButton
                onClick={() =>
                  navigate('/host-result', {
                    state: {
                      deliveryId: raffle.deliveryId,
                      status: raffle.raffleStatus,
                      raffleId: raffleId,
                    },
                  })
                }
              >
                래플 결과
              </PinkButton>
            )}
            {(raffle.raffleStatus === 'COMPLETED' ||
              raffle.raffleStatus === 'CANCELLED') && (
              <GrayButton>래플 종료</GrayButton>
            )}
          </>
        )}
        {/*래플 응모 마감-미참가자*/}
        {raffle.userStatus === 'nonParticipant' &&
          (raffle.raffleStatus === 'UNFULFILLED' ||
            raffle.raffleStatus === 'ENDED' ||
            raffle.raffleStatus === 'CANCELLED' ||
            raffle.raffleStatus === 'COMPLETED') && (
            <GrayButton>래플 종료</GrayButton>
          )}

        {/*래플 응모 마감-참가자*/}
        {raffle.userStatus === 'participant' && (
          <>
            {raffle.raffleStatus === 'ENDED' && (
              <>
                {raffle.isWinner === 'yes' && (
                  <PurpleButton onClick={handleWinner}>DRAW</PurpleButton>
                )}
                {raffle.isWinner === 'no' && <GrayButton>래플 종료</GrayButton>}
                {raffle.isWinner === 'hope' && (
                  <PurpleButton onClick={handleWinner}>DRAW</PurpleButton>
                )}
              </>
            )}
            {(raffle.raffleStatus === 'UNFULFILLED' ||
              raffle.raffleStatus === 'CANCELLED') && (
              <GrayButton>래플 종료</GrayButton>
            )}
            {raffle.raffleStatus === 'COMPLETED' && (
              <>
                {raffle.isWinner === 'yes' && (
                  <PurpleButton
                    onClick={() =>
                      navigate('/review', {
                        state: { raffleId: raffleId },
                      })
                    }
                  >
                    후기남기기
                  </PurpleButton>
                )}
                {raffle.isWinner === 'no' && <GrayButton>래플 종료</GrayButton>}
                {raffle.isWinner === 'hope' && (
                  <PurpleButton onClick={handleWinner}>DRAW</PurpleButton>
                )}
              </>
            )}
          </>
        )}
        <LikeBox
          onClick={() => {
            if (isAuthenticated) {
              toggleLike();
            } else {
              handleOpenModal();
            }
          }}
        >
          <img
            src={isLiked ? icLike : icUnlike}
            alt={isLiked ? 'Liked' : 'Unliked'}
          />
          찜하기
        </LikeBox>
      </ButtonContainer>
      <WarningBox>
        판매자 희망 최소 참여자 이상 모이지 않으면 당첨자 없이 취소될 수
        있습니다. 취소된 래플에 대한 티켓은 다시 적립됩니다.
      </WarningBox>
    </>
  );

  return (
    <Container>
      <BigTitle>
        {raffle.name}
        {raffle.userStatus === 'host' && (
          <DeleteBox onClick={handleDelete}>래플 삭제</DeleteBox>
        )}
      </BigTitle>
      <TopLayout>
        <ImageLayout>
          <ImgSlider
            images={raffle.imageUrls}
            name={raffle.name}
            onImageClick={handleImageClick}
          >
            {(raffle.raffleStatus === 'UNFULFILLED' ||
              raffle.raffleStatus === 'ENDED' ||
              raffle.raffleStatus === 'CANCELLED' ||
              raffle.raffleStatus === 'COMPLETED') && (
              <>
                <EndBox />
                <RaffleClosingBox>응모 마감</RaffleClosingBox>
              </>
            )}
            {raffle.raffleStatus === 'UNOPENED' && (
              <>
                <EndBox />
                <RaffleClosingBox>응모 오픈 전</RaffleClosingBox>
              </>
            )}
          </ImgSlider>
          {isMediumScreen && ActionArea}
        </ImageLayout>
        <DetailLayout>
          <ItemTitleBox>{raffle.name}</ItemTitleBox>
          <ViewBox>
            조회 {raffle.view} · 찜 {likeCount}
          </ViewBox>
          <TicketBox>
            <img src={icTicket} alt="ticket" />
            {raffle.ticketNum}
          </TicketBox>
          <DetailContainer>
            <TitleBox>카테고리</TitleBox>
            <DescriptionBox>{raffle.category}</DescriptionBox>
          </DetailContainer>
          <DetailContainer>
            <TitleBox>응모오픈</TitleBox>
            <DescriptionBox>{formatDate(raffle.startAt)}</DescriptionBox>
          </DetailContainer>

          <DetailContainer>
            <TitleBox>응모마감</TitleBox>
            <DescriptionBox>{formatDate(raffle.endAt)}</DescriptionBox>
            {(raffle.raffleStatus === 'UNFULFILLED' ||
              raffle.raffleStatus === 'ENDED' ||
              raffle.raffleStatus === 'CANCELLED' ||
              raffle.raffleStatus === 'COMPLETED') && (
              <TextBox>응모마감</TextBox>
            )}
          </DetailContainer>
          <DetailContainer>
            <TitleBox>정가</TitleBox>
            <DescriptionBox>{raffle.minTicket}</DescriptionBox>
          </DetailContainer>
          {isLargeScreen && ActionArea}
        </DetailLayout>
      </TopLayout>
      <BottomLayout>
        <TitleBox2>상품 설명</TitleBox2>
        <DescriptionBox2>{raffle.description}</DescriptionBox2>
      </BottomLayout>
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <ImgSlider
              images={raffle.imageUrls}
              name={raffle.name}
              initialIndex={modalImageIndex}
              isModal
            />
          </div>
        </div>
      )}
    </Container>
  );
};

export default Item;

const Container = styled.div``;

const TopLayout = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 50px 109px 51px 67px;
  box-sizing: border-box;
  gap: 99.42px;

  ${media.medium`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left:80px;
  box-sizing: border-box;
          padding-bottom : 30px;
  gap : 0px;
      `}
`;

const RaffleClosingBox = styled.div`
  width: 134.961px;
  height: 47.585px;
  transform: rotate(0.421deg);

  border-radius: 34px;
  border: 2px solid #8f8e94;

  position: absolute;
  z-index: 10;
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

const ImageLayout = styled.div`
  margin: 0 auto;
`;

const DetailLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  ${media.medium`
          margin-top : 57px;
      `}
`;

const ItemTitleBox = styled.p`
  display: flex;
  width: 100%;
  height: 29px;
  flex-direction: row;
  justify-content: space-between;
  flex-shrink: 0;
  margin-bottom: 15px;

  color: #000;
  font-family: Pretendard;
  font-size: 22px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%; /* 33px */
`;

const DeleteBox = styled.div`
  display: flex;
  height: 26px;
  padding: 0px 14px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  position: absolute;
  right: 0;

  flex-shrink: 0;
  border-radius: 11px;
  border: 1px solid #8f8e94;

  color: var(--Main-Grey, #8f8e94);
  text-align: center;
  font-family: 'Pretendard Variable';
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 36.832px; /* 230.199% */
`;

const ViewBox = styled.div`
  display: flex;
  width: 110px;
  height: 18px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;

  color: #8f8e94;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 24px */
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-skip-ink: auto;
  text-decoration-thickness: auto;
  text-underline-offset: auto;
  text-underline-position: from-font;
`;

const TicketBox = styled.div`
  display: flex;
  gap: 8.31px;
  padding-top: 40px;
  padding-bottom: 38.98px;
  color: #000;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 150%; /* 30px */
`;
const DetailContainer = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;

  gap: 50px;
  padding-bottom: 26px;
`;

const TitleBox = styled.div`
  display: inline-block;
  min-width: 59px;

  color: #8f8e94;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 24px */
`;
const DescriptionBox = styled.div`
  display: flex;
  width: 269px;
  height: 19px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;

  color: #000;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 30px */
`;

const TextBox = styled.div`
  width: 78.929px;
  height: 26px;
  flex-shrink: 0;
  border-radius: 42px;
  background: rgba(201, 8, 255, 0.2);

  position: absolute;
  left: 362px;
  display: flex;
  justify-content: center;
  align-items: center;

  color: #c908ff;
  text-align: center;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 18px; /* 150% */
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 35px;
  padding-bottom: 19px;

  ${media.medium`
          margin-top : 66px;
          gap: 35px;
  padding-bottom: 0px;
      `}
`;

const PurpleButton = styled.button`
  all: unset;
  display: block;
  width: 344px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 7px;
  background: #c908ff;

  color: #fff;
  text-align: center;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px; /* 90% */
  letter-spacing: -0.165px;

  cursor: pointer;
`;

const LightPurpleButton = styled.button`
  width: 344px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 7px;
  border: 1px solid #c908ff;
  background: rgba(201, 8, 255, 0.2);

  color: #c908ff;
  text-align: center;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px; /* 90% */
  letter-spacing: -0.165px;
`;

const GrayButton = styled.button`
  width: 344px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 7px;
  border: 1px solid #8f8e94;
  background: #e4e4e4;

  color: #8f8e94;
  text-align: center;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px; /* 90% */
  letter-spacing: -0.165px;
`;

const PinkButton = styled.button`
  width: 344px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 7px;
  border: 1px solid #ff008c;
  background: #ff008c;

  color: #fff;
  text-align: center;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px; /* 90% */
  letter-spacing: -0.165px;

  cursor: pointer;
`;

const LikeBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  width: 45px;

  color: #8f8e94;
  text-align: center;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 21px */

  img {
    width: 28px;
    height: 29px;
  }

  cursor: pointer;
`;

const WarningBox = styled.div`
  width: 343px;
  height: 54px;
  flex-shrink: 0;
  margin: 0;

  color: #8f8e94;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 18px */

  ${media.medium`
        height: 36px;
      `}
`;

const BottomLayout = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 0 109px 30px 67px;
  box-sizing: border-box;
  gap: 45px;

  ${media.medium`
  padding: 0 0 10px 80px;
           gap: 15px;
      `}
`;

const TitleBox2 = styled.div`
  display: inline-block;
  min-width: 94px;
  color: #8f8e94;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 150%; /* 27px */
`;

const DescriptionBox2 = styled.div`
  width: 749px;
  height: 132px;

  ${media.medium`
    width: 485px;
    height: 132px;`}

  color: #000;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 30px */
`;

const EndBox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  border-radius: 5px;
  background: rgba(193, 193, 193, 0.8);
  z-index: 9;
`;
