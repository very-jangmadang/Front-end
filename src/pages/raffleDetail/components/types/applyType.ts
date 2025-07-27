export interface ApplySuccessResponse {
  isSuccess: true;
  code: string;
  message: string;
  result: {
    userId: number;
    raffleId: number;
    raffleImage: string;
    endAt: string;
  };
}

export interface ApplyFailResponse {
  isSuccess: false;
  code: string;
  message: string;
  result?: {
    missingTickets?: number;
  };
}

export type ApplyResponse = ApplySuccessResponse | ApplyFailResponse;
