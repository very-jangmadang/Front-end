import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import ProductCard from '../../components/ProductCard';
import RaffleProps from '../../types/RaffleProps';
import axiosInstance from '../../apis/axiosInstance';
import { useNavigate } from 'react-router-dom';
import media from '../../styles/media';

const SearchResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { type } = useParams<{ type?: string }>();
  const [title, setTitle] = useState<string>('카테고리');
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [raffles, setRaffles] = useState<RaffleProps[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const categoryMap: { [key: string]: string } = {
    women: '여성의류',
    men: '남성의류',
    shoes: '신발',
    accessories: '악세서리',
    digital: '디지털',
    appliances: '가전제품',
    sports: '스포츠/레저',
    vehicle: '차량/오토바이',
    md: '굿즈',
    art: '예술/희귀/수집품',
    music: '음반/악기',
    stationery: '도서/티켓/문구',
    beauty: '뷰티',
    interior: '인테리어',
    household: '생활용품',
    tools: '공구/산업용품',
    grocery: '식품',
    infant: '유아',
    pet: '반려동물',
    others: '기타',
    talent: '재능',
  };

  const categoryName = type
    ? categoryMap[type] || '알 수 없는 카테고리'
    : '전체 카테고리';
  const fetchMoreProducts = async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const { data } = await axiosInstance.get('/api/permit/home/categories', {
        params: { categoryName: categoryName },
      });

      const startIndex = (page - 1) * 16;
      const endIndex = startIndex + 16;
      const newRaffles = data.result.raffles.slice(startIndex, endIndex);

      console.log('카테고리 :', categoryName);

      if (newRaffles.length < 16) {
        setRaffles((prev) => [...prev, ...newRaffles]);
        setHasMore(false);
      } else {
        setRaffles((prev) => [...prev, ...newRaffles]);
      }
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('데이터 불러오기 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setRaffles([]);
    setPage(1);
    setHasMore(true);
    fetchMoreProducts();
  }, [type]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage((prev) => prev + 1);
        } else {
          console.log('hasmore:', hasMore);
        }
      },
      { threshold: 1.0 },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading]);

  // 페이지 변경 시 새로운 데이터 로드
  useEffect(() => {
    if (!hasMore) return;
    fetchMoreProducts();
  }, [page]);

  return (
    <Wrapper>
      <LookAroundBox>{categoryName}</LookAroundBox>

      <Horizon />

      <ProductGrid>
        {(raffles ?? []).map((raffle) => (
          <ProductCard key={raffle.raffleId} {...raffle} />
        ))}
      </ProductGrid>

      {hasMore && <Observer ref={observerRef} />}
    </Wrapper>
  );
};

export default SearchResultPage;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 64px;
  ${media.notLarge`
    padding:57px 0px 30px 0px;
    width:100%
  `}
`;

const LookAroundBox = styled.div`
  color: #000;
  text-align: center;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  min-width: 1080px;
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
  height: 20px;
`;
