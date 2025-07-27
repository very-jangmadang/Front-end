export type TRaffleStatus =
  | 'UNOPENED'
  | 'ACTIVE'
  | 'UNFULFILLED'
  | 'ENDED'
  | 'CANCELLED'
  | 'COMPLETED';

export type TRaffleDetail = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: RaffleDetailProps;
};

export type RaffleDetailProps = {
  imageUrls: string[];
  name: string;
  category: string;
  ticketNum: number;
  startAt: string; // ISO 8601 형식의 날짜 (Date 변환 가능)
  endAt: string;
  description: string;
  minUser: number;
  view: number;
  likeCount: number;
  likeStatus: boolean;
  applyCount: number;
  nickname: string;
  storeId: number;
  followCount: number;
  reviewCount: number;
  userStatus: string;
  isWinner: string;
  raffleStatus: TRaffleStatus;
  deliveryId: number;
  followStatus: boolean;
  storeImageUrl: string;
  children?: React.ReactNode;
};
