import React from 'react';
import styled from 'styled-components';
import BigTitle from '../../components/BigTitle';
import SmallTitle from '../../components/SmallTitle';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../apis/axiosInstance';
import { useAuth } from '../../context/AuthContext';

const Setting: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  /** ✅ 로그아웃 처리 API */
  const handleLogout = async () => {
    logout();
    // try {
    //   const response = await axiosInstance.post("/api/permit/logout");

    //   if (response.data.isSuccess) {
    //     alert("로그아웃 되었습니다.");
    //     navigate("/login"); // 로그인 페이지로 이동
    //   } else {
    //     alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
    //   }
    // } catch (error) {
    //   console.error("로그아웃 중 오류 발생:", error);
    //   alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
    // }
  };

  const handleAccountDeletion = () => {
    const confirmDeletion = window.confirm(
      '정말 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
    );
    if (confirmDeletion) {
      alert('계정이 삭제되었습니다.');
      navigate('/');
    }
  };

  return (
    <Container>
      <BigTitleWrapper>
        <BigTitle>설정</BigTitle>
      </BigTitleWrapper>
      <SmallTitleBox>
        <SmallTitle onClick={() => handleNavigation('/mypage/address')}>
          배송지 설정
        </SmallTitle>
        <SmallTitle onClick={() => handleNavigation('/mypage/payment')}>
          결제 정보 설정
        </SmallTitle>
        <SmallTitle
          onClick={() => handleNavigation('/mypage/public-information-set')}
        >
          공개 정보 설정
        </SmallTitle>
        <SmallTitle onClick={handleAccountDeletion}>계정 탈퇴</SmallTitle>
        <SmallTitle onClick={handleLogout}>로그아웃</SmallTitle>
      </SmallTitleBox>
    </Container>
  );
};

export default Setting;

/* ✅ 기존 스타일 유지 */
const Container = styled.div`
  background: white;
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  text-align: center;
  margin-top: 64px;
`;

const BigTitleWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const SmallTitleBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin-top: 66px;
  margin-left: 112px;
  gap: 78px;
  cursor: pointer;
`;
