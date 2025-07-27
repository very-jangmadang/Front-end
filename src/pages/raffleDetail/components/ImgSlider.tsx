import React, { useState } from 'react';
import { ReactNode } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import icRight from '../../../assets/raffleDetail/icon-right.svg';
import icLeft from '../../../assets/raffleDetail/icon-left.svg';
import media from '../../../styles/media';

interface ItemProps {
  images: string[];
  name: string;
  children?: ReactNode;
  onImageClick?: (index: number) => void;
  isModal?: boolean;
  initialIndex?: number;
}

function ImgSlider({
  images,
  name,
  children,
  onImageClick,
  isModal,
  initialIndex,
}: ItemProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = (images ?? []).length;
  const lastSlide = totalSlides - 1;
  const totalDots = Math.min(totalSlides, 3);
  const lastDotIndex = totalDots - 1;

  const getActiveDot = () => {
    if (currentSlide === 0) return 0;
    if (currentSlide === lastSlide) return lastDotIndex;
    return totalDots === 2 ? 1 : 1;
  };

  const settings = {
    centerMode: false,
    dots: true,
    infinite: totalSlides > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <CustomNextArrow isModal={isModal} />,
    prevArrow: <CustomPrevArrow isModal={isModal} />,
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    appendDots: () => {
      const totalDots = Math.min(images.length, 3);
      return (
        <CustomDots>
          {Array.from({ length: totalDots }, (_, dotIndex) => (
            <li
              key={dotIndex}
              className={dotIndex === getActiveDot() ? 'active' : ''}
            />
          ))}
        </CustomDots>
      );
    },
    customPaging: () => <button style={{ display: 'none' }} />,
  };

  const GlobalStyle = createGlobalStyle`
    .slick-prev, .slick-next {
      display: none !important;
    }
  `;

  return (
    <Wrapper $isModal={isModal}>
      <GlobalStyle />
      <Slider {...settings}>
        {(images ?? []).map((image, index) => (
          <ImgContainer
            key={index}
            $isModal={isModal}
            onClick={() => onImageClick?.(index)}
          >
            <Img
              src={image}
              alt={`${name} - 이미지 ${index + 1}`}
              $isModal={isModal}
            />
            <Overlay>{children}</Overlay>
          </ImgContainer>
        ))}
      </Slider>
    </Wrapper>
  );
}

export default ImgSlider;

const CustomNextArrow = (props: any) => {
  const { onClick, isModal } = props;
  return (
    <ArrowRight onClick={onClick} $isModal={isModal}>
      <img src={icRight} alt="next" />
    </ArrowRight>
  );
};

const CustomPrevArrow = (props: any) => {
  const { onClick, isModal } = props;
  return (
    <ArrowLeft onClick={onClick} $isModal={isModal}>
      <img src={icLeft} alt="prev" />
    </ArrowLeft>
  );
};

const Wrapper = styled.div<{ $isModal?: boolean }>`
  width: ${({ $isModal }) => ($isModal ? '800px' : '390.582px')};
  max-width: 100%;
  position: relative;
`;

const ImgContainer = styled.div<{ $isModal?: boolean }>`
  position: relative;
  width: ${({ $isModal }) => ($isModal ? '800px' : '390.582px')};
  height: ${({ $isModal }) => ($isModal ? '800px' : '390.582px')};
  display: flex;

  ${media.medium`
    width: ${({ $isModal }) => ($isModal ? '90vw' : '390.582px')};
    height: ${({ $isModal }) => ($isModal ? '90vw' : '390.582px')};
  `}
`;

const Overlay = styled.div`
  position: absolute; /* ✅ 이미지 위 덮기 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: none; // 클릭 막고 싶으면 유지
`;

const Img = styled.img<{ $isModal?: boolean }>`
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background: #f7f7f7;
  object-fit: contain;
`;

const CustomDots = styled.ul`
  bottom: -34.43px;
  display: flex;
  justify-content: center;

  li {
    width: 10px;
    height: 10px;
    margin: 0 10px;
    border-radius: 50%;
    background-color: rgba(201, 8, 255, 0.2);
    transition: background-color 0.3s;

    &.active {
      background-color: #c908ff;
    }
  }
`;

const ArrowRight = styled.button<{ $isModal?: boolean }>`
  position: absolute;
  top: ${({ $isModal }) => ($isModal ? '380px' : '185px')};
  right: 14px;
  z-index: 99;
  background: none;
  border: none;
  cursor: pointer;
`;

const ArrowLeft = styled.button<{ $isModal?: boolean }>`
  position: absolute;
  top: ${({ $isModal }) => ($isModal ? '380px' : '185px')};
  left: 14px;
  z-index: 99;
  background: none;
  border: none;
  cursor: pointer;
`;
