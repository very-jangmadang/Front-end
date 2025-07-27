import { create } from 'zustand';
import { TDeliveryStatus } from '../../../types/deliveryStatus';

interface RaffleData {
  raffleId: number;
  minTicket: number;
  applyTicket: number;
  totalAmount: number;
  remainedMinutes: number;
}

interface Address {
  addressId: number;
  recipientName: string;
  postalCode: string;
  addressDetail: string;
  phoneNumber: string;
}

interface DeliveryData {
  raffleId: number;
  winnerId: number;
  deliveryId: number;
  minTicket: number;
  applyTicket: number;
  totalAmount: number;
  deliveryStatus: TDeliveryStatus;
  shippingDeadline?: string | null;
  address: Address;
}

const defaultAddress: Address = {
  addressId: 0,
  recipientName: '없음',
  postalCode: '',
  addressDetail: '없음',
  phoneNumber: '',
};

interface HostResultState {
  raffleData: RaffleData;
  deliveryData: DeliveryData;
  setRaffleData: (data: Partial<RaffleData>) => void;
  setDeliveryData: (data: Partial<DeliveryData>) => void;
  setDeliveryId: (deliveryId: number) => void; // ✅ 추가
}

const useHostResultStore = create<HostResultState>((set) => ({
  raffleData: {
    raffleId: 0,
    minTicket: 0,
    applyTicket: 0,
    totalAmount: 0,
    remainedMinutes: 0,
  },
  deliveryData: {
    raffleId: 0,
    winnerId: 0,
    deliveryId: 0,
    minTicket: 0,
    applyTicket: 0,
    totalAmount: 0,
    deliveryStatus: 'ADDRESS_EXPIRED',
    shippingDeadline: null,
    address: defaultAddress,
  },
  setRaffleData: (data) =>
    set((state) => ({
      raffleData: { ...state.raffleData, ...data },
    })),
  setDeliveryData: (data) =>
    set((state) => ({
      deliveryData: {
        ...state.deliveryData,
        ...data,
        address: data.address ?? state.deliveryData.address,
      },
    })),
  setDeliveryId: (deliveryId) =>
    set((state) => ({
      deliveryData: {
        ...state.deliveryData,
        deliveryId,
      },
    })),
}));

export default useHostResultStore;
