import { ReactNode } from 'react';
import styled from 'styled-components';
import media from '../styles/media';

const BigTitle = ({ children }: { children: ReactNode }) => {
  return (
    <BigTitleBox>
      <TitleIcon />
      {children}
    </BigTitleBox>
  );
};

export default BigTitle;

const BigTitleBox = styled.div`
  width: 1080px;
  height: 53px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid black;
  color: #000;
  font-family: Pretendard;
  font-size: 22px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  padding-bottom: 24px;
  box-sizing: border-box;
  position: relative;
  margin-left: 10px;
  margin-right: 10px;

  ${media.medium`
      width: 675px;
      margin: 0 14px;
  `}
  ${media.small`
      width: 342px;
      margin: 0 24px;
  `}
`;

const TitleIcon = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  background-color: #c908ff;
  border-radius: 50%;
  margin-right: 52px;

  ${media.small`
    margin-right: 30px;
  `}
`;
