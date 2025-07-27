import React, { ReactNode } from "react";
import styled from "styled-components";

interface SmallTitleProps {
  children: ReactNode;
  onClick?: () => void; // ✅ onClick prop 추가
}

const SmallTitle: React.FC<SmallTitleProps> = ({ children, onClick }) => {
  return (
    <SmallTitleBox onClick={onClick}>
      <SmallTitleIcon />
      {children}
    </SmallTitleBox>
  );
};

export default SmallTitle;

const SmallTitleBox = styled.div`
width: fit-content;
min-width: 150px; /* ✅ 최소 너비 설정 */
height: 21px;
display: flex;
align-items: center;
color: #000;
font-family: Pretendard;
font-size: 20px;
font-style: normal;
font-weight: 600;
position: relative;
transition: font-size 0.3s ease, margin 0.3s ease;

&:hover {
  color: #c908ff;
}
`;

const SmallTitleIcon = styled.span`
display: inline-block;
width: 14px;
height: 14px;
background-color: rgba(201, 8, 255, 0.2);
border-radius: 50%;
margin-right: 52px;
transition: margin 0.3s ease;

@media (max-width: 1024px) { /* 태블릿 */
  margin-right: 40px;
}

@media (max-width: 768px) { /* 스마트폰 가로 */
  margin-right: 30px;
}

@media (max-width: 480px) { /* 스마트폰 세로 */
  margin-right: 20px;
}
`;
