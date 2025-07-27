import { create } from 'zustand';

// raffleDetailPage에서 작업 수행 후 <Item>, <Market>, <Probability>가
// 각각 리렌더링 될 수 있도록 함.

interface RaffleState {
  // 응모 완료함
  isApplying: boolean;
  setIsApplying: (state: boolean) => void;

  // 당첨 여부를 확인함
  isChecked: boolean;
  setIsChecked: (state: boolean) => void;

  // 팔로우 or 팔로우 취소
  followingState: boolean;
  setFollowingState: (state: boolean) => void;
}

const useRaffleStore = create<RaffleState>((set) => ({
  isApplying: false,
  setIsApplying: (state) => set({ isApplying: state }),

  isChecked: false,
  setIsChecked: (state) => set({ isChecked: state }),

  followingState: false,
  setFollowingState: (state) => set({ followingState: state }),
}));

export default useRaffleStore;
