import React from "react";
import styled from "styled-components";
import StarIcon from "../assets/mypages/Star.svg";
import GrayStarIcon from "../assets/mypages/Graystar.svg";

interface Review {
  reviewId: number;
  userId: number;
  raffleId: number;
  raffleName: string;
  profileImageUrl: string;
  reviewerId: number;
  score: number;
  text: string;
  imageUrls: string[];
  timestamp: string;
}

interface ReviewComponentProps {
  reviews: Review[];
  averageScore: number;
  reviewCount: number;
}

const ReviewComponent: React.FC<ReviewComponentProps> = ({
  reviews,
  averageScore,
  reviewCount,
}) => {
  return (
    <Container>
      <AverageRatingBox>
        <StarRow>
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} src={StarIcon} />
          ))}
        </StarRow>
        <RatingText>
          평점: <RatingValue>{averageScore.toFixed(1)}</RatingValue> ({reviewCount})
        </RatingText>
      </AverageRatingBox>

      {reviews.map((review) => (
        <ReviewCard key={review.reviewId}>
          <UserSection>
            <ProfileImage src={review.profileImageUrl || ''} alt="프로필 이미지" />
            <Username>사용자 {review.reviewerId}</Username>
            <StarRow>
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} src={index < review.score ? StarIcon : GrayStarIcon} />
              ))}
            </StarRow>
          </UserSection>

          <ReviewContent>
            <ProductName>{review.raffleName}</ProductName>
            <ImageContainer>
              {review.imageUrls && review.imageUrls.length > 0 ? (
                review.imageUrls.map((image, index) => (
                  <ReviewImage key={index} src={image} alt={`Review ${index + 1}`} />
                ))
              ) : (
                <NoImageMessage>이미지 없음</NoImageMessage>
              )}
            </ImageContainer>
            <ReviewText>{review.text}</ReviewText>
            <Timestamp>{new Date(review.timestamp).toLocaleDateString('ko-KR')}</Timestamp>
          </ReviewContent>
        </ReviewCard>
      ))}
    </Container>
  );
};

export default ReviewComponent;


const Container = styled.div`
  width: 100%;
  max-width: 1080px;
  padding: 40px 20px;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 58px;
`;

const AverageRatingBox = styled.div`
  width: 206px;
  height: 94px;
  text-align: center;
  margin: 0 auto 30px;
`;

const StarRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
`;

const Star = styled.img`
  width: 24px;
  height: 24px;
`;

const RatingText = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const RatingValue = styled.span`
  color: #c908ff;
`;

const ReviewCard = styled.div`
  display: flex;
  width: 701px;
  height: 356px;
  padding: 20px 50px;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  border-radius: 10px;
  background: rgba(245, 245, 245, 0.79);
`;

const UserSection = styled.div`
  display: flex;
  width: 295px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProfileImage = styled.img`
  width: 62px;
  height: 61px;
  border-radius: 50%;
  background: #d9d9d9;
  margin-bottom: 10px;
  object-fit: cover;
`;

const Username = styled.div`
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 8px;
`;

const ReviewContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 295px;
`;

const ProductName = styled.div`
  display: flex;
  height: 50px;
  flex-direction: column;
  justify-content: center;
  color: #8f8e94;
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 500;
  line-height: 27px;
  width: 295px;
`;

const ImageContainer = styled.div`
  display: flex;
  width: 295px;
  gap: 12.8px;
`;

const ReviewImage = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 5px;
  background: #d9d9d9;
  object-fit: cover;
`;

const ReviewText = styled.div`
  display: flex;
  height: 108px;
  width: 295px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  align-self: stretch;
  color: #000;
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 400;
  line-height: 150%;
`;

const Timestamp = styled.div`
  font-size: 14px;
  color: #8f8e94;
  margin-top: 8px;
`;

const NoImageMessage = styled.div`
  font-size: 14px;
  color: #8f8e94;
  text-align: center;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 5px;
  width: 100%;
`;

const NoReviewsMessage = styled.div`
  font-size: 18px;
  color: #999;
  margin-top: 20px;
`;

const LoadingMessage = styled.div`
  font-size: 18px;
  color: #666;
  margin-top: 20px;
`;
