import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  checkDomainAndCookies, 
  clearAllCookies, 
  clearSpecificCookies,
  clearCurrentDomainCookies,
  logAllCookies, 
  checkAuthCookies,
  getCookie,
  hasCookie,
  showCookieDebugInfo,
  checkDomainSeparation,
  diagnoseCrossDomainCookieIssue,
  testCrossDomainCookie,
  attemptCrossDomainCookieFix,
  optimizeCookieSettings,
  solveMultiDomainLogoutIssue,
  getBackendSessionRecommendations,
  preventAutoLoginAfterLogout,
  clearLogoutPrevention,
  ultraClearAllCookies,
  clearAllBrowserStorage,
  performCompleteLogout,
  forceServerLogout,
  performUltimateLogout
} from '../../utils/cookieUtils';
import axiosInstance from '../../apis/axiosInstance';

const CookieDebugPage: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<string>('');

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => prev + '\n' + new Date().toLocaleTimeString() + ': ' + info);
  };

  const handleCheckCookies = () => {
    addDebugInfo('=== 쿠키 상태 확인 ===');
    checkDomainAndCookies();
    addDebugInfo('콘솔에서 자세한 정보를 확인하세요.');
  };

  const handleClearCookies = () => {
    addDebugInfo('=== 모든 쿠키 삭제 ===');
    clearAllCookies();
    addDebugInfo('쿠키 삭제 완료');
  };

  const handleTestLogin = async () => {
    addDebugInfo('=== 로그인 상태 테스트 ===');
    try {
      const response = await axiosInstance.get('/api/permit/user-info', {
        withCredentials: true,
      });
      addDebugInfo(`로그인 상태: ${JSON.stringify(response.data)}`);
    } catch (error: any) {
      addDebugInfo(`로그인 테스트 실패: ${error.message}`);
    }
  };

  const handleTestLogout = async () => {
    addDebugInfo('=== 로그아웃 테스트 ===');
    try {
      const response = await axiosInstance.post('/api/permit/logout', {}, {
        withCredentials: true,
      });
      addDebugInfo(`로그아웃 결과: ${JSON.stringify(response.data)}`);
    } catch (error: any) {
      addDebugInfo(`로그아웃 테스트 실패: ${error.message}`);
    }
  };

  const handleCheckSpecificCookies = () => {
    addDebugInfo('=== 특정 쿠키 확인 ===');
    const accessToken = getCookie('access');
    const refreshToken = getCookie('refresh');
    addDebugInfo(`Access Token: ${accessToken ? '존재함' : '없음'}`);
    addDebugInfo(`Refresh Token: ${refreshToken ? '존재함' : '없음'}`);
  };

  const handleClearAuthCookies = () => {
    addDebugInfo('=== 인증 쿠키만 삭제 ===');
    clearSpecificCookies(['access', 'refresh']);
    addDebugInfo('인증 쿠키 삭제 완료');
  };

  const handleShowDebugInfo = () => {
    addDebugInfo('=== 디버깅 안내 ===');
    showCookieDebugInfo();
    addDebugInfo('콘솔에서 자세한 안내를 확인하세요.');
  };

  const handleForceLogout = async () => {
    addDebugInfo('=== 강제 로그아웃 테스트 ===');
    try {
      // 1. 서버 로그아웃
      const response = await axiosInstance.post('/api/permit/logout', {}, {
        withCredentials: true,
      });
      addDebugInfo(`서버 로그아웃: ${JSON.stringify(response.data)}`);
      
      // 2. 클라이언트 쿠키 삭제
      clearAllCookies();
      clearSpecificCookies(['access', 'refresh']);
      
      // 3. 상태 확인
      setTimeout(() => {
        addDebugInfo('강제 로그아웃 완료 - 페이지 새로고침 권장');
        window.location.reload();
      }, 1000);
      
    } catch (error: any) {
      addDebugInfo(`강제 로그아웃 실패: ${error.message}`);
    }
  };

  const handleClearCurrentDomainCookies = () => {
    addDebugInfo('=== 현재 도메인 쿠키만 삭제 ===');
    clearCurrentDomainCookies();
    addDebugInfo('현재 도메인 쿠키 삭제 완료');
  };

  const handleCheckDomainSeparation = () => {
    addDebugInfo('=== 도메인 분리 상태 확인 ===');
    checkDomainSeparation();
    addDebugInfo('콘솔에서 도메인 분리 상태를 확인하세요.');
  };

  const handleDiagnoseCrossDomain = () => {
    addDebugInfo('=== 크로스도메인 쿠키 문제 진단 ===');
    diagnoseCrossDomainCookieIssue();
    addDebugInfo('콘솔에서 크로스도메인 문제 진단 결과를 확인하세요.');
  };

  const handleTestCrossDomain = async () => {
    addDebugInfo('=== 크로스도메인 쿠키 테스트 ===');
    await testCrossDomainCookie();
    addDebugInfo('콘솔에서 크로스도메인 테스트 결과를 확인하세요.');
  };

  const handleAutoFixCrossDomain = async () => {
    addDebugInfo('=== 크로스도메인 쿠키 문제 자동 해결 시도 ===');
    await attemptCrossDomainCookieFix();
    addDebugInfo('콘솔에서 자동 해결 시도 결과를 확인하세요.');
  };

  const handleOptimizeCookieSettings = () => {
    addDebugInfo('=== 환경별 쿠키 설정 최적화 ===');
    optimizeCookieSettings();
    addDebugInfo('콘솔에서 환경별 최적화 권장사항을 확인하세요.');
  };

  const handleSolveMultiDomainLogout = async () => {
    addDebugInfo('=== 서버 하나에 도메인 두 개 연결 시 로그아웃 문제 해결 ===');
    await solveMultiDomainLogoutIssue();
    addDebugInfo('콘솔에서 다중 도메인 로그아웃 문제 해결 결과를 확인하세요.');
  };

  const handleGetBackendRecommendations = () => {
    addDebugInfo('=== 백엔드 세션 설정 권장사항 ===');
    getBackendSessionRecommendations();
    addDebugInfo('콘솔에서 백엔드 세션 설정 권장사항을 확인하세요.');
  };

  const handlePreventAutoLogin = () => {
    addDebugInfo('=== 로그아웃 후 자동 로그인 방지 설정 ===');
    preventAutoLoginAfterLogout();
    addDebugInfo('콘솔에서 자동 로그인 방지 설정 결과를 확인하세요.');
  };

  const handleClearLogoutPrevention = () => {
    addDebugInfo('=== 로그아웃 후 자동 로그인 방지 해제 ===');
    clearLogoutPrevention();
    addDebugInfo('콘솔에서 자동 로그인 방지 해제 결과를 확인하세요.');
  };

  const handleUltraClearCookies = async () => {
    addDebugInfo('=== 초강력 쿠키 삭제 시작 ===');
    await ultraClearAllCookies();
    addDebugInfo('초강력 쿠키 삭제 완료');
  };



  const handleClearAllBrowserStorage = async () => {
    addDebugInfo('=== 완전한 브라우저 스토리지 정리 시작 ===');
    await clearAllBrowserStorage();
    addDebugInfo('완전한 브라우저 스토리지 정리 완료');
  };

  const handlePerformCompleteLogout = async () => {
    addDebugInfo('=== 완전한 로그아웃 시작 ===');
    await performCompleteLogout();
    addDebugInfo('완전한 로그아웃 완료');
  };

  const handleForceServerLogout = async () => {
    addDebugInfo('=== 강력한 서버 로그아웃 시작 ===');
    await forceServerLogout();
    addDebugInfo('강력한 서버 로그아웃 완료');
  };

  const handlePerformUltimateLogout = async () => {
    addDebugInfo('=== 궁극의 다중 도메인 로그아웃 시작 ===');
    await performUltimateLogout();
    addDebugInfo('궁극의 다중 도메인 로그아웃 완료');
  };

  return (
    <Container>
      <Title>쿠키 디버깅 페이지</Title>
      <Warning>
        ⚠️ 이 페이지는 개발용입니다. 프로덕션에서는 제거하세요.
      </Warning>
      
      <ButtonGroup>
        <Button onClick={handleCheckCookies}>
          쿠키 상태 확인
        </Button>
        <Button onClick={handleClearCookies}>
          모든 쿠키 삭제
        </Button>
        <Button onClick={handleTestLogin}>
          로그인 상태 테스트
        </Button>
        <Button onClick={handleTestLogout}>
          로그아웃 테스트
        </Button>
        <Button onClick={handleCheckSpecificCookies}>
          인증 쿠키 확인
        </Button>
        <Button onClick={handleClearAuthCookies}>
          인증 쿠키만 삭제
        </Button>
        <Button onClick={handleShowDebugInfo}>
          디버깅 안내
        </Button>
        <Button onClick={handleForceLogout} style={{ backgroundColor: '#dc3545' }}>
          강제 로그아웃
        </Button>
        <Button onClick={handleClearCurrentDomainCookies} style={{ backgroundColor: '#28a745' }}>
          현재 도메인 쿠키만 삭제
        </Button>
        <Button onClick={handleCheckDomainSeparation} style={{ backgroundColor: '#17a2b8' }}>
          도메인 분리 확인
        </Button>
        <Button onClick={handleDiagnoseCrossDomain} style={{ backgroundColor: '#6f42c1' }}>
          크로스도메인 진단
        </Button>
        <Button onClick={handleTestCrossDomain} style={{ backgroundColor: '#fd7e14' }}>
          크로스도메인 테스트
        </Button>
        <Button onClick={handleAutoFixCrossDomain} style={{ backgroundColor: '#e83e8c' }}>
          자동 해결 시도
        </Button>
        <Button onClick={handleOptimizeCookieSettings} style={{ backgroundColor: '#20c997' }}>
          환경별 최적화
        </Button>
        <Button onClick={handleSolveMultiDomainLogout} style={{ backgroundColor: '#dc3545' }}>
          다중도메인 로그아웃 해결
        </Button>
        <Button onClick={handleGetBackendRecommendations} style={{ backgroundColor: '#6c757d' }}>
          백엔드 권장사항
        </Button>
        <Button onClick={handlePreventAutoLogin} style={{ backgroundColor: '#ffc107' }}>
          자동로그인 방지
        </Button>
        <Button onClick={handleClearLogoutPrevention} style={{ backgroundColor: '#17a2b8' }}>
          방지 해제
        </Button>
        <Button onClick={handleUltraClearCookies} style={{ backgroundColor: '#8e44ad' }}>
          초강력 쿠키 삭제
        </Button>

        <Button onClick={handleClearAllBrowserStorage} style={{ backgroundColor: '#27ae60' }}>
          브라우저 스토리지 정리
        </Button>
        <Button onClick={handlePerformCompleteLogout} style={{ backgroundColor: '#c0392b' }}>
          완전한 로그아웃
        </Button>
        <Button onClick={handleForceServerLogout} style={{ backgroundColor: '#8e44ad' }}>
          강력한 서버 로그아웃
        </Button>
        <Button onClick={handlePerformUltimateLogout} style={{ backgroundColor: '#2c3e50' }}>
          궁극의 로그아웃
        </Button>
      </ButtonGroup>

      <DebugInfo>
        <h3>디버그 정보:</h3>
        <pre>{debugInfo || '버튼을 클릭하여 디버그 정보를 확인하세요.'}</pre>
      </DebugInfo>

      <Instructions>
        <h3>사용 방법:</h3>
        <ol>
          <li>"쿠키 상태 확인" 버튼을 클릭하여 현재 상태를 확인</li>
          <li>"모든 쿠키 삭제" 버튼을 클릭하여 기존 쿠키 정리</li>
          <li>브라우저 개발자 도구 콘솔에서 자세한 로그 확인</li>
          <li>로그인/로그아웃 테스트로 API 동작 확인</li>
        </ol>
      </Instructions>
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const Warning = styled.div`
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  color: #856404;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #0056b3;
  }
`;

const DebugInfo = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 20px;

  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    font-size: 12px;
    line-height: 1.4;
  }
`;

const Instructions = styled.div`
  background-color: #e7f3ff;
  border: 1px solid #b3d9ff;
  border-radius: 5px;
  padding: 15px;

  ol {
    margin: 10px 0;
    padding-left: 20px;
  }

  li {
    margin-bottom: 5px;
  }
`;

export default CookieDebugPage; 