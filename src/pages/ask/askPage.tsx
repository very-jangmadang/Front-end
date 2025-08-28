import React, { useEffect, useState } from 'react';
import BigTitle from '../../components/BigTitle';
import styled from 'styled-components';
import { useLocation, useParams } from 'react-router-dom';
import ImgSlider from '../raffleDetail/components/ImgSlider';
import icTicket from '../../assets/raffleDetail/icon-ticket.svg';
import NotAnswered from './components/NotAnswered';
import Answered from './components/Answered';
import WriteAsk from './components/WriteAsk';
import media from '../../styles/media';
import axiosInstance from '../../apis/axiosInstance';

interface IReplay {
  timestamp: string;
  content: string;
  title: string;
}

interface IAnswerItem {
  nickname: string;
  inquiryContent: string;
  timestamp: string;
  status: string;
  inquiryId: number;
  inquiryTitle: string;
  comments: IReplay[];
}

const NOT_ANSWERED = 'NOT_ANSWERED';
const ANSWERED = 'ANSWERED';
const ASK = 'ASK';

const AskPage = () => {
  const [menu, setMenu] = useState(NOT_ANSWERED);
  const [answered, setAnswered] = useState<IAnswerItem[]>([]);
  const [notAnswered, setNotAnswered] = useState<IAnswerItem[]>([]);
  const { state } = useLocation();
  const { type } = useParams();
  
  // state가 없거나 raffle이 없는 경우 처리
  if (!state || !state.raffle) {
    console.error('❌ state 또는 raffle 데이터가 없습니다:', state);
    return (
      <Container>
        <BigTitle>문의 게시판</BigTitle>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>래플 정보를 불러올 수 없습니다.</p>
          <button onClick={() => window.history.back()}>뒤로 가기</button>
        </div>
      </Container>
    );
  }
  
  const sRaffle = state.raffle;
  console.log('✅ raffle 데이터:', sRaffle);
  const formatDate = (isoString: string) =>
    new Date(isoString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

  const GetInquiry = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/permit/inquiry/raffles/${type}`,
      );

      console.log(response);

      const answeredList = response.data.result.filter(
        (item: IAnswerItem) => item.status === ANSWERED,
      );
      const notAnsweredList = response.data.result.filter(
        (item: IAnswerItem) => item.status === NOT_ANSWERED,
      );

      setAnswered(answeredList);
      setNotAnswered(notAnsweredList);

      console.log('✅ 답변 완료된 목록:', answeredList);
      console.log('❌ 답변 대기 목록:', notAnsweredList);
    } catch (error) {
      console.log('문의 답변 가져오기 실패', error);
    }
  };

  useEffect(() => {
    if (type) {
      GetInquiry();
    }
  }, [type]);

  return (
    <Container>
      <BigTitle>문의 게시판</BigTitle>
      <TopLayout>
        <ImgSlider
          images={sRaffle.imageUrls}
          name={sRaffle.name}
          onImageClick={handleImageClick}
        >
          {(sRaffle.raffleStatus === 'UNFULFILLED' ||
            sRaffle.raffleStatus === 'ENDED' ||
            sRaffle.raffleStatus === 'CANCELLED' ||
            sRaffle.raffleStatus === 'COMPLETED') && (
            <RaffleClosingBox>응모 마감</RaffleClosingBox>
          )}
        </ImgSlider>
        {media.small && <ItemTitleBox>{sRaffle.name}</ItemTitleBox>}
        {!media.small && (
          <DetailLayout>
            <ItemTitleBox>{sRaffle.name}</ItemTitleBox>
            <ViewBox>
              조회 {sRaffle.view} · 찜 {sRaffle.likeCount}
            </ViewBox>
            <TicketBox>
              <img src={icTicket} alt="ticket" width={34.61} height={22.023} />
              {sRaffle.ticketNum}
            </TicketBox>
            <DetailContainer>
              <TitleBox>카테고리</TitleBox>
              <DescriptionBox>{sRaffle.category}</DescriptionBox>
            </DetailContainer>
            <DetailContainer>
              <TitleBox>응모오픈</TitleBox>
              <DescriptionBox>{formatDate(sRaffle.startAt)}</DescriptionBox>
            </DetailContainer>
            <DetailContainer className="last">
              <TitleBox>응모마감</TitleBox>
              <DescriptionBox>{formatDate(sRaffle.endAt)}</DescriptionBox>
              {(sRaffle.raffleStatus === 'UNFULFILLED' ||
                sRaffle.raffleStatus === 'ENDED' ||
                sRaffle.raffleStatus === 'CANCELLED' ||
                sRaffle.raffleStatus === 'COMPLETED') && (
                <TextBox>응모마감</TextBox>
              )}
            </DetailContainer>
          </DetailLayout>
        )}
      </TopLayout>
      <AskLayout>
        <MenuTab>
          <Menu
            onClick={() => setMenu(NOT_ANSWERED)}
            $myMenu={NOT_ANSWERED}
            $menu={menu}
          >
            답변 미작성
          </Menu>
          <Menu
            onClick={() => setMenu(ANSWERED)}
            $myMenu={ANSWERED}
            $menu={menu}
          >
            답변 작성 완료
          </Menu>
          <Menu onClick={() => setMenu(ASK)} $myMenu={ASK} $menu={menu}>
            문의하기
          </Menu>
        </MenuTab>
        {menu === NOT_ANSWERED ? (
          <NotAnswered list={notAnswered} />
        ) : menu === ANSWERED ? (
          <Answered list={answered} />
        ) : (
          <WriteAsk type={type} />
        )}
      </AskLayout>
    </Container>
  );
};

export default AskPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: safe center;
  margin-top: 64px;
  ${media.small`
    margin-top: 45px;
  `}
`;

const TopLayout = styled.div`
  // width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding-top: 54px;
  // padding: 50px 109px 51px 67px;
  box-sizing: border-box;
  gap: 99.42px;

  ${media.medium`
    gap: 25px;
  `}
  ${media.small`
    flex-direction: column;
    align-items: center;
    padding-top: 25px;
  `}
`;

const RaffleClosingBox = styled.div`
  width: 143.316px;
  height: 47.272px;
  transform: rotate(0.421deg);

  flex-shrink: 0;
  border-radius: 4px;
  border: 2px solid #c908ff;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;

  color: #c908ff;
  text-align: center;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 18px;
`;

const DetailLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ItemTitleBox = styled.p`
  display: flex;
  width: 209px;
  height: 29px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  margin: 23px 0 15px;

  color: #000;
  font-family: Pretendard;
  font-size: 22px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%; /* 33px */
  ${media.medium`
    margin: 8px 0 15px;
  `}
  ${media.small`
    width: 100%;
    text-align: center;
    font-size: 20px;
  `}
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
  align-items: center;
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

  &.last {
    padding-bottom: 0;
  }
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
  max-width: 269px;
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

const AskLayout = styled.div`
  width: 918px;
  box-sizing: border-box;
  margin-top: 102px;

  ${media.medium`
    width: 532px;
    heigt: 47px;
    margin-top: 80px;
  `}

  ${media.small`
    width: 342px;
    margin-top: 45px;
  `}
`;

const MenuTab = styled.div`
  display: flex;
  margin-bottom: 40px;
  ${media.small`
    margin-bottom: 25px;
  `}
`;
const Menu = styled.div<{ $myMenu: string; $menu: string }>`
  flex: 1;
  text-align: center;
  padding-bottom: 25px;
  box-sizing: border-box;

  text-align: center;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 17.308px; /* 86.538% */
  letter-spacing: -0.159px;

  &:hover {
    cursor: pointer;
  }

  ${(props) =>
    props.$myMenu === props.$menu
      ? `color: #C908FF;
    border-bottom: 3px solid #C908FF;`
      : `color: #C1C1C1;
    border-bottom: 3px solid #C1C1C1;`};
`;
