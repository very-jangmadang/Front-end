import { createContext, useContext } from 'react';

export type AuthContextType = {
  isAuthenticated: boolean | undefined;
  isBusiness: boolean;
  isInitialized: boolean;
  login: () => Promise<void>;
  logout: () => void;
  checkBusinessStatus: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

// Context 사용을 위한 커스텀 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내에서 사용해야 합니다.');
  }
  return context;
};
