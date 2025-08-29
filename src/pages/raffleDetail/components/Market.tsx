import styled from 'styled-components';
import moreList from '../../../assets/homePage/moreList.svg';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import icLevel from '../../../assets/raffleDetail/icon-level.svg';
import { RaffleDetailProps } from '../../../types/RaffleDetail';
import axiosInstance from '../../../apis/axiosInstance';
import { useAuth } from '../../../context/AuthContext';
import { useModalContext } from '../../../components/Modal/context/ModalContext';
import { OpenLogInModal } from '../../../utils/OpenLogInModal';
import FollowFailModal from './modals/FollowFailModal';
import media from '../../../styles/media';

interface MarketProps extends RaffleDetailProps {
  type?: string;
  setFollowingState: React.Dispatch<React.SetStateAction<boolean>>;
}

const Market: React.FC<MarketProps> = ({
  type,
  setFollowingState,
  ...raffle
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const handleOpenModal = OpenLogInModal();

  const handleFollow = async () => {
    if (raffle.followStatus) {
      try {
        const { data } = await axiosInstance.delete(
          '/api/member/follow/cancel',
          { params: { storeId: raffle.storeId } },
        );
        console.log('상점 언팔로우 : ', data.message);
        setFollowingState((prev) => !prev);
      } catch (error) {
        console.error('에러 : 팔로우 상태가 아님', error);
      }
    } else {
      try {
        const { data } = await axiosInstance.post(
          '/api/member/follow/',
          {},
          { params: { storeId: raffle.storeId } },
        );
        console.log('상점 팔로우 : ', data.message);
        setFollowingState((prev) => !prev);
      } catch (error) {
        console.error('에러 : 이미 팔로잉 중', error);
      }
    }
  };

  const ColoredAskButton = styled(AskButton)<{ isActive: boolean }>`
    background: ${({ isActive }) => (isActive ? '#ffffff' : '#e4e4e4')};
  `;

  return (
    <Wrapper>
      <BigTitleBox>
        <TitleIcon />
        <div>상점 정보</div>
        {raffle.userStatus === 'host' && (
          <MoreListBox onClick={() => navigate(`/mypage`)}>
            프로필 보기
            <img src={moreList} alt="moreList" />
          </MoreListBox>
        )}
        {(raffle.userStatus === 'participant' ||
          raffle.userStatus === 'nonParticipant') && (
          <MoreListBox onClick={() => navigate(`/user/${raffle.storeId}`)}>
            프로필 보기
            <img src={moreList} alt="moreList" />
          </MoreListBox>
        )}
      </BigTitleBox>
      <MarketLayout>
        <ImageBox imageUrl={raffle.storeImageUrl} />
        <MarketContainer>
          <NicknameBox>
            <img src={icLevel} alt="레벨" />
            {raffle.nickname}
          </NicknameBox>
          <MarketInfo>
            <KeyBox>팔로워</KeyBox>
            <ValueBox>
              {raffle.followCount <= -1 ? '비공개' : raffle.followCount}
            </ValueBox>
            <VerticalDivider />
            <KeyBox>후기 </KeyBox>
            <ValueBox>{raffle.reviewCount}</ValueBox>
          </MarketInfo>
        </MarketContainer>
      </MarketLayout>
      <ButtonLayout>
        {raffle.userStatus === 'host' && (
          <FollowFailButton>팔로우하기</FollowFailButton>
        )}
        {raffle.userStatus !== 'host' && (
          <FollowButton
            onClick={() => {
              if (isAuthenticated) {
                handleFollow();
              } else {
                handleOpenModal(); // 로그인 모달 띄우기
              }
            }}
          >
            {raffle.followStatus ? '팔로잉 취소' : '팔로우하기'}
          </FollowButton>
        )}
        <ReviewButton>상점 후기</ReviewButton>
      </ButtonLayout>
             <ColoredAskButton
         isActive={raffle.raffleStatus === 'ACTIVE'}
         onClick={() => {
           console.log('문의하기 버튼 클릭됨');
           console.log('type 값:', type);
           console.log('raffle 데이터:', raffle);
           
           if (!type) {
             console.error('❌ type 값이 없습니다');
             alert('래플 정보를 불러올 수 없습니다.');
             return;
           }
           
           try {
             const targetPath = `/ask/${type}`;
             console.log('이동할 경로:', targetPath);
             navigate(targetPath, { state: { raffle } });
             console.log('✅ navigate 함수 실행 완료');
           } catch (error) {
             console.error('❌ navigate 오류:', error);
             alert('페이지 이동 중 오류가 발생했습니다.');
           }
         }}
       >
         상품 문의
       </ColoredAskButton>
    </Wrapper>
  );
};

export default Market;

const Wrapper = styled.div`
  width: 666px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  ${media.medium`
    margin-top: 84px;
  `}
`;

const BigTitleBox = styled.div`
  width: 100%;
  height: 53px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid black;
  margin-bottom: 56px;
  color: #000;
  font-family: Pretendard;
  font-size: 22px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;

  ${media.medium`
      width: 675px;
      margin: 0 14px 56px 14px;
  `}
`;

const TitleIcon = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  background-color: #c908ff;
  border-radius: 50%;
  margin-right: 52px;
`;

const MoreListBox = styled.a`
  width: 220px;
  height: 34px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-left: auto;
  display: flex;
  color: #8f8e94;
  text-align: center;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 36.832px; /* 230.199% */
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-skip-ink: auto;
  text-decoration-thickness: auto;
  text-underline-offset: auto;
  text-underline-position: from-font;

  img {
    width: 10px;
    height: 17px;
    margin-left: 35px;
  }

  cursor: pointer;
`;

const MarketLayout = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ImageBox = styled.div<{ imageUrl: string }>`
  width: 78px;
  height: 78px;
  background-color: #d9d9d9;
  border: 1px solid #8f8e94;
  margin-right: 30px;
  border-radius: 50%;

  background-image: url(${(props) => props.imageUrl});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const MarketContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 211px;
  align-items: flex-start;
`;

const NicknameBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 21.07px;
  color: #000;
  text-align: center;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 150%; /* 30px */
`;

const MarketInfo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 230px;
`;

const KeyBox = styled.div`
  margin-right: 5px;
  color: #000;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 27px */
`;

const ValueBox = styled.div`
  color: #c908ff;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
`;

const VerticalDivider = styled.div`
  width: 1px;
  height: 27px;
  background: #000000;
  margin: 0 35px;
`;

const ButtonLayout = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 35px;
  margin: 30px 0 71.5px 0;
`;

const FollowFailButton = styled.button`
  all: unset;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 162px;
  height: 38.5px;
  border-radius: 9px;
  border: 1px solid #8f8e94;
  background: #e4e4e4;

  color: #8f8e94;
  text-align: center;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 24px */

  cursor: pointer;
`;

const FollowButton = styled.button`
  all: unset;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 162px;
  height: 38.5px;
  border-radius: 9px;
  border: 1px solid #c908ff;
  background: #c908ff;

  color: #fff;
  text-align: center;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 24px */

  cursor: pointer;
`;

const ReviewButton = styled.button`
  all: unset;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 162px;
  height: 38.5px;
  border-radius: 9px;
  border: 1px solid #8f8e94;
  background: white;

  color: #000;
  text-align: center;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 24px */

  cursor: pointer;
`;
const AskButton = styled.button`
  all: unset;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 221px;
  height: 34px;
  border-radius: 9px;
  border: 1px solid #8f8e94;
  background: #e4e4e4;

  color: black;
  text-align: center;
  font-family: Pretendard;
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 22.5px */

  cursor: pointer;
`;

