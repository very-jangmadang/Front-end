import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import BigTitle from '../../components/BigTitle';
import SmallTitle from '../../components/SmallTitle';
import axiosInstance from '../../apis/axiosInstance';

const Payment: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('7d');
  const [combinedHistory, setCombinedHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPaymentHistory = async () => {
    setLoading(true);
    try {
      const [chargeRes, exchangeRes] = await Promise.all([
        axiosInstance.get(
          `/api/member/payment/history/charge?period=${selectedTab}`,
        ),
        axiosInstance.get(
          `/api/member/payment/history/exchange?period=${selectedTab}`,
        ),
      ]);

      let chargeData = chargeRes.data.isSuccess ? chargeRes.data.result : [];
      console.log('충전 data:', chargeData);
      let exchangeData = exchangeRes.data.isSuccess
        ? exchangeRes.data.result
        : [];

      // ✅ 날짜 + 시간 변환 함수
      const formatDateTime = (dateString?: string) => {
        if (!dateString) {
          return {
            formattedDate: '-',
            timestamp: 0,
          };
        }

        // 마이크로초 제거
        const normalized = dateString.replace(/\.\d+$/, '');
        const date = new Date(normalized);

        if (isNaN(date.getTime())) {
          return {
            formattedDate: '-',
            timestamp: 0,
          };
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return {
          formattedDate: `${year}-${month}-${day} ${hours}시 ${minutes}분`,
          timestamp: date.getTime(),
        };
      };

      // ✅ 충전 데이터 가공
      chargeData = chargeData.map((item: any) => {
        const { formattedDate, timestamp } = formatDateTime(item.confirmedAt);
        return {
          ...item,
          date: formattedDate, // ✅ 날짜 + 시간 표시
          timestamp, // ✅ 정렬을 위한 timestamp 추가
          type: '충전',
          amount: item.amount * 100, // ✅ 금액 100배 변환
          user_ticket: item.amount, // ✅ 충전한 티켓 수량
        };
      });

      // ✅ 환전 데이터 가공
      exchangeData = exchangeData.map((item: any) => {
        const { formattedDate, timestamp } = formatDateTime(item.exchangedDate);
        return {
          ...item,
          date: formattedDate, // ✅ 날짜 + 시간 표시
          timestamp, // ✅ 정렬을 위한 timestamp 추가
          type: '환전',
          amount: item.amount * 100, // ✅ 금액 100배 변환
          user_ticket: item.amount, // ✅ 환전한 티켓 수량
        };
      });

      // ✅ 최신순 정렬 (timestamp 기준으로 내림차순 정렬)
      const mergedData = [...chargeData, ...exchangeData].sort(
        (a, b) => b.timestamp - a.timestamp, // ✅ 최신순 정렬 유지
      );

      setCombinedHistory(mergedData);
    } catch (error) {
      console.error('내역 조회 중 오류 발생:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, [selectedTab]);

  return (
    <Container>
      <TitleWrapper>
        <BigTitle>충전/환전 내역 조회하기</BigTitle>
      </TitleWrapper>

      <Section2>
        <TabContainer>
          {['7d', '1m', '3m', '6m'].map((tab) => (
            <Tab key={tab}>
              <TabInner
                isActive={selectedTab === tab}
                onClick={() => setSelectedTab(tab)}
              >
                {tab === '7d'
                  ? '1주일'
                  : tab === '1m'
                    ? '한 달'
                    : tab === '3m'
                      ? '3개월'
                      : '6개월'}
              </TabInner>
            </Tab>
          ))}
        </TabContainer>

        {loading ? (
          <LoadingMessage>내역을 불러오는 중...</LoadingMessage>
        ) : (
          <>
            <Table>
              <thead>
                <TableRow>
                  <TableHeader>구분</TableHeader>
                  <TableHeader>일자</TableHeader>
                  <TableHeader>수량</TableHeader>
                  <TableHeader>수단</TableHeader>
                  <TableHeader>금액</TableHeader>
                </TableRow>
              </thead>
              <tbody>
                {combinedHistory.length > 0 ? (
                  combinedHistory.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.user_ticket}개</TableCell>
                      <TableCell>
                        {item.paymentMethod || item.exchangeMethod}
                      </TableCell>
                      <TableCell>{item.amount}원</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5}>내역이 없습니다.</TableCell>
                  </TableRow>
                )}
              </tbody>
            </Table>
          </>
        )}
      </Section2>
    </Container>
  );
};

export default Payment;

const LoadingMessage = styled.div`
  font-size: 18px;
  margin-top: 20px;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  text-align: center;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 64px;
`;

const TitleWrapper = styled.div`
  z-index: 10;
`;

const Section2 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 66px;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 488px;
  height: 71px;
  background: #f5f5f5;
  border-radius: 8px;
`;

const Tab = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 135px;
  height: 71px;
  background: #f5f5f5;
  border-radius: 7px;
`;

const TabInner = styled.button<{ isActive: boolean }>`
  width: 103px;
  height: 53px;
  flex-shrink: 0;
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 600;
  color: ${({ isActive }) => (isActive ? '#c908ff' : '#8f8e94')};
  background: ${({ isActive }) => (isActive ? '#ffffff' : '#f5f5f5')};
  border: none;
  border-radius: 7px;
  cursor: pointer;

  &:hover {
    background-color: #ffffff;
    color: #c908ff;
  }
`;

const Table = styled.table`
  width: 100%; /* ✅ 너비를 100%로 설정하여 더 넉넉하게 */
  max-width: 1080px; /* ✅ 최대 너비를 설정하여 가독성을 유지 */
  border-collapse: collapse;
  margin-top: 60px;
  text-align: center;
  margin-bottom: 300px;
`;

const TableHeader = styled.th`
  text-align: center;
  padding: 16px; /* ✅ 패딩 증가 */
  color: #8f8e94;
  font-family: Pretendard;
  font-size: 24px;
  font-weight: 600;
  line-height: 40px; /* ✅ 줄 높이 증가 */
  border-bottom: 2px solid #8f8e94;
`;

const TableCell = styled.td`
  text-align: center;
  padding: 16px; /* ✅ 패딩 증가 */
  color: #000;
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 400;
  line-height: 40px; /* ✅ 줄 높이 증가 */
  border-bottom: 1px solid #e4e4e4;
  white-space: nowrap; /* ✅ 텍스트가 줄 바꿈되지 않도록 설정 */
  overflow: hidden;
  text-overflow: ellipsis; /* ✅ 너무 긴 경우 말줄임표(...) 추가 */
`;

const TableRow = styled.tr`
  height: 60px; /* ✅ 행 높이를 증가시켜 더 넉넉하게 */
`;
