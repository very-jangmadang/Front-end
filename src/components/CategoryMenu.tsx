import { Category } from '@mui/icons-material';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const categories: { [key: string]: string } = {
  women: '여성의류',
  men: '남성의류',
  shoes: '신발',
  accessories: '악세서리',
  digital: '디지털',
  appliances: '가전제품',
  sports: '스포츠/레저',
  vehicle: '차량/오토바이',
  md: '굿즈',
  art: '예술/희귀/수집품',
  music: '음반/악기',
  stationery: '도서/티켓/문구',
  beauty: '뷰티',
  interior: '인테리어',
  household: '생활용품',
  tools: '공구/산업용품',
  grocery: '식품',
  infant: '유아',
  pet: '반려동물',
  others: '기타',
  talent: '재능',
};

const CategoryMenu = () => {
  const navigate = useNavigate();
  const [presentCategory, setPresentCategory] = useState<string>('');

  const handleCategoryClick = (category: string, label:string) => {
    setPresentCategory(label);
    navigate(`/categories/${category}`);
  };

  console.log('???', presentCategory)

  return (
    <DropDownPosition>
      <CategoryUl>
        <CategoryName>전체 카테고리</CategoryName>
        {Object.entries(categories).map(([category, label]) => (
          <CategoryLi
            key={category}
            onClick={() => handleCategoryClick(category, label)}
            color={presentCategory===label?'#C908FF':'#000'}
          >
            {label}
          </CategoryLi>
        ))}
      </CategoryUl>
    </DropDownPosition>
  );
};

export default CategoryMenu;

const DropDownPosition = styled.div`
  position: absolute;
  top: 45px;
  left: -65px;
  overflow: hidden;
`;

const CategoryUl = styled.ul`
  width: 200px;
  @keyframes dropdown {
    0% {
      transform: translateY(-10%);
    }
    100% {
      transform: translateY(0);
    }
  }
  animation: dropdown 0.5s ease;
`;

const CategoryName = styled.li`
  list-style: none;
  height: 36px;
  border: 1px solid #8f8e94;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 15px;
  font-size: 15.5px;
  font-weight: 700;
  color: #000;
  font-family: Pretendard;
  font-style: normal;
  line-height: 45px; /* 204.545% */
  letter-spacing: -0.165px;
  &:hover {
    cursor: default;
  }
`;

const CategoryLi = styled.li<{color:string}>`
  list-style: none;
  height: 36px;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 4px 0 0 15px;
  font-size: 14px;
  font-weight: 400;
  color: ${props => props.color};
  font-family: Pretendard;
  font-style: normal;
  line-height: 45px; /* 204.545% */
  letter-spacing: -0.165px;
  &:hover {
    cursor: pointer;
    border: 1px solid #c908ff;
  }
`;
