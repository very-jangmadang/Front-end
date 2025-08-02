import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ 유저 프로필 페이지 이동을 위해 추가
import styled from 'styled-components';
import BigTitle from '../../components/BigTitle';
import FollowingItem from '../../components/FollowingItem';
import FollowNoModal from '../../components/Modal/modals/FollowNoModal';
import axiosInstance from '../../apis/axiosInstance';
import media from '../../styles/media';

const FollowingList: React.FC = () => {
  const navigate = useNavigate(); // ✅ 네비게이션 훅 추가
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [followingList, setFollowingList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  const fetchFollowingList = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/api/member/follow/list');

      if (data.isSuccess) {
        setFollowingList(
          data.result.map((store: any) => ({
            ...store,
            username: store.storeName || `상점 ${store.storeId}`,
          })),
        );
      } else {
        setFollowingList([]);
      }
    } catch (error) {
      console.error('팔로잉 목록을 불러오는 중 오류 발생:', error);
      setFollowingList([]);
    } finally {
      setLoading(false);
    }
  };

  /* ✅ 팔로잉한 사람 클릭하면 해당 유저 프로필로 이동 */
  const handleProfileClick = (storeId: number) => {
    if (!isDeleteMode) {
      navigate(`/user/${storeId}`); // ✅ 유저 프로필 페이지 이동
    }
  };

  /* ✅ 팔로우 취소 */
  const handleUnfollow = async () => {
    const storeIdsToUnfollow = Object.keys(checkedItems)
      .filter((key) => checkedItems[parseInt(key, 10)])
      .map((key) => parseInt(key, 10));

    if (storeIdsToUnfollow.length === 0) {
      alert('선택된 팔로우가 없습니다.');
      return;
    }

    try {
      for (const storeId of storeIdsToUnfollow) {
        console.log(`언팔로우 요청: storeId=${storeId}`);

        const response = await axiosInstance.delete(
          `/api/member/follow/cancel?storeId=${storeId}`,
          {
            withCredentials: true
          }
        );

        if (response.data.isSuccess) {
          console.log(`언팔로우 성공: ${storeId}`);
        } else {
          console.warn(`언팔로우 실패: ${response.data.message}`);
        }
      }

      setModalMessage('팔로우가 취소되었습니다.');
      fetchFollowingList();
    } catch (error: any) {
      console.error(
        '팔로우 취소 중 오류 발생:',
        error.response?.data || error.message,
      );
      setModalMessage('팔로우 취소에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setCheckedItems({});
      setIsDeleteMode(false);
    }
  };

  const handleToggle = (storeId: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [storeId]: !prev[storeId],
    }));
  };

  useEffect(() => {
    fetchFollowingList();
  }, []);

  return (
    <Container>
      <BigTitleWrapper>
        <BigTitle>팔로잉 목록</BigTitle>
        <ButtonWrapper>
          {isDeleteMode ? (
            <>
              <DeleteButton onClick={handleUnfollow}>팔로우 취소</DeleteButton>
              <CancelButton onClick={() => setIsDeleteMode(false)}>
                선택 취소
              </CancelButton>
            </>
          ) : (
            <SelectButton onClick={() => setIsDeleteMode(true)}>
              선택
            </SelectButton>
          )}
        </ButtonWrapper>
      </BigTitleWrapper>

      <ListContainer>
        {loading ? (
          <LoadingMessage>팔로잉 목록을 불러오는 중...</LoadingMessage>
        ) : followingList.length > 0 ? (
          followingList.map((store) => (
            <FollowingItem
              key={store.storeId}
              userId={store.storeId} // ✅ userId 추가 (유저 프로필 이동을 위해 필요)
              username={store.username}
              profileImage={store.profileImg}
              isDeleteMode={isDeleteMode}
              isChecked={!!checkedItems[store.storeId]}
              onToggle={() => handleToggle(store.storeId)}
              onProfileClick={() => handleProfileClick(store.storeId)} // ✅ 클릭하면 이동
            />
          ))
        ) : (
          <NoItemsMessage>팔로우한 상점이 없습니다.</NoItemsMessage>
        )}
      </ListContainer>

      {modalMessage && (
        <FollowNoModal
          onClose={() => setModalMessage(null)}
          message={modalMessage}
        />
      )}
    </Container>
  );
};

export default FollowingList;

/* ✅ 스타일 유지 */
const Container = styled.div`
  background: white;
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  text-align: center;
  margin-top: 64px;
`;

const BigTitleWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const ButtonWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 10px;
  ${media.notLarge`
    right:45px
  `}
`;

const SelectButton = styled.button`
  display: inline-flex;
  height: 31px;
  padding: 0px 14px;
  justify-content: center;
  align-items: center;
  border-radius: 11px;
  background: #c908ff;
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  border: none;
  cursor: pointer;
`;

const CancelButton = styled.button`
  border: 1px solid #c908ff;
  display: inline-flex;
  height: 31px;
  padding: 0px 14px;
  justify-content: center;
  align-items: center;
  border-radius: 11px;
  background: rgba(201, 8, 255, 0.2);
  color: #c908ff;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  display: inline-flex;
  height: 31px;
  padding: 0px 14px;
  justify-content: center;
  align-items: center;
  border-radius: 11px;
  background: #c908ff;
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  border: none;
  cursor: pointer;
`;

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px 108px;
  width: 100%;
  margin-top: 50px;
`;

const LoadingMessage = styled.div`
  font-size: 16px;
  color: #666;
  margin-top: 20px;
`;

const NoItemsMessage = styled.div`
  font-size: 16px;
  color: #999;
  margin-top: 20px;
`;
