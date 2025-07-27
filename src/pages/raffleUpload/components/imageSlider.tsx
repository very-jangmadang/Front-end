import React, { useState } from 'react';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import icRight from '../../../assets/raffleDetail/icon-right.svg';
import icLeft from '../../../assets/raffleDetail/icon-left.svg';

interface ItemProps {
  images: string[];
  children?: ReactNode;
}

function ImgSlider({ images, children }: ItemProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = (images ?? []).length;
  const lastSlide = totalSlides - 1;
  const totalDots = Math.min(totalSlides, 3);
  const lastDotIndex = totalDots - 1;

  const getActiveDot = () => {
    if (currentSlide === 0) return 0; // 첫 번째 dot 선택
    if (currentSlide === lastSlide) return lastDotIndex; // 마지막 dot 선택
    return 1; // 중간 dot 선택
  };

  const settings = {
    centerMode: false,
    dots: true,
    infinite: totalSlides > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
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
    display: none !important;  // 기본 화살표 숨기기
  }
`;

  return (
    <Wrapper>
      <GlobalStyle />
      <ChildrenWrapper>{children}</ChildrenWrapper>
      <Slider {...settings}>
        {(images ?? []).map((image, index) => (
          <ImgContainer key={index}>
            <Img src={image} alt={`${name} - 이미지 ${index + 1}`} />
          </ImgContainer>
        ))}
      </Slider>
    </Wrapper>
  );
}

export default ImgSlider;

const CustomNextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <ArrowRight onClick={onClick}>
      <img src={icRight} alt="next" />
    </ArrowRight>
  );
};

const CustomPrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <ArrowLeft onClick={onClick}>
      <img src={icLeft} alt="prev" />
    </ArrowLeft>
  );
};

const Wrapper = styled.div`
  width: 261px;
  position: relative;
`;

const CustomDots = styled.ul`
  bottom: -21px;
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

const ImgContainer = styled.div`
  width: 261px;
  height: 261px;
  display: flex;
`;

const ChildrenWrapper = styled.div`
  position: absolute;
  width: 250px;
  height: 250px;
  z-index: 8;
  opacity: 0;
`;

const Img = styled.img`
  width: 261px;
  height: 261px;
  border-radius: 5px;
`;

const ArrowRight = styled.button`
  position: absolute;
  top: 50%;
  right: -25px;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
`;

const ArrowLeft = styled.button`
  position: absolute;
  top: 50%;
  left: -25px;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
`;
