import React, { PropsWithChildren, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import { useModalContext } from './context/ModalContext';

export default function Modal({
  children,
  onClose,
}: PropsWithChildren<{ onClose: () => void }>) {
  const { clearModals } = useModalContext();

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return ReactDOM.createPortal(
    <ModalOverlay onClick={clearModals}>
      <ModalContent
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Icon
            icon={'ei:close-o'}
            style={{
              width: '30px',
              height: '30px',
              color: '#7D7D7D',
              transform: 'translateX(-14px)',
            }}
            onClick={onClose}
          />
        </div>
        <div onClick={(e) => e.stopPropagation()}>{children}</div>
      </ModalContent>
    </ModalOverlay>,
    document.getElementById('modal-root') as HTMLElement,
  );
}

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ModalContent = styled.div`
  display: flex;
  position: relative;
  width: 425px;
  height: auto;
  flex-direction: column;
  background-color: white;
  border-radius: 6px;
  padding-top: 14px;
  padding-bottom: 58px;
`;
