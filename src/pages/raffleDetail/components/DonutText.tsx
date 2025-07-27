import React from 'react';
import styled from 'styled-components';

type DonutTextProps = {
  text: string;
};

const DonutText = ({ text }: DonutTextProps) => {
  return (
    <Wrapper>
      <SVG viewBox="0 0 166.396 166.396">
        {/* 바깥 원 */}
        <Circle cx="83.198" cy="83.198" r="75" />
        {/* 텍스트 */}
        <StyledText x="50%" y="50%" textAnchor="middle" dy=".3em">
          {text}
        </StyledText>
      </SVG>
    </Wrapper>
  );
};

export default DonutText;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 166.396px;
  height: 166.396px;
`;

// SVG 컨테이너
const SVG = styled.svg`
  width: 100%;
  height: 100%;
`;

// 원 스타일
const Circle = styled.circle`
  stroke: #e4e4e4;
  stroke-width: 17;
  fill: none;
`;

// 텍스트 스타일
const StyledText = styled.text`
  fill: #8f8e94;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%;
  text-align: center;
`;
