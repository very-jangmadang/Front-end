import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ProductCard from '../../components/ProductCard';
import BigTitle from '../../components/BigTitle';
import ProfileComponent from '../../components/ProfileComponent';
import NameEditModal from '../../components/Modal/modals/NameEditModal';
import axiosInstance from '../../apis/axiosInstance';
import media from '../../styles/media';
import { useAuth } from '../../context/AuthContext';

interface ProfileData {
  nickname: string;
  followerNum: number;
  reviewNum: number;
  raffles: any[];
  is_business?: boolean;
}

const MyProfilePage: React.FC = () => {
  const [selectedToggle, setSelectedToggle] = useState('응모한 래플');
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNameEditModalOpen, setIsNameEditModalOpen] = useState(false);
  const { isAuthenticated, isBusiness, isInitialized, checkBusinessStatus } =
    useAuth();

  const navigate = useNavigate();

  // 전역 상태에서 isBusiness를 가져오므로 별도 API 호출 불필요

  const fetchProfileData = async () => {
    // 로그인 상태가 확실히 확인된 후에만 API 호출
    if (isAuthenticated !== true) {
      console.log('로그인 상태를 확인 중이거나 로그인이 필요합니다.');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      let endpoint = '/api/member/mypage';

      if (selectedToggle === '응모한 래플') {
        endpoint = '/api/member/mypage';
      } else if (selectedToggle === '주최하는 래플') {
        endpoint = '/api/member/mypage/myRaffles';
      } else if (selectedToggle === '찜한 래플') {
        endpoint = '/api/member/raffles/like'; // 찜한 래플 전용 API 사용
      }

      const { data } = await axiosInstance.get(endpoint);
      console.log(`${selectedToggle}: `, data);
      console.log('API 응답 전체 구조:', JSON.stringify(data, null, 2));

      if (data.isSuccess) {
        let raffles = [];

        if (selectedToggle === '찜한 래플') {
          // 찜한 래플 API 응답 구조에 맞게 데이터 변환
          raffles = (data.result || []).map((item: any) => {
            // 현재 시간과 응모 마감 시간 비교
            const currentTime = new Date().getTime();
            const endTime = new Date(item.timeUntilEnd).getTime();

            const isFinished = endTime > 0 ? false : true;

            return {
              raffleId: item.raffleId,
              raffleName: item.raffleName,
              raffleImage: item.imageUrls?.[0] || '',
              ticketNum: item.ticketNum,
              applyNum: item.applyCount,
              timeUntilEnd: item.timeUntilEnd,
              finished: isFinished, // 현재 시간과 마감 시간 비교 결과
              liked: true, // 찜한 래플이므로 항상 true
              raffleStatus: item.raffleStatus, // 필수 속성 추가
            };
          });
        } else {
          // 기존 마이페이지 API에서 래플 데이터 추출
          raffles = (data.result.raffles ?? []).map((item: any) => {
            // 현재 시간과 응모 마감 시간 비교
            const currentTime = new Date().getTime();
            const endTime = new Date(item.timeUntilEnd).getTime();
            const isFinished = endTime > 0 ? false : true;

            const mappedItem = {
              ...item,
              finished: isFinished, // 현재 시간과 마감 시간 비교 결과
              raffleStatus: item.raffleStatus || item.status || 'ACTIVE', // raffleStatus 필드 추가
            };

            // 디버깅: raffleStatus 값 확인
            console.log('마이페이지 래플 데이터 매핑:', {
              original: item,
              mapped: mappedItem,
              raffleStatus: mappedItem.raffleStatus
            });

            return mappedItem;
          });
        }

        setProfileData({
          nickname: data.result.nickname || '-',
          followerNum: data.result.followerNum || 0,
          reviewNum: data.result.reviewNum || 0,
          raffles: raffles,
          is_business: data.result.is_business || false,
        });

        // is_business 값은 API 응답에서 가져옴
      } else {
        setProfileData(null);
      }
    } catch (error: any) {
      console.error('API 요청 중 오류 발생:', error);

      // 로그인되지 않은 경우에만 에러 처리
      if (error.response?.status === 401 && !isAuthenticated) {
        console.log('로그인이 필요합니다.');
        // 로그인 페이지로 리다이렉트하거나 로그인 모달 표시
        navigate('/');
        return;
      }

      setProfileData(null);
    } finally {
      setLoading(false);
    }
  };

  // 마이페이지를 열 때마다 사업자 여부를 최신 상태로 업데이트
  useEffect(() => {
    console.log(
      '=== MyProfilePage: 마이페이지 마운트 - 사업자 여부 재확인 시작 ===',
    );

    // 인증 상태 초기화가 완료된 후에만 처리
    if (!isInitialized) {
      console.log('인증 상태 초기화 중...');
      return;
    }

    if (isAuthenticated === true) {
      console.log('=== MyProfilePage: 사업자 여부 재확인 시작 ===');
      checkBusinessStatus();
    } else if (isAuthenticated === false) {
      // 로그인이 확실히 안 된 경우에만 리다이렉트
      console.log('로그인이 필요합니다.');
      navigate('/');
      return;
    }
  }, [isAuthenticated, isInitialized, checkBusinessStatus, navigate]);

  useEffect(() => {
    // 인증 상태 초기화가 완료되고 로그인된 상태에서만 프로필 데이터 가져오기
    if (isInitialized && isAuthenticated === true) {
      fetchProfileData();
    }
  }, [selectedToggle, isAuthenticated, isInitialized]);

  // 토글 옵션 결정
  const getToggleOptions = () => {
    if (isBusiness) {
      return ['응모한 래플', '주최하는 래플'];
    } else {
      return ['응모한 래플', '찜한 래플'];
    }
  };

  const toggleOptions = getToggleOptions();

  return (
    <Container>
      <InnerContainer>
        <TitleContainer>
          <StyledBigTitle>장마당 주최자</StyledBigTitle>
          <SettingsLink to="/mypage/setting">
            설정 및 내 정보 수정하기 &gt;
          </SettingsLink>
        </TitleContainer>

        {!isInitialized ? (
          <LoadingMessage>인증 상태를 확인하는 중...</LoadingMessage>
        ) : profileData ? (
          <ProfileComponent
            username={profileData.nickname}
            followers={profileData.followerNum}
            reviews={profileData.reviewNum}
            isBusinessUser={isBusiness}
            isUserProfilePage={false} // 마이페이지임을 명시
          />
        ) : null}

        <ToggleContainer>
          <ToggleIndicator
            selectedToggle={selectedToggle}
            toggleOptions={toggleOptions}
          />
          {toggleOptions.map((option) => (
            <ToggleOption
              key={option}
              selectedToggle={selectedToggle}
              value={option}
              onClick={() => setSelectedToggle(option)}
            >
              {option}
            </ToggleOption>
          ))}
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
                raffleStatus={product.raffleStatus}
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
  width: 946px;
  height: 58px;
  flex-shrink: 0;
  border-radius: 50px;
  background: #f5f5f5;
  margin-bottom: 45px;
  margin: 45px auto 76px;
  display: flex;
  align-items: center;
  cursor: pointer;

  @media (max-width: 1024px) {
    width: 100%;
    max-width: 946px;
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 500px;
  }
`;

const ToggleIndicator = styled.div<{
  selectedToggle: string;
  toggleOptions: string[];
}>`
  position: absolute;
  width: ${({ toggleOptions }) => `calc(100% / ${toggleOptions.length})`};
  height: 100%;
  background: #c908ff;
  border-radius: 50px;
  top: 0;
  transition: left 0.3s ease;
  left: ${({ selectedToggle, toggleOptions }) => {
    const index = toggleOptions.indexOf(selectedToggle);
    return `calc(${index} * (100% / ${toggleOptions.length}))`;
  }};
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
