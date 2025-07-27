import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import ResponsiveHeader from '../components/ResponsiveHeader';
const RootLayout = () => {
  return (
    <Wrapper>
      <ResponsiveHeader />
      <MainContent>
        <Outlet />
      </MainContent>
    </Wrapper>
  );
};

export default RootLayout;

const Wrapper = styled.div`
  // min-width: 1440px;
  display: flex;
  flex-direction: column;
  align-items: safe center;
  // justify-content: center;
`;

const MainContent = styled.main`
  max-width: 1080px;
  width: 100%;
  flex: 1;
`;
