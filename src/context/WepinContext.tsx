import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WepinSDK } from '@wepin/sdk-js';

// Wepin SDK 인스턴스의 타입 정의
type WepinType = WepinSDK | null;

interface WepinContextType {
  wepin: WepinType;
  setWepin: (wepin: WepinType) => void;
}

const WepinContext = createContext<WepinContextType | undefined>(undefined);

export const useWepin = () => {
  const context = useContext(WepinContext);
  if (!context) {
    throw new Error('useWepin must be used within a WepinProvider');
  }
  return context;
};

export const WepinProvider = ({ children }: { children: ReactNode }) => {
  const [wepin, setWepin] = useState<WepinType>(null);

  return (
    <WepinContext.Provider value={{ wepin, setWepin }}>
      {children}
    </WepinContext.Provider>
  );
};
