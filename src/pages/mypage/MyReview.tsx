import React, { useState, useEffect } from "react";
import styled from "styled-components";
import BigTitle from "../../components/BigTitle";
import ReviewComponent from "../../components/ReviewComponent"; // 방금 만든 리뷰 컴포넌트
import axiosInstance from "../../apis/axiosInstance"; // ✅ API 요청

const MyReview: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [averageScore, setAverageScore] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  /** ✅ 리뷰 데이터 가져오기 */
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/api/reviews/myStore");
      if (data.isSuccess) {
        setAverageScore(data.result.averageScore || 0);
        setReviewCount(data.result.reviewCount || 0);
        setReviews(data.result.reviews || []);
      }
    } catch (error) {
      console.error("리뷰 데이터를 불러오는 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <Container>
      <TitleWrapper>
        <BigTitle>내 상점 후기</BigTitle>
      </TitleWrapper>
      <ReviewWrapper>
        {loading ? (
          <LoadingMessage>리뷰를 불러오는 중입니다...</LoadingMessage>
        ) : reviews.length > 0 ? (
          <ReviewComponent
            reviews={reviews}
            averageScore={averageScore}
            reviewCount={reviewCount}
          />
        ) : (
          <NoReviewsMessage>아직 작성된 후기가 없습니다.</NoReviewsMessage>
        )}
      </ReviewWrapper>
    </Container>
  );
};

export default MyReview;

/* ✅ 스타일링 */
const Container = styled.div`
  width: 100%;
  max-width: 1080px;
  margin-top: 64px;
  text-align: center;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TitleWrapper = styled.div`
  z-index: 10;
`;

const ReviewWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 66px;
`;

const LoadingMessage = styled.div`
  font-size: 18px;
  color: #666;
  margin-top: 20px;
`;

const NoReviewsMessage = styled.div`
  font-size: 18px;
  color: #999;
  margin-top: 20px;
`;
