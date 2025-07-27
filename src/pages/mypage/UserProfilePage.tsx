import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import ProductCard from "../../components/ProductCard";
import BigTitle from "../../components/BigTitle";
import ProfileComponent from "../../components/ProfileComponent";
import axiosInstance from "../../apis/axiosInstance";

interface ProfileData {
  nickname: string;
  followerNum: number;
  reviewNum: number;
  profileImageUrl: string | null;
  followStatus: boolean;
  avgScore?: number;
  raffles: any[];
  reviews: any[];
}

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>(); 
  const [selectedToggle, setSelectedToggle] = useState("주최한 래플");
  const [profileData, setProfileData] = useState<ProfileData>({
    nickname: "불러오는 중...",
    followerNum: 0,
    reviewNum: 0,
    profileImageUrl: null,
    followStatus: false,
    avgScore: 0,
    raffles: [],
    reviews: [], 
  });
  const [loading, setLoading] = useState(true);


  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const userProfileResponse = await axiosInstance.get(`/api/permit/mypage/${userId}`);
      const userRafflesResponse = await axiosInstance.get(`/api/permit/mypage/${userId}/myRaffles`);

      console.log("API 응답 (프로필)", userProfileResponse.data);
      console.log("API 응답 (래플)", userRafflesResponse.data);

      if (userProfileResponse.data.isSuccess && userProfileResponse.data.result) {
        setProfileData((prev) => ({
          ...prev,
          nickname: userProfileResponse.data.result.nickname || "알 수 없음",
          followerNum: userProfileResponse.data.result.followerNum ?? 0,
          reviewNum: userProfileResponse.data.result.reviewNum ?? 0,
          profileImageUrl: userProfileResponse.data.result.profileImageUrl ?? null,
          followStatus: userProfileResponse.data.result.followStatus ?? false,
          avgScore: userProfileResponse.data.result.avgScore ?? 0,
          reviews: userProfileResponse.data.result.reviews ?? [], 
        }));
      }

      if (userRafflesResponse.data.isSuccess && userRafflesResponse.data.result) {
        setProfileData((prev) => ({
          ...prev,
          raffles: userRafflesResponse.data.result.raffles ?? [],
        }));
      }
    } catch (error) {
      console.error("API 요청 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [userId]); 

  return (
    <Container>
      <InnerContainer>
        <BigTitle>{profileData.nickname}님의 프로필</BigTitle>

        {/* ✅ ProfileComponent에 profileImageUrl 넘기기 */}
        <ProfileComponent
          username={profileData.nickname}
          followers={profileData.followerNum}
          reviews={profileData.reviewNum}
          profileImageUrl={profileData.profileImageUrl}
          isUserProfilePage={true}
        />

        <ToggleContainer>
          <ToggleIndicator selectedToggle={selectedToggle} />
          <ToggleOption
            selectedToggle={selectedToggle}
            value="주최한 래플"
            onClick={() => setSelectedToggle("주최한 래플")}
          >
            주최한 래플
          </ToggleOption>
          <ToggleOption
            selectedToggle={selectedToggle}
            value="상점 후기"
            onClick={() => setSelectedToggle("상점 후기")}
          >
            상점 후기
          </ToggleOption>
        </ToggleContainer>

        {loading ? (
          <LoadingMessage>불러오는 중...</LoadingMessage>
        ) : selectedToggle === "주최한 래플" ? (
          profileData.raffles.length > 0 ? (
            <ProductGrid>
              {profileData.raffles.map((product) => (
                <ProductCard
                  key={product.raffleId}
                  raffleId={product.raffleId}
                  name={product.raffleName}
                  imageUrls={product.raffleImage ? [product.raffleImage] : [""]}
                  ticketNum={product.ticketNum}
                  participantNum={product.applyNum}
                  timeUntilEnd={Number(product.timeUntilEnd) || 0}
                  finish={product.finished}
                  like={product.liked}
                />
              ))}
            </ProductGrid>
          ) : (
            <NoProductsMessage>주최한 래플이 없습니다.</NoProductsMessage>
          )
        ) : profileData.reviews.length > 0 ? (
          <ReviewList>
            {profileData.reviews.map((review) => (
              <ReviewItem key={review.reviewId}>
                <p>{review.text}</p>
                <span>평점: {review.score}/5</span>
              </ReviewItem>
            ))}
          </ReviewList>
        ) : (
          <NoProductsMessage>상점 후기가 없습니다.</NoProductsMessage>
        )}
      </InnerContainer>
    </Container>
  );
};

export default UserProfilePage;

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 1440px;
  background: white;
  margin-top: 64px;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 10px; /* ✅ 작은 화면에서 패딩 조정 */
  }
`;

const InnerContainer = styled.div`
  width: 100%;
  max-width: 1080px;
  padding: 0 20px;

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 0 10px;
  }
`;

const ToggleContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px; /* ✅ 최대 너비 설정 */
  height: 58px; /* ✅ 높이 고정 */
  border-radius: 50px;
  background: #f5f5f5;
  margin: 45px auto 45px; /* ✅ 바닥 여백(아래 마진)을 45px 고정 */
  display: flex;
  align-items: center;
  cursor: pointer;

  @media (max-width: 768px) {
    max-width: 400px;
  }

  
  @media (max-width: 480px) {
    max-width: 300px;
  }
`;

const ToggleIndicator = styled.div<{ selectedToggle: string }>`
  position: absolute;
  width: calc(50% - 10px); /* ✅ 너비만 줄어들도록 설정 */
  height: 100%; /* ✅ 높이 유지 */
  background: #c908ff;
  border-radius: 50px;
  top: 0;
  left: ${({ selectedToggle }) => (selectedToggle === "주최한 래플" ? "5px" : "calc(50% + 5px)")}; 
  transition: left 0.3s ease, width 0.3s ease;

  @media (max-width: 768px) {
    width: calc(50% - 8px);
    left: ${({ selectedToggle }) => (selectedToggle === "주최한 래플" ? "4px" : "calc(50% + 4px)")};
  }

  @media (max-width: 480px) {
    width: calc(50% - 6px);
    left: ${({ selectedToggle }) => (selectedToggle === "주최한 래플" ? "3px" : "calc(50% + 3px)")};
  }
`;

const ToggleOption = styled.div<{ selectedToggle: string; value: string }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 20px; /* ✅ 글자 크기 고정 */
  height: 100%; /* ✅ 높이 유지 */
  cursor: pointer;
  position: relative;
  z-index: 2;
  color: ${({ selectedToggle, value }) => (selectedToggle === value ? "#fff" : "#c908ff")};
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 20px; /* ✅ 768px 이하에서도 글자 크기 유지 */
  }

  @media (max-width: 480px) {
    font-size: 20px; /* ✅ 480px 이하에서도 글자 크기 유지 */
  }
`;


const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  place-items: center;
  gap: 44px;

  @media (max-width: 768px) {
    gap: 30px;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }

  @media (max-width: 480px) {
    gap: 20px;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }
`;

const ReviewList = styled.ul`
  margin-top: 20px;
  padding: 0;

  @media (max-width: 768px) {
    margin-top: 15px;
  }
`;

const ReviewItem = styled.li`
  font-size: 18px;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 19.2px;
  color: #666;
  margin-top: 20px;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const NoProductsMessage = styled.div`
  text-align: center;
  font-size: 19.2px;
  color: #999;
  margin-top: 20px;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;
