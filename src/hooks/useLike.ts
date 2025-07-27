import { useState, useEffect } from 'react';
import { postLike, deleteLike } from '../services/likeService';

const useLike = (like: boolean, raffleId: number) => {
  const [isLiked, setIsLiked] = useState(like);
  const [isProcessing, setIsProcessing] = useState(false); // 중복 요청 방지

  useEffect(() => {
    setIsLiked(like);
  }, [like]);

  const toggleLike = async (event: React.MouseEvent<HTMLDivElement>) => {
    if (isProcessing) return; // 중복 요청 방지

    setIsProcessing(true); // 요청 시작

    const prevLiked = isLiked;
    setIsLiked((prev) => !prev); // UI 즉각 반영 (Optimistic UI)

    try {
      if (prevLiked) {
        await deleteLike(raffleId);
      } else {
        await postLike(raffleId);
      }
    } catch (error) {
      console.error('찜 상태 변경 실패:', error);
      setIsLiked(prevLiked); // 에러 발생 시 롤백
    } finally {
      setIsProcessing(false); // 요청 완료
    }
  };

  return { isLiked, toggleLike, isProcessing };
};

export default useLike;
