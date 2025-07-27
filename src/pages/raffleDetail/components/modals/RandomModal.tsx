import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import { useModalContext } from '../../../../components/Modal/context/ModalContext';
import Slider from 'react-slick';
import RandomOkModal from './RandomOkModal';

interface RandomModalProps {
  onClose: () => void;
  raffleId: number;
  nicknameSet: string[];
  winnerId: number;
  winnerNickname: string;
  win: boolean;
  deliveryId: number;
  image: string;
}

export default function RandomModal({
  onClose,
  raffleId,
  nicknameSet,
  winnerId,
  winnerNickname,
  win,
  deliveryId,
  image,
}: PropsWithChildren<RandomModalProps>) {
  const { clearModals } = useModalContext();
  const sliderRef = useRef<Slider | null>(null);
  const [items, setItems] = useState<string[]>([]);
  const [winner, setWinner] = useState<string>('');
  const [isRolling, setIsRolling] = useState(false);
  const [isWin, setIsWin] = useState<boolean>(false);
  const { openModal } = useModalContext();

  const handleAddName = () => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      newItems.splice(1, 0, '닉네임');
      return newItems;
    });
  };

  useEffect(() => {
    console.log('winner:', winner);
    setItems(nicknameSet);
    handleAddName();
    setWinner(winnerNickname);
    setIsWin(win);
  }, [deliveryId]);

  const handleClick = () => {
    if (!isRolling && winner && sliderRef.current) {
      setIsRolling(true);
      sliderRef.current.slickPlay();

      setTimeout(() => {
        const winnerIndex = items.length - 2;
        if (winnerIndex !== -1) {
          sliderRef.current?.slickGoTo(winnerIndex);
          setTimeout(() => sliderRef.current?.slickPause(), 500);
        }
        setIsRolling(false);
      }, 500);

      setTimeout(() => {
        openModal(({ onClose }) => (
          <RandomOkModal
            onClose={onClose}
            deliveryId={deliveryId}
            winnerNickname={winnerNickname}
            image={image}
            win={isWin}
            raffleId={raffleId}
          />
        ));
      }, 1500);
    }
  };

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: Math.min(3, items.length),
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    autoplay: false,
    arrows: false,
    speed: 600,
  };

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
              color: '#FFFFFF',
              transform: 'translateX(-14px)',
            }}
            onClick={onClose}
          />
        </div>
        <ContainerBox onClick={(e) => e.stopPropagation()}>
          <Container>
            <Slider ref={sliderRef} {...settings}>
              {items.map((nickname, index) => (
                <List key={index}>{nickname}</List>
              ))}
            </Slider>
            <Border />
          </Container>
          <Button onClick={handleClick}>Draw</Button>
        </ContainerBox>
      </ModalContent>
    </ModalOverlay>,
    document.getElementById('modal-root') as HTMLElement,
  );
}

const List = styled.div`
  color: #fff;
  text-align: center;
  font-family: Pretendard;
  font-size: 25px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%;
  height: 60px;
`;

const Border = styled.div`
  width: 229px;
  height: 60px;
  border-radius: 12px;
  border: 2px solid #faff00;
  background-color: transparent;
  position: absolute;
  top: 52px;
`;

const Button = styled.button`
  width: 302px;
  height: 39px;
  border-radius: 7px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #c908ff;
  border: none;

  font-family: Pretendard;
  font-size: 14px;
  font-weight: 700;
  line-height: 18px;
`;

const ContainerBox = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Container = styled.div`
  margin-top: 65px;
  height: 190px;
  width: 232px;
  margin-bottom: 100px;
  position: relative;
  display: flex;
  flex-direction: column;
  row-gap: 25px;
  color: #fff;
  justify-content: center;

  text-align: center;
  font-family: Pretendard;
  font-size: 25px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%;
  overflow: hidden;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
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
  background-color: #c908ff;
  border-radius: 6px;
  padding-top: 14px;
  padding-bottom: 58px;
`;
