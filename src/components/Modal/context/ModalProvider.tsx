import React, { useEffect } from 'react';
import { useModalContext } from './ModalContext';
import { useLocation } from 'react-router-dom';

export default function ModalProvider() {
  const { modals, closeModal, clearModals } = useModalContext();

  const location = useLocation();

  useEffect(() => {
    clearModals();
  }, [location, clearModals]);

  return (
    <div>
      {modals.map((Modal, index) => (
        <Modal key={index} onClose={() => closeModal(index)} />
      ))}
    </div>
  );
}
