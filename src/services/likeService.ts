import axiosInstance from '../apis/axiosInstance';

export const postLike = async (raffleId: number) => {
  try {
    await axiosInstance.post(`/api/member/raffles/like`, null, {
      params: { raffleId: raffleId },
    });
    console.log('찜하기 성공');
  } catch (error) {
    console.error('찜하기 실패:', error);
  }
};

export const deleteLike = async (raffleId: number) => {
  try {
    await axiosInstance.delete(`/api/member/raffles/like`, {
      params: { raffleId: raffleId },
    });
    console.log('찜하기 취소');
  } catch (error) {
    console.error('찜 취소 실패:', error);
  }
};
