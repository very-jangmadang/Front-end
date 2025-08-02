import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import media from '../../../styles/media';

// 로딩 스피너 컴포넌트
const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '369px',
    backgroundColor: '#f5f5f5'
  }}>
    <div>로딩 중...</div>
  </div>
);

function AdBanner() {
  const [images, setImages] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // public 폴더의 SVG 파일들을 사용하여 Babel 경고 방지
    const loadImages = async () => {
      try {
        // public 폴더의 이미지 URL (빌드 시 정적 파일로 처리됨)
        const imageUrls = {
          promotion1: '/assets/homePage/promotion1.svg',
          promotion2: '/assets/homePage/promotion2.svg',
          promotion3: '/assets/homePage/promotion3.svg'
        };

        // 이미지가 실제로 존재하는지 확인
        const checkImage = (url: string): Promise<string> => {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(url);
            img.onerror = () => {
              console.warn(`이미지를 로드할 수 없습니다: ${url}`);
              // 폴백 이미지 또는 빈 문자열 반환
              resolve('');
            };
            img.src = url;
          });
        };

        const loadedImages = await Promise.all([
          checkImage(imageUrls.promotion1),
          checkImage(imageUrls.promotion2),
          checkImage(imageUrls.promotion3)
        ]);

        setImages({
          promotion1: loadedImages[0],
          promotion2: loadedImages[1],
          promotion3: loadedImages[2]
        });
      } catch (error) {
        console.error('이미지 로딩 실패:', error);
        // 에러 발생 시 빈 객체로 설정
        setImages({});
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1500,
    autoplaySpeed: 3000,
    centerMode: false,      // 중앙 모드 해제
    centerPadding: '0%',   // 패딩 없음
    cssEase: 'ease',
    responsive: [
      {
        breakpoint: 744,
        settings: {
          centerMode: false,
          centerPadding: '0%',
        },
      },
      {
        breakpoint: 390,
        settings: {
          centerMode: false,
          centerPadding: '0%',
          dots: false,
        },
      },
    ],
  };

  if (isLoading) {
    return (
      <Wrapper>
        <LoadingSpinner />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Slider {...settings}>
        <div>
          <AdBox>
            <AdImage src={images.promotion3} alt="프로모션 3" />
          </AdBox>
        </div>
        <div>
          <AdBox>
            <AdImage src={images.promotion1} alt="프로모션 1" />
          </AdBox>
        </div>
        <div>
          <AdBox>
            <AdImage src={images.promotion2} alt="프로모션 2" />
          </AdBox>
        </div>
      </Slider>
    </Wrapper>
  );
}

export default AdBanner;

const Wrapper = styled.div`
  width: 100%;
  max-width: 1440px;
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
    width: 100%;
    max-width: 100%;
    margin: 39px 0 61px 0;
  `}
`;

const AdBox = styled.div`
  width: 59.375rem;   // 950px
  height: 23.0625rem; // 369px
  flex-shrink: 0;
  border-radius: 31px;
  overflow: visible;  // 잘리지 않게!
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e4e4e4;
  ${media.medium`
    width: 100%;
    height: auto;
    border-radius: 0px;
  `}
`;

const AdImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  background: #fff;
`;
