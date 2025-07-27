import { useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import ProductCard from '../../components/ProductCard';
import RaffleProps from '../../types/RaffleProps';
import axiosInstance from '../../apis/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { useIsSearchCompleted } from '../../store/store';
import media from '../../styles/media';

const SearchResultPage: React.FC = () => {
  const { type } = useParams<{ type?: string }>();
  const observerRef = useRef<HTMLDivElement>(null);
  const [allRaffles, setAllRaffles] = useState<RaffleProps[]>([]);
  const [raffles, setRaffles] = useState<RaffleProps[]>([]);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const isSearchCompleted = useIsSearchCompleted((v) => v.isSearchCompleted);
  const setIsCompleted = useIsSearchCompleted((v) => v.setIsSearchCompleted);

  // 모든 래플 데이터 받아오는 데이터: GET 호출은 각 검색 당 1번씩만
  const fetchProducts = async () => {
    const apiurl = isAuthenticated
      ? 'api/member/search/raffles'
      : 'api/permit/search/raffles';
    const { data } = await axiosInstance.get(apiurl, {
      params: { keyword: type },
    });
    setAllRaffles(data.result.searchedRaffles);
    setIsCompleted(!isSearchCompleted); // Zustand 상태 업데이트
    setIsLoading(false);
    // console.log("fetchProducts 결과:", data.result.searchedRaffles);
  };

  console.log('allRaffles:', allRaffles);

  // 화면 최하단 ref에 스크롤이 도달하면 16개씩 데이터를 보여준다
  const showProducts = () => {
    if (isLoading) return;
    console.log('showProducts 실행');
    console.log(allRaffles);
    const newRaffles = allRaffles.slice(page, page + 16);
    setRaffles((prev) => [...prev, ...newRaffles]);
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
  }, [raffles, allRaffles]);

  useEffect(() => {
    setAllRaffles([]);
    setRaffles([]);
    setPage(0);
    setHasMore(true);
    fetchProducts();
  }, [type]);
  useEffect(() => {
    showProducts();
  }, [allRaffles]);

  // useEffect(() => {
  //   console.log("setAllRaffles 결과: ", allRaffles)
  // }, [allRaffles]);

  return (
    <Wrapper>
      <SearchContainer>
        <KeywordBox>'{type}'</KeywordBox>
        <SearchBox>검색 결과</SearchBox>
      </SearchContainer>

      <ProductGrid>
        {(raffles ?? []).map((newRaffles) => (
          <ProductCard key={newRaffles.raffleId} {...newRaffles} />
        ))}
      </ProductGrid>

      <Observer ref={observerRef} />
    </Wrapper>
  );
};

export default SearchResultPage;

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  padding-top: 64px;
  gap: 45px;
  ${media.notLarge`
    padding:57px 0px 30px 0px;
    width:100%
  `}
`;

const SearchContainer = styled.div`
  display: inline-flex;
  padding: 0px 14px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 11px;
  border: 1px solid #8f8e94;
`;

const KeywordBox = styled.div`
  color: #c908ff;
  text-align: center;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 36.832px; /* 184.159% */
`;

const SearchBox = styled.div`
  color: #8f8e94;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 36.832px;
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
  // background-color: yellow;
`;
