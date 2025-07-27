import React from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import media from '../../../styles/media';
import promotion1 from '../../../assets/homePage/promotion1.svg';
import promotion2 from '../../../assets/homePage/promotion2.svg';
import promotion3 from '../../../assets/homePage/promotion3.svg';

function AdBanner() {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1500,
    autoplaySpeed: 4000,
    centerMode: true,
    centerPadding: '20%',
    cssEase: 'ease',
    responsive: [
      {
        breakpoint: 744, // 744px 이하일 때 적용됨
        settings: {
          centerPadding: '0%',
        },
      },
      {
        breakpoint: 390,
        settings: {
          centerPadding: '0%',
          dots: false,
        },
      },
    ],
  };

  return (
    <Wrapper>
      <Slider {...settings}>
        <div>
          <AdBox>
            <AdImage src={promotion3} alt="프로모션 3" />
          </AdBox>
        </div>
        <div>
          <AdBox>
            <AdImage src={promotion1} alt="프로모션 1" />
          </AdBox>
        </div>
        <div>
          <AdBox>
            <AdImage src={promotion2} alt="프로모션 2" />
          </AdBox>
        </div>
      </Slider>
    </Wrapper>
  );
}

export default AdBanner;

const Wrapper = styled.div`
  width: 1440px;
  height: 396px;
  margin: 39px auto 61px auto;
  box-sizing: content-box;
  overflow: hidden;
  background-color: white;

  .slick-slide {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .slick-dots {
    bottom: -27px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 8px;

    .slick-active button::before {
      color: #c908ff; /* 선택된 점의 색상 */
      font-size: 8px;
    }

    button::before {
      color: rgba(201, 8, 255, 0.2); /* 선택되지 않은 점의 색상 */
      font-size: 8px;
    }
  }
  ${media.medium`
  width:100%;
  margin: 39px 0 61px 0;
  `}
`;

const AdBox = styled.div`
  width: 825px;
  height: 369px;
  flex-shrink: 0;
  margin: 0 23px;
  border-radius: 31px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e4e4e4;
  ${media.medium`
  width:100%;
  border-radius: 0px;
  `}
`;

const AdImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
