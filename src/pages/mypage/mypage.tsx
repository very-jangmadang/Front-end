import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ProductCard from '../../components/ProductCard';
import BigTitle from '../../components/BigTitle';
import ProfileComponent from '../../components/ProfileComponent';
import NameEditModal from '../../components/Modal/modals/NameEditModal';
import axiosInstance from '../../apis/axiosInstance';
import media from '../../styles/media';

interface ProfileData {
  nickname: string;
  followerNum: number;
  reviewNum: number;
  raffles: any[];
}

const MyProfilePage: React.FC = () => {
  const [selectedToggle, setSelectedToggle] = useState('응모한 래플');
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNameEditModalOpen, setIsNameEditModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const endpoint =
        selectedToggle === '응모한 래플'
          ? '/api/member/mypage'
          : '/api/member/mypage/myRaffles';
      const { data } = await axiosInstance.get(endpoint);

      if (data.isSuccess) {
        setProfileData({
          nickname: data.result.nickname || '-',
          followerNum: data.result.followerNum || 0,
          reviewNum: data.result.reviewNum || 0,
          raffles: data.result.raffles ?? [],
        });
      } else {
        setProfileData(null);
      }
    } catch (error) {
      console.error('API 요청 중 오류 발생:', error);
      setProfileData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [selectedToggle]);

  return (
    <Container>
      <InnerContainer>
        <TitleContainer>
          <StyledBigTitle>장마당 주최자</StyledBigTitle>
          <SettingsLink to="/mypage/setting">
            설정 및 내 정보 수정하기 &gt;
          </SettingsLink>
        </TitleContainer>

        {profileData && (
          <ProfileComponent
            username={profileData.nickname}
            followers={profileData.followerNum}
            reviews={profileData.reviewNum}
          />
        )}

        <ToggleContainer>
          <ToggleIndicator selectedToggle={selectedToggle} />
          <ToggleOption
            selectedToggle={selectedToggle}
            value="응모한 래플"
            onClick={() => setSelectedToggle('응모한 래플')}
          >
            응모한 래플
          </ToggleOption>
          <ToggleOption
            selectedToggle={selectedToggle}
            value="주최하는 래플"
            onClick={() => setSelectedToggle('주최하는 래플')}
          >
            주최하는 래플
          </ToggleOption>
        </ToggleContainer>

        {loading ? (
          <LoadingMessage>상품을 불러오는 중...</LoadingMessage>
        ) : profileData && profileData.raffles.length > 0 ? (
          <ProductGrid>
            {profileData.raffles.map((product) => (
              <ProductCard
                key={product.raffleId}
                raffleId={product.raffleId}
                name={product.raffleName}
                imageUrls={product.raffleImage ? [product.raffleImage] : ['']}
                ticketNum={product.ticketNum}
                participantNum={product.applyNum}
                timeUntilEnd={Number(product.timeUntilEnd) || 0}
                finish={product.finished}
                like={product.liked}
              />
            ))}
          </ProductGrid>
        ) : (
          <NoProductsMessage>{selectedToggle}이 없습니다.</NoProductsMessage>
        )}
      </InnerContainer>
    </Container>
  );
};

export default MyProfilePage;

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

  @media (max-width: 768px) {
    max-width: 100%; /* ✅ 화면 크기에 맞게 조정 */
  }
`;

const ToggleContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  height: 58px;
  border-radius: 50px;
  background: #f5f5f5;
  margin-bottom: 45px;
  margin: 45px auto 76px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const ToggleIndicator = styled.div<{ selectedToggle: string }>`
  position: absolute;
  width: 50%;
  height: 100%;
  background: #c908ff;
  border-radius: 50px;
  top: 0;
  transition: left 0.3s ease;
  left: ${({ selectedToggle }) =>
    selectedToggle === '응모한 래플' ? '0' : '50%'};
`;

const ToggleOption = styled.div<{ selectedToggle: string; value: string }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  height: 100%;
  cursor: pointer;
  position: relative;
  z-index: 2;

  color: ${({ selectedToggle, value }) =>
    selectedToggle === value ? '#fff' : '#c908ff'};
  transition: color 0.3s ease;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-gap: 24px; 
  padding: 20px;
  place-items: center; 

  grid-template-columns: repeat(4, minmax(250px, 1fr));

  ${media.medium`
    grid-template-columns: repeat(3, 1fr);D
    gap: 9px;
    max-width: 100%;
    padding-left:0px
  `}
  ${media.small`
    grid-template-columns: repeat(1, 1fr);
    gap: 9px;
  `}

`;



const LoadingMessage = styled.div`
  text-align: center;
  font-size: 16px;
  color: #666;
`;

const NoProductsMessage = styled.div`
  text-align: center;
  font-size: 16px;
  color: #999;
`;

const TitleContainer = styled.div`
  position: relative; /* ✅ 부모 요소를 relative로 설정 */
  display: flex;
  align-items: center;
  width: 100%;
`;

const StyledBigTitle = styled(BigTitle)`
  flex: 1;
`;

const SettingsLink = styled(Link)`
  position: absolute;
  right: 0;
  font-size: 14px;
  color: #8f8e94;
  text-decoration: none;
  white-space: nowrap;
  margin-right: 30px;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 700px) {
    display: none; /* ✅ 390px 이하에서 버튼 숨김 */
  }
`;
