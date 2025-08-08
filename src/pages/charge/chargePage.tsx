import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabPage from './components/tab/TabPage';
import useScreenSize from '../../styles/useScreenSize';
import media from '../../styles/media';
import { useNavigate } from 'react-router-dom';
import { useModalContext } from '../../components/Modal/context/ModalContext';
import ChargeOkModal from './components/modal/ChargeOkModal';
import WepinInitializer from '../../components/Wepin/WepinInitializer';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function ChargePage() {
  const [value, setValue] = React.useState(0);
  const { isSmallScreen, isMediumScreen, isLargeScreen } = useScreenSize();
  const navigate = useNavigate();
  const { openModal } = useModalContext();
  const queryParams = new URLSearchParams(location.search);
  const approvedAt = queryParams.get('approvedAt');

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (!approvedAt) return;

    if (approvedAt) {
      const timer = setTimeout(() => {
        openModal(({ onClose }) => <ChargeOkModal onClose={onClose} />);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <Container>
      <WepinInitializer />
      {isLargeScreen && (
        <>
          <TitleBox>
            <Titles>
              <Dot />
              <Title>티켓 충전/환전</Title>
            </Titles>
            <CheckBox onClick={() => navigate('/mypage/payment')}>
              <Short>충전/ 환전 내역 조회하기</Short>
              <Icon
                icon="weui:arrow-outlined"
                style={{
                  width: '23px',
                  height: '25px',
                  cursor: 'pointer',
                  color: '#8F8E94',
                }}
              />
            </CheckBox>
          </TitleBox>
          <Line />
        </>
      )}

      <Boxs>
        <Box sx={{ width: '100%' }}>
          <Box
            sx={{
              width: '100%',
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Tabs
              sx={{
                width: '100%',
                display: 'flex',
                flexWrap: 'nowrap',
                '& .MuiTabs-flexContainer': {
                  justifyContent: 'space-between',
                },
                '& .MuiTabs-indicator': { backgroundColor: '#C908FF' },
              }}
              value={value}
              onChange={handleChange}
              textColor="inherit"
              indicatorColor="secondary"
              aria-label="basic tabs example"
            >
              <Tab
                sx={{
                  width: '50%',
                  fontFamily: 'Pretendard',
                  fontSize: isSmallScreen ? '15px' : '20px',
                  fontWeight: '600',
                  lineHeight: '17.308px',
                  color: '#C908FF',
                  '&.Mui-selected': { color: '#C908FF' },
                }}
                label="티켓 충전"
                {...a11yProps(0)}
              />
              <Tab
                sx={{
                  width: '50%',
                  fontFamily: 'Pretendard',
                  fontSize: isSmallScreen ? '15px' : '20px',
                  fontWeight: '600',
                  lineHeight: '17.308px',
                  color: '#C908FF',
                  '&.Mui-selected': { color: '#C908FF' },
                }}
                label="티켓 환전"
                {...a11yProps(1)}
              />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <TabPage type={0} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <TabPage type={1} />
          </CustomTabPanel>
        </Box>
      </Boxs>
    </Container>
  );
}

const Boxs = styled.div`
  width: 858px;
  height: 740px;
  border-radius: 18px;
  border: 1px solid #c1c1c1;
  margin-bottom: 250px;
  padding-top: 15px;
  margin-top: 53px;
  ${media.medium`
    margin-top: 21px;
    width: 696px;
    height: 758px;
    margin-bottom: 166px;
    border: 0.7px solid #c1c1c1;
    `}
  ${media.small`
    width: 100%;
    max-width: 390px; 
    height: 100vh;
    border-radius: 0px;
    border: none;
    margin-bottom: 0px;
    padding: 0px;
    overflow-y: auto;
    overflow-x: hidden;

      `}
`;

const Line = styled.div`
  margin-top: 20px;
  width: 1080px;
  height: 1px;
  background-color: black;
`;

const CheckBox = styled.div`
  display: flex;
  column-gap: 30px;
  align-items: center;
  cursor: pointer;
`;

const Short = styled.div`
  color: #8f8e94;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
`;

const Title = styled.div`
  font-family: Pretendard;
  font-size: 22px;
  font-style: normal;
  font-weight: 600;
`;

const Dot = styled.div`
  width: 14px;
  height: 14px;
  background-color: #c908ff;
  border: #c908ff;
  border-radius: 100%;
`;

const Titles = styled.div`
  display: flex;
  column-gap: 50px;
  align-items: center;
`;

const TitleBox = styled.div`
  margin-top: 63px;
  width: 1080px;
  height: 53px;
  display: flex;
  justify-content: space-between;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;
`;
export default ChargePage;
