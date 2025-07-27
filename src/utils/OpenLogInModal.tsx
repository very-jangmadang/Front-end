import React from 'react';
import { useModalContext } from '../components/Modal/context/ModalContext';
import LogInModal from '../pages/login/components/LogInModal';

export const OpenLogInModal = () => {
  const { openModal } = useModalContext();

  const handleOpenModal = () => {
    openModal(({ onClose }) => <LogInModal onClose={onClose} />);
  };

  return handleOpenModal;
};
