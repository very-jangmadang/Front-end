import {
  createContext,
  FunctionComponent,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';

interface IModalState {
  modals: FunctionComponent<{ onClose: () => void }>[];
}

type TModalAction = {
  openModal: (modal: FunctionComponent<{ onClose: () => void }>) => void;
  closeModal: (index: number) => void;
  clearModals: () => void;
};

type ModalContextType = IModalState & TModalAction;

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalContextProvider: FunctionComponent<{
  children: ReactNode;
}> = ({ children }) => {
  const [modals, setModals] = useState<IModalState['modals']>([]);

  const openModal = (modal: FunctionComponent<{ onClose: () => void }>) => {
    setModals((prevModals) => [...prevModals, modal]);
  };

  const closeModal = (index: number) => {
    setModals((prevModals) => prevModals.filter((_, i) => i !== index));
  };

  const clearModals = useCallback(() => {
    setModals([]);
  }, []);

  return (
    <ModalContext.Provider
      value={{ modals, openModal, closeModal, clearModals }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error(
      'useModalContext must be used within a ModalContextProvider',
    );
  }

  return context;
};
