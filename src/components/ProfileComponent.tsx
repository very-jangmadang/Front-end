import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import platinum3 from "../assets/mypages/platinum3.svg";
import profileDefault from "../assets/mypages/profileDefault.svg";
import editProfile from "../assets/mypages/editProfile.svg";
import axiosInstance from "../apis/axiosInstance";
import NameEditModal from "./Modal/modals/NameEditModal";

interface ProfileProps {
  username: string;
  followers: number;
  reviews: number;
  isUserProfilePage?: boolean; // true: 남의 페이지, false: 마이페이지
  followStatus?: boolean;
  onEditProfile?: () => void;
  profileImageUrl?: string | null;
  isBusinessUser?: boolean; // 사업자 계정 여부
}

const ProfileComponent: React.FC<ProfileProps> = ({
  username: initialUsername,
  followers: initialFollowers,
  reviews,
  isUserProfilePage = false, // true: 남의 페이지, false: 마이페이지
  followStatus,
  isBusinessUser = false, // 사업자 계정 여부
}) => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [profileImage, setProfileImage] = useState<string>(profileDefault);
  const [isFollowing, setIsFollowing] = useState<boolean>(followStatus ?? false);
  const [followers, setFollowers] = useState<number>(initialFollowers);
  const [username, setUsername] = useState<string>(initialUsername);
  const [isNameEditModalOpen, setIsNameEditModalOpen] = useState<boolean>(false);

  const handleCloseModal = () => {
    setIsNameEditModalOpen(false);
  };

  const handleNicknameChange = (newNickname: string) => {
    setUsername(newNickname);
  };

  const handleProfileImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("profile", file);
  
    try {
      const response = await axiosInstance.patch("/api/member/mypage/profile-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.data) {
        alert("프로필 이미지가 변경되었습니다!");
        setProfileImage(response.data);
        await fetchProfileData();
      } else {
        console.error("프로필 이미지 변경 실패:", response);
      }
    } catch (error) {
      console.error("프로필 이미지 변경 중 오류 발생:", error);
    }
  };

  const handleFollowToggle = async () => {
    try {
      let endpoint = "/api/member/follow/";
      let method = "POST";
      let requestConfig = { params: { storeId: userId } };
  
      if (isFollowing) {
        endpoint = "/api/member/follow/cancel";
        method = "DELETE";
      }
  
      let response;
      if (method === "POST") {
        response = await axiosInstance.post(endpoint, {}, requestConfig);
      } else {
        response = await axiosInstance.delete(endpoint, requestConfig);
      }
  
      if (response.data.isSuccess) {
        setIsFollowing(!isFollowing);
        setFollowers((prev) => (isFollowing ? prev - 1 : prev + 1));
        console.log("팔로우 상태 변경 성공:", !isFollowing);
      } else {
        alert(response.data.message || "작업 수행 실패");
      }
    } catch (error) {
      console.error("팔로우 변경 오류:", error);
      alert("팔로우 변경 중 오류 발생");
    }
  };
  
  const fetchProfileData = async () => {
    try {
      const endpoint = isUserProfilePage
        ? `/api/permit/mypage/${userId}`
        : `/api/member/mypage`;

      const response = await axiosInstance.get(endpoint);

      if (response.data.isSuccess) {
        const { profileImageUrl, followStatus, followerNum, nickname } = response.data.result;

        setProfileImage(profileImageUrl && profileImageUrl.startsWith("http") ? profileImageUrl : profileDefault);
        setIsFollowing(followStatus ?? false);
        setFollowers(followerNum);
        setUsername(nickname);
      } else {
        console.warn("프로필 데이터 로드 실패:", response.data.message);
      }
    } catch (error) {
      console.error("프로필 데이터 불러오기 오류:", error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [userId]);

  return (
    <ProfileWrapper>
      <ProfileContent>
        <ProfileImageWrapper>
          <ProfileImage src={profileImage} alt="Profile" />
          {!isUserProfilePage && (
            <>
              <EditIcon htmlFor="profile-upload">
                <img src={editProfile} alt="Edit Profile" />
              </EditIcon>
              <HiddenFileInput 
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
              />
            </>
          )}
        </ProfileImageWrapper>

        <UserDetails>
          <UserInfo>
            <Username>{username}</Username>
            {/* 사업자 계정일 때만 로고 표시 */}
            {isBusinessUser && (
              <RankIcon src={platinum3} alt="Platinum Rank" />
            )}
            {/* 마이페이지이고 사업자가 아닐 때만 닉네임 변경 버튼 표시 */}
            {!isUserProfilePage && !isBusinessUser && (
              <NicknameEditButton onClick={() => setIsNameEditModalOpen(true)}>
                닉네임 변경
              </NicknameEditButton>
            )}
          </UserInfo>

          <StatsContainer>
            {/* 일반 계정: 팔로워 수 + 팔로잉 목록 버튼 */}
            {!isBusinessUser && (
              <>
                <StatItem>
                  팔로워 <StatNumber>{followers <= -1 ? "비공개" : followers}</StatNumber>
                </StatItem>
                <StyledButton onClick={() => navigate("/mypage/following-list")}>
                  팔로잉 목록
                </StyledButton>
              </>
            )}
            
            {/* 사업자 계정: 팔로워 + 후기 표시 */}
            {isBusinessUser && (
              <>
                <StatItem>
                  팔로워 <StatNumber>{followers <= -1 ? "비공개" : followers}</StatNumber>
                </StatItem>
                <Divider />
                <StatItem>후기 <StatNumber>{reviews}</StatNumber></StatItem>
              </>
            )}
          </StatsContainer>

          {/* 사업자 계정일 때만 추가 버튼들 표시 */}
          {isBusinessUser && !isUserProfilePage && (
            <BusinessButtonContainer>
              <StyledButton onClick={() => navigate("/mypage/following-list")}>
                팔로잉 목록
              </StyledButton>
              <StyledButton onClick={() => navigate("/mypage/my-review")}>
                상점 후기
              </StyledButton>
            </BusinessButtonContainer>
          )}

          <ButtonContainer>
            {/* 남의 페이지일 때: 팔로우하기 버튼 */}
            {isUserProfilePage ? (
              <FollowButton isFollowing={isFollowing} onClick={handleFollowToggle}>
                {isFollowing ? "팔로우 취소" : "팔로우하기"}
              </FollowButton>
            ) : (
              /* 마이페이지일 때: 버튼 없음 (StatsContainer에 팔로잉 목록 버튼이 있음) */
              null
            )}
          </ButtonContainer>
        </UserDetails>
      </ProfileContent>

      {/* 마이페이지이고 사업자가 아닐 때만 닉네임 변경 모달 표시 */}
      {!isUserProfilePage && !isBusinessUser && isNameEditModalOpen && (
        <NameEditModal
          currentNickname={username}
          onClose={handleCloseModal}
          onNicknameChange={handleNicknameChange}
        />
      )}
    </ProfileWrapper>
  );
};

export default ProfileComponent;


const StatsContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start; /* 왼쪽 정렬로 변경 */
  align-items: center;
  gap: 46px; /* 정확히 46px 간격 */
  margin-top: 12px; /* UserInfo와의 간격 */

  @media (max-width: 744px) { /* 모바일 가로, 태블릿 세로 */
    width: 100%;
    justify-content: flex-start; /* 모바일에서도 왼쪽 정렬 */
    gap: 46px; /* 모바일에서도 동일한 간격 유지 */
  }
`;

const ProfileWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 50px;

  @media (max-width: 1024px) { /* 태블릿 가로 & 소형 노트북 */
    flex-direction: column;
    margin-top: 40px;
  }

  @media (max-width: 768px) { /* 스마트폰 가로 & 태블릿 세로 */
    flex-direction: column;
    margin-top: 30px;
  }
`;

const ProfileContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 555px;
  gap: 74px; /* 프로필 사진과 프로필 정보 간격 74px */

  @media (max-width: 768px) { /* 스마트폰 가로 & 태블릿 세로 */
    flex-direction: column;
    gap: 45px; /* 세로 정렬 시 프로필 & 줄 간격 45px 유지 */
  }
`;

const BusinessButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
  margin-left: -10px;
  width: 100%;
  justify-content: flex-start;

  @media (max-width: 390px) {
    gap: 12px;
    margin-top: 12px;
    margin-left: -10px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px; /* ✅ 버튼 간격 항상 20px 유지 */
  width: 100%;
  max-width: 300px; /* ✅ 최대 너비 설정 */
  flex-wrap: nowrap; /* ✅ 버튼이 줄 바꿈되지 않도록 설정 */
  min-height: 38.5px; /* 최소 높이 설정 */

  @media (max-width: 1024px) { /* 태블릿 가로 & 소형 노트북 */
    max-width: 280px;
  }

  @media (max-width: 768px) { /* 스마트폰 가로 & 태블릿 세로 */
    max-width: 260px;
  }

  @media (max-width: 480px) { /* 스마트폰 세로 */
    max-width: 240px;
  }
`;

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 138px; /* ✅ 버튼 최소 너비 유지 */
  height: 38.5px;
  font-size: 16px;
  border-radius: 9px;
  border: 1px solid #8F8E94;
  background: #fff;
  cursor: pointer;
  text-align: center;
  padding: 10px 16px;
  flex-shrink: 0; /* ✅ 크기 줄어들지 않도록 설정 */

  @media (max-width: 1024px) { /* 태블릿 가로 & 소형 노트북 */
    min-width: 130px;
    height: 42px;
  }

  @media (max-width: 768px) { /* 스마트폰 가로 & 태블릿 세로 */
    min-width: 125px;
    height: 40px;
    font-size: 14px;
  }

  @media (max-width: 480px) { /* 스마트폰 세로 */
    min-width: 120px;
    height: 38px;
    font-size: 14px;
    padding: 8px 12px;
  }
`;


const ProfileImageWrapper = styled.div`
  position: relative;
  width: 222px;
  height: 222px;

  @media (max-width: 1024px) { /* 태블릿 가로 & 소형 노트북 */
    width: 200px;
    height: 200px;
  }

  @media (max-width: 768px) { /* 스마트폰 가로 & 태블릿 세로 */
    width: 180px;
    height: 180px;
  }

  @media (max-width: 480px) { /* 스마트폰 세로 (일반 모바일) */
    width: 140px;
    height: 140px;
  }
`;

const Username = styled.div`
  font-size: 24px;
  font-weight: 700;

  @media (max-width: 1024px) { /* 태블릿 가로 & 소형 노트북 */
    font-size: 22px;
  }

  @media (max-width: 768px) { /* 스마트폰 가로 & 태블릿 세로 */
    font-size: 20px;
  }

  @media (max-width: 480px) { /* 스마트폰 세로 (일반 모바일) */
    font-size: 18px;
  }
`;


const NicknameEditButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 8px;
  border: 1px solid #8f8e94;
  background: #fff;
  color: #8f8e94;
  cursor: pointer;
  margin-left: 8px;

  &:hover {
    background: #f5f5f5;
  }

  @media (max-width: 390px) {
    height: 24px;
    font-size: 12px;
    padding: 4px 8px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 41px; /* 닉네임과 닉네임 변경 버튼 간격 41px */
  width: auto; /* 자동 너비로 변경하여 꽉 들어가도록 */
  justify-content: flex-start; /* 왼쪽 정렬 */

  @media (max-width: 390px) {
    gap: 20px; /* 작은 화면에서는 간격 줄임 */
  }
`;


const FollowButton = styled.button<{ isFollowing: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: max-content; /* ✅ 버튼 너비가 텍스트 크기에 맞춰 자동 조정 */
  height: 39px;
  font-size: 16px;
  border-radius: 9px;
  border: 1px solid #c908ff;
  background: ${({ isFollowing }) => (isFollowing ? "#fff" : "#c908ff")};
  color: ${({ isFollowing }) => (isFollowing ? "#c908ff" : "#fff")};
  cursor: pointer;
  padding: 10px 16px;
  white-space: nowrap; /* ✅ 줄 바꿈 방지 */
  flex-shrink: 0; /* ✅ 버튼 크기가 줄어들어도 내용이 줄 바뀌지 않도록 설정 */

  @media (max-width: 390px) {
    width: auto; /* ✅ 자동 너비 조정 */
  }
`;



const StyledReportButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 138px;
  height: 39px;
  font-size: 16px;
  border-radius: 9px;
  border: 1px solid #8f8e94;
  background: #fff;
  color: #8f8e94;
  cursor: pointer;
  padding: 10px 16px;

  &:hover {
    background: #ffebeb;
  }

  @media (max-width: 390px) {
    width: 100%;
    padding: 10px 16px; /* ✅ 작은 화면에서도 패딩 유지 */
  }
`;


const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;



const HiddenFileInput = styled.input`
  display: none;
`;

const EditIcon = styled.label`
  position: absolute;
  bottom: 20px; /* ✅ 기존보다 더 위로 올려서 프로필 사진과 깊이 겹치게 조정 */
  right: 20px; /* ✅ 안쪽으로 더 밀어넣음 */
  width: 34px; /* ✅ 아이콘 크기 조정 */
  height: 34px;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.15); /* ✅ 반투명 배경 추가 */
  border-radius: 50%; /* ✅ 원형 유지 */
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 390px) {
    width: 26px;
    height: 26px;
    bottom: 15px; /* ✅ 작은 화면에서도 더 깊이 겹치도록 조정 */
    right: 15px;
  }
`;




const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 왼쪽 정렬로 변경 */
  gap: 12px;
  text-align: left; /* 텍스트 왼쪽 정렬 */
  width: auto; /* 자동 너비로 변경하여 꽉 들어가도록 */

  @media (max-width: 390px) {
    gap: 8px;
  }
`;

const RankIcon = styled.img`
  width: 42px;
  height: 39px;
  flex-shrink: 0;

  @media (max-width: 390px) {
    width: 42px; /* ✅ 크기 고정 */
    height: 39px;
  }
`;



const StatItem = styled.div`
  font-size: 20px;

  @media (max-width: 390px) {
    font-size: 20px; /* ✅ 글자 크기 고정 */
  }
`;

const StatNumber = styled.span`
  color: #c908ff;
`;

const Divider = styled.div`
  width: 1px;
  height: 43px;
  background-color: #000;

  @media (max-width: 390px) {
    height: 43px; /* ✅ 크기 유지 */
  }
`;


export {
  FollowButton,
  ProfileWrapper,
  StyledButton,
  StyledReportButton, // ✅ StyledReportButton 추가
  ProfileContent,
  ProfileImageWrapper,
  ProfileImage,
  HiddenFileInput,
  EditIcon,
  UserDetails,
  UserInfo,
  RankIcon,
  Username,
  StatsContainer,
  StatItem,
  StatNumber,
  Divider,
  ButtonContainer,
};
