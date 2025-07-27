import React, { useState } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import media from '../../../styles/media';
import useScreenSize from '../../../styles/useScreenSize';

interface IReplay {
  timestamp: string;
  content: string;
  title: string;
}

interface IAnswerItem {
  nickname: string;
  inquiryContent: string;
  timestamp: string;
  status: string;
  inquiryId: number;
  inquiryTitle: string;
  comments: IReplay[];
}

interface IAnsweredProps {
  list: IAnswerItem[];
  type: number;
}

const AnswerBox: React.FC<IAnsweredProps> = ({ list, type }) => {
  const [openQuestion, setOpenQuestion] = useState(false);
  const [openReply, setOpenReply] = useState(false);
  const { isLargeScreen, isMediumScreen } = useScreenSize();

  const handleOpenQuestion = () => {
    setOpenQuestion((prev) => !prev);
  };

  const handleOpenReply = () => {
    setOpenReply((prev) => !prev);
  };

  const truncateText = (text?: string) => {
    if (!text) return '';
    return text.length > 100 ? text.slice(0, 100) + '...' : text;
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 2자리로 맞추기
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}.${month}.${day}(${hours}:${minutes})`;
  };

  console.log('list', list);

  return (
    <MapContainer>
      {list.map((inquiry) => (
        <Container key={inquiry.inquiryId}>
          <Box>
            <TitleContainer>
              <LeftSection>
                <Name>{inquiry.nickname}</Name>
                <Title>{inquiry.inquiryTitle}</Title>
              </LeftSection>
              {isLargeScreen && <Time>{formatDate(inquiry.timestamp)}</Time>}
            </TitleContainer>
            <ContentBox>
              {openQuestion === false ? (
                <Content>{truncateText(inquiry.inquiryContent)}</Content>
              ) : (
                <Content>{inquiry.inquiryContent}</Content>
              )}

              {inquiry.inquiryContent.length > 100 &&
                (openQuestion === false ? (
                  <Icon
                    onClick={handleOpenQuestion}
                    icon={'material-symbols:arrow-left-rounded'}
                    style={{
                      width: '35px',
                      height: '35px',
                      color: '#8F8E94',
                      transform: 'translateY(6px)',
                    }}
                  />
                ) : (
                  <Icon
                    onClick={handleOpenQuestion}
                    icon={'iconamoon:arrow-up-2-fill'}
                    style={{
                      width: '25px',
                      height: '25px',
                      color: '#8F8E94',
                      transform: 'translateY(6px)',
                    }}
                  />
                ))}
            </ContentBox>
            {isMediumScreen && (
              <Time style={{ marginLeft: '85px', marginBottom: '0' }}>
                {formatDate(inquiry.timestamp)}
              </Time>
            )}
          </Box>
          {type === 1 && (
            <Box style={{ backgroundColor: '#F5F5F5', borderTop: 'none' }}>
              <TitleContainer>
                <LeftSection>
                  <Name>개최자</Name>
                  <Title>{inquiry.comments[0].title}</Title>
                </LeftSection>
                {isLargeScreen && (
                  <Time>{formatDate(inquiry.comments[0].timestamp)}</Time>
                )}
              </TitleContainer>
              <ContentBox>
                {openReply === false ? (
                  <Content>{truncateText(inquiry.comments[0].content)}</Content>
                ) : (
                  <Content>{inquiry.comments[0].content}</Content>
                )}
                {inquiry.inquiryContent.length > 100 &&
                  (openReply === false ? (
                    <Icon
                      onClick={handleOpenReply}
                      icon={'material-symbols:arrow-left-rounded'}
                      style={{
                        width: '35px',
                        height: '35px',
                        color: '#8F8E94',
                        transform: 'translateY(6px)',
                      }}
                    />
                  ) : (
                    <Icon
                      onClick={handleOpenReply}
                      icon={'iconamoon:arrow-up-2-fill'}
                      style={{
                        width: '25px',
                        height: '25px',
                        color: '#8F8E94',
                        transform: 'translateY(6px)',
                      }}
                    />
                  ))}
              </ContentBox>
              {isMediumScreen && (
                <Time style={{ marginLeft: '85px', marginBottom: '0' }}>
                  {formatDate(inquiry.comments[0].timestamp)}
                </Time>
              )}
            </Box>
          )}
        </Container>
      ))}
    </MapContainer>
  );
};

const MapContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 28px;
`;

const ContentBox = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const Content = styled.div`
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  width: 720px;
  margin-left: 88px;
`;

const Time = styled.div`
  color: #8f8e94;
  font-family: Pretendard;
  font-size: 11px;
  font-weight: 700;
  line-height: 150%;
`;

const Title = styled.div`
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 500;
  line-height: 150%;
`;

const Name = styled.div`
  color: #c908ff;
  font-family: Pretendard;
  font-size: 14px;
  font-weight: 600;
  line-height: 150%;
  width: 71px;
  height: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  column-gap: 16px;
`;

const Container = styled.div`
  width: 100%;
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 12px;
  padding: 30px 22px;
  border-top: 1px solid #e4e4e4;
  ${media.notLarge`
    border-top: 1px solid #C908FF;
  `}
`;

export default AnswerBox;
