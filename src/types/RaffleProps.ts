import { TRaffleStatus } from './RaffleDetail';

interface RaffleProps {
  raffleId: number;
  imageUrls: string[];
  name: string;
  ticketNum: number;
  timeUntilEnd: number;
  finish: boolean;
  participantNum: number;
  like: boolean;
  raffleStatus: TRaffleStatus;
  children?: React.ReactNode;
}

export default RaffleProps;
