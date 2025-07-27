import styled from 'styled-components';
import BigTitle from '../../components/BigTitle';
import { useEffect, useState } from 'react';
import media from '../../styles/media';
import axiosInstance from '../../apis/axiosInstance';

const SetOpenInfoPage = () => {
  const [toggle, setToggle] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const getInfo = async () => {
    const { data } = await axiosInstance.get('/api/member/mypage/secretInfo');
    console.log('GET:', data.result);
    setToggle(data.result);
  };

  const handleToggle = () => {
    const patchInfo = async () => {
      await axiosInstance
        .patch('/api/member/mypage/secretInfo', !toggle, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((_) => getInfo());
    };
    if (!isLoaded) setIsLoaded(true);
    patchInfo();
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <Wrapper>
      <BigTitle>공개 정보 설정</BigTitle>
      <Box>
        <ToggleBox>
          <RoundDiv />
          <Span>팔로워 수 공개</Span>
        </ToggleBox>
        <div>
          <Input type="checkbox" id="toggle" />
          <ToggleLabel
            htmlFor="toggle"
            $checked={toggle}
            $loaded={isLoaded}
            onClick={handleToggle}
          />
        </div>
      </Box>
    </Wrapper>
  );
};

export default SetOpenInfoPage;

const Wrapper = styled.div`
  padding-top: 63px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// const Container = styled.div`
//   // padding-top: 63px;
// `;

const Box = styled.div`
  padding-top: 63px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 847px;

  ${media.medium`
    width: 628px;
  `}
  ${media.small`
    width: 342px;
    padding-top: 48px;
    padding-right: 14px;
    `}
`;

const RoundDiv = styled.div`
  width: 14px;
  height: 14px;
  background-color: rgba(201, 8, 255, 0.2);
  border-radius: 100%;
  margin-right: 67px;
  ${media.small`
    margin-right: 31px;
  `}
`;

const Span = styled.span`
  display: inline-block;
  width: 200px;
  color: #000;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const ToggleBox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 3px;
`;

const Input = styled.input`
  display: none;
`;

const ToggleLabel = styled.label<{
  $checked: boolean | null;
  $loaded: boolean;
}>`
  display: flex;
  align-items: center;
  position: relative;
  width: 54px;
  height: 24.856px;
  border-radius: 18px;
  background-color: ${(props) => (props.$checked ? '#C908FF' : '#C1C1C1')};
  box-sizing: border-box;
  cursor: pointer;
  opacity: ${(props) => (props.$checked === null ? 0 : 1)};
  transition: 'opacity 0.3s ease-in-out';

  &::before {
    content: '';
    position: absolute;
    top: 2.5px;
    right: 3px;
    width: 20px;
    height: 20px;
    background-color: #fff;
    border-radius: 100%;
    left: ${(props) => (props.$checked ? '2px' : 'calc(100% - 22px)')};
    // transition: left 0.3s ease;
    transition: ${(props) => (props.$loaded ? 'left 0.3s ease' : 'none')};
  }
  &::after {
    ${(props) =>
      props.$checked
        ? `content: "ON";
        right: 8px;`
        : `content: "OFF";
        left: 5px`};
    position: absolute;
    color: white;
    color: #fff;
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
`;
