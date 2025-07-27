import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import AdBanner from './components/AdBanner';
import HomeSection from './components/HomeSection';
import clockIcon from '../../assets/homePage/clock.svg';
import likeIcon from '../../assets/homePage/like.svg';
import followIcon from '../../assets/homePage/follow.svg';
import moreList from '../../assets/homePage/moreList.svg';
import ProductCard from '../../components/ProductCard';
import { useNavigate } from 'react-router-dom';
import media from '../../styles/media';
import { Link } from 'react-router-dom';
import RaffleProps from '../../types/RaffleProps';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../apis/axiosInstance';

interface HomeData {
  approaching: RaffleProps[];
  myLikeRaffles: RaffleProps[] | null;
  myFollowRaffles: RaffleProps[] | null;
  raffles: RaffleProps[] | null;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const { data } = await axiosInstance.get(
          isAuthenticated ? '/api/member/home' : '/api/permit/home',
        );
        console.log('API Response:', data.result);
        setHomeData(data.result);
      } catch (error) {
        console.error('데이터 가져오기 실패', error);
        const { data } = await axiosInstance.get('/api/permit/home');
        setHomeData(data.result);
      }
    };

    fetchHomeData();
  }, [isAuthenticated]);

  if (!homeData) return <div>Loading...</div>;

  return (
    <>
      <AdBanner />
      <Wrapper>
        {homeData.approaching && homeData.approaching.length > 0 ? (
          <HomeSection
            title="마감임박"
            icon={clockIcon}
            apiKey="approaching"
            moreLink="raffles/list/approaching"
            products={homeData.approaching}
          />
        ) : null}
        {homeData.myLikeRaffles && homeData.myLikeRaffles.length > 0 ? (
          <HomeSection
            title="내가 찜한 래플"
            icon={likeIcon}
            apiKey="myLikeRaffles"
            moreLink="raffles/list/likes"
            products={homeData.myLikeRaffles || []}
          />
        ) : null}
        {homeData.myFollowRaffles && homeData.myFollowRaffles.length > 0 ? (
          <HomeSection
            title="내가 팔로우한 상점"
            icon={followIcon}
            apiKey="myFollowRaffles"
            moreLink="raffles/list/following"
            products={homeData.myFollowRaffles || []}
          />
        ) : null}
        <LookAroundContainer>
          <LookAroundBox>래플 둘러보기</LookAroundBox>
          <Link to={'raffles/list/more'}>
            <MoreListBox>
              더보기
              <img src={moreList} alt="moreList" />
            </MoreListBox>
          </Link>
        </LookAroundContainer>

        <Horizon />

        <ProductGrid>
          {(homeData.raffles ?? []).map((product) => (
            <ProductCard key={product.raffleId} {...product} />
          ))}
        </ProductGrid>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1080px;
  margin: 0 auto;
  align-items: center;
  ${media.medium`
  width:630px;
  `}
`;

const LookAroundContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const LookAroundBox = styled.p`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  color: #000;
  text-align: center;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const MoreListBox = styled.div`
  width: 250px;
  height: 34px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
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

const Horizon = styled.hr`
  width: 100%;
  border-top: 1px solid #8f8e94;
  margin-top: 42px;
  margin-bottom: 46px;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  place-items: center;
  gap: 56px;
  width: 100%;

  ${media.medium`
    grid-template-columns: repeat(3, 1fr);
    gap:11px;
  `}
  ${media.small`
    grid-template-columns: repeat(1, 1fr);
    gap:0px;
  `}
`;

export default HomePage;
