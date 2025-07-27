import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import ProductCard from '../../components/ProductCard';
import { useNavigate } from 'react-router-dom';
import moreList from '../../assets/homePage/moreList.svg';
import axiosInstance from '../../apis/axiosInstance';
import RaffleProps from '../../types/RaffleProps';
import { useAuth } from '../../context/AuthContext';
import media from '../../styles/media';

const RaffleListPage: React.FC = () => {
  const navigate = useNavigate();
  const { type } = useParams<{ type?: string }>();
  const [title, setTitle] = useState<string>('래플 리스트');
  const observerRef = useRef<HTMLDivElement>(null);
  const [raffles, setRaffles] = useState<RaffleProps[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, logout } = useAuth();
  const [allRaffles, setAllRaffles] = useState<RaffleProps[]>([]);

  console.log('???', hasMore);
  const fetchProducts = async () => {
    const apiurl = isAuthenticated
      ? `/api/member/home/${type}`
      : `/api/permit/home/${type}`;
    const { data } = await axiosInstance.get(apiurl);
    setAllRaffles(data.result.raffles);
    setIsLoading(false);
    // setFirstRender(true);
    // console.log("fetchProducts 결과:", data.result.raffles);
  };

  // console.log("allRaffles:", allRaffles);

  // 화면 최하단 ref에 스크롤이 도달하면 16개씩 데이터를 보여준다
  const showProducts = () => {
    if (isLoading) return;
    console.log('showProducts 실행');
    // console.log(allRaffles);
    const newRaffles = allRaffles.slice(page, page + 16);
    setRaffles((prev) => [...prev, ...newRaffles]);
    console.log('allRaffles.length?', allRaffles.length);
    allRaffles.length > page + 16 ? setPage(page + 16) : setHasMore(false);
  };
  useEffect(() => {
    console.log('raffles 변경 감지', raffles);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) showProducts();
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
      },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [raffles]);

  useEffect(() => {
    setRaffles([]);
    setPage(0);
    setHasMore(true);
    fetchProducts();
  }, []);
  useEffect(() => {
    showProducts();
  }, [allRaffles]);

  useEffect(() => {
    // 페이지 제목 설정
    switch (type) {
      case 'approaching':
        setTitle('마감임박 래플');
        break;
      case 'likes':
        setTitle('내가 찜한 래플');
        break;
      case 'following':
        setTitle('팔로우한 상점의 래플');
        break;
      case 'more':
        setTitle('래플 둘러보기');
        break;
      case 'category':
        setTitle('카테고리별 상품');
        break;
      default:
        setTitle('래플 둘러보기');
    }
  }, [type]);
  return (
    <Wrapper>
      <LookAroundContainer>
        <LookAroundBox>{title}</LookAroundBox>
        {title === 'following' && (
          <MoreListBox onClick={() => navigate('/')}>
            팔로우하는 상점 목록
            <img src={moreList} alt="moreList" />
          </MoreListBox>
        )}
      </LookAroundContainer>

      <Horizon />

      <ProductGrid>
        {(raffles ?? []).map((raffle) => (
          <ProductCard key={raffle.raffleId} {...raffle} />
        ))}
      </ProductGrid>

      <Observer ref={observerRef} />
    </Wrapper>
  );
};

export default RaffleListPage;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 63px;
  ${media.notLarge`
    padding:57px 0px 30px 0px;
    width:100%
  `}
`;

const LookAroundContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-width: 1080px;
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
  min-width: 1080px;
`;

const MoreListBox = styled.a`
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
  width: 1080px;
  border-top: 1px solid #8f8e94;
  margin-top: 42px;
  margin-bottom: 46px;

  ${media.medium`
    width: 744px;
  `}
  ${media.small`
    width: 390px;
  `}
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

const Observer = styled.div`
  width: 100%;
  height: 50px;
`;
