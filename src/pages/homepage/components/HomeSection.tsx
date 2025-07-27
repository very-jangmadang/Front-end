import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import moreList from '../../../assets/homePage/moreList.svg';
import SmallProductCard from '../../../components/SmallProductCard';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import RaffleProps from '../../../types/RaffleProps';
import media from '../../../styles/media';
import useScreenSize from '../../../styles/useScreenSize';

interface HomeSectionProps {
  title: string;
  icon: string;
  apiKey: string;
  moreLink: string;
  products: RaffleProps[];
}

const HomeSection: React.FC<HomeSectionProps> = ({
  title,
  icon,
  apiKey,
  moreLink,
  products,
}) => {
  const navigate = useNavigate();
  const { isSmallScreen, isMediumScreen, isLargeScreen } = useScreenSize();

  let displayedProducts = products;
  if (isSmallScreen) {
    displayedProducts = products.slice(0, 2);
  } else if (isMediumScreen) {
    displayedProducts = products.slice(0, 3);
  }
  return (
    <Wrapper>
      <HeaderContainer>
        <TextBox>
          <img src={icon} alt="icon" /> {title}
        </TextBox>
        <Link to={moreLink}>
          <MoreListBox>
            더보기
            <img src={moreList} alt="moreList" />
          </MoreListBox>
        </Link>
      </HeaderContainer>

      <ProductContainer>
        {displayedProducts.map((products) => (
          <SmallProductCard key={products.raffleId} {...products} />
        ))}
      </ProductContainer>
    </Wrapper>
  );
};

export default HomeSection;

const Wrapper = styled.div`
  width: 100%;
  height: 306px;
  margin-bottom: 65px;
`;

const HeaderContainer = styled.div`
  display: flex;
  height: 38px;
  margin-bottom: 11px;
  justify-content: space-between;
  align-items: center;
`;

const TextBox = styled.div`
  display: flex;
  gap: 23px;
  color: #000;
  font-family: Inter;
  font-size: 22px;
  font-weight: 600;
`;

const MoreListBox = styled.div`
  width: 240px;
  height: 34px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: #8f8e94;
  font-size: 16px;
  text-decoration: underline;
  cursor: pointer;

  img {
    width: 10px;
    height: 17px;
    margin-left: 35px;
  }
`;

const ProductContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  place-items: center;
  max-width: 1080px;
  gap: 30px;
  ${media.medium`
      grid-template-columns: repeat(3, 1fr);
      gap: 9px;
    `}
  ${media.small`
      grid-template-columns: repeat(2, 1fr);
      gap: 3px;
    `};
`;
