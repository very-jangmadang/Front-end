import { width } from './../../node_modules/@mui/system/sizing/sizing.d';
import React, { useEffect, useState } from 'react';
type ScreenSize = 'small' | 'medium' | 'large';

function useScreenSize() {
  const [screenSize, setScreenSize] = useState<ScreenSize>('large');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 390) {
        setScreenSize('small');
      } else if (width > 390 && width <= 745) {
        setScreenSize('medium');
      } else {
        setScreenSize('large');
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return {
    screenSize,
    isSmallScreen: screenSize === 'small',
    isMediumScreen: screenSize === 'medium',
    isLargeScreen: screenSize === 'large',
  };
}

export default useScreenSize;
