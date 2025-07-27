import { useEffect } from 'react';
import { useModalContext } from '../../components/Modal/context/ModalContext';
import ConsentModal from '../login/components/ConsentModal';
import styled from 'styled-components';

function KakaoRedirect() {
  const { openModal } = useModalContext();

  useEffect(() => {
    console.log('KakaoRedirect useEffect 실행됨!');
    setTimeout(() => {
      openModal(({ onClose }) => <ConsentModal onClose={onClose} />);
    }, 100);
  }, []);

  return <Container></Container>;
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default KakaoRedirect;
