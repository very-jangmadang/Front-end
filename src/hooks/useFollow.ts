import { useState, useEffect } from 'react';
import axiosInstance from '../apis/axiosInstance';

const useFollow = (initialFollowStatus: boolean, storeId: number) => {
  const [isFollowing, setIsFollowing] = useState(initialFollowStatus);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setIsFollowing(initialFollowStatus);
  }, [initialFollowStatus]);

  const toggleFollow = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    const prev = isFollowing;
    setIsFollowing(!prev);

    try {
      if (prev) {
        await axiosInstance.delete('/api/member/follow/cancel', {
          params: { storeId },
          withCredentials: true
        });
      } else {
        await axiosInstance.post(
          '/api/member/follow/',
          {},
          {
            params: { storeId },
            withCredentials: true
          },
        );
      }
    } catch (error) {
      console.error('팔로우 상태 변경 실패:', error);
      setIsFollowing(prev); // 실패 시 롤백
    } finally {
      setIsProcessing(false);
    }
  };

  return { isFollowing, toggleFollow, isProcessing };
};

export default useFollow;
