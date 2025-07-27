import React from "react";
import styled from "styled-components";

interface FollowingItemProps {
  username: string;
  userId: string;
  profileImage?: string;
  isDeleteMode: boolean;
  isChecked: boolean;
  onToggle: () => void;
  onProfileClick: () => void; // ✅ 유저 프로필 이동을 위한 prop 추가
}

const FollowingItem: React.FC<FollowingItemProps> = ({
  username,
  userId,
  profileImage,
  isDeleteMode,
  isChecked,
  onToggle,
  onProfileClick, // ✅ Prop으로 받음
}) => {
  return (
    <ItemContainer onClick={isDeleteMode ? onToggle : onProfileClick}> 
      {isDeleteMode && (
        <CheckCircle isChecked={isChecked}>{isChecked && <CheckMark>✔</CheckMark>}</CheckCircle>
      )}
      {profileImage ? (
        <ProfileImg src={profileImage} alt="Profile" />
      ) : (
        <DefaultProfile />
      )}
      <Username>{username}</Username>
    </ItemContainer>
  );
};

export default FollowingItem;

// Styled Components
const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  position: relative;
  padding: 10px 0;
`;

const CheckCircle = styled.div<{ isChecked: boolean }>`
  width: 27px;
  height: 27px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 2px solid ${({ isChecked }) => (isChecked ? "#C908FF" : "#999")};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ isChecked }) => (isChecked ? "#C908FF" : "transparent")};
  color: white;
  transition: all 0.3s ease;
`;

const ProfileImg = styled.img`
  width: 78px;
  height: 78px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 33px;
  margin-left: 35px;
`;

const DefaultProfile = styled.div`
  width: 78px;
  height: 78px;
  border-radius: 50%;
  background: #d3d3d3;
  margin-right: 33px;
  margin-left: 35px;
`;

const Username = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 500;
  line-height: 36.832px;
  white-space: nowrap;
`;

const CheckMark = styled.span`
  font-size: 16px;
  font-weight: bold;
`;
