import React, { useState } from 'react';
import Modal from '../Modal';
import styled from 'styled-components';
import vector from '../../../assets/Vector.png';
import axiosInstance from '../../../apis/axiosInstance';

interface ModalProps {
  currentNickname: string;  // ✅ currentNickname prop 추가
  onClose: () => void;
  onNicknameChange: (newNickname: string) => void; // ✅ 닉네임 변경 콜백 추가
}

const NameEditModal: React.FC<ModalProps> = ({ currentNickname, onClose, onNicknameChange }) => {
  const [isError, setIsError] = useState('');
  const [name, setName] = useState(currentNickname); // ✅ 기존 닉네임을 초기값으로 설정
  const [loading, setLoading] = useState(false);

  const regex = /^[가-힣a-zA-Z0-9]{2,10}$/;

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSubmit = async () => {
    if (!regex.test(name)) {
      setIsError("닉네임은 2~10자의 한글, 숫자 또는 영어만 사용 가능합니다.");
      return;
    }
  
    try {
      console.log("닉네임 변경 요청 데이터:", name);
  
      const response = await axiosInstance.patch(
        `/api/member/mypage/nickname?nickname=${encodeURIComponent(name)}`
      );
  
      console.log("닉네임 변경 응답:", response.data);
  
      if (response.data.isSuccess) {
        alert("닉네임이 변경되었습니다!");
        onNicknameChange(name); // ✅ 변경된 닉네임을 부모 컴포넌트에 전달
        onClose(); // 모달 닫기
      } else {
        setIsError(response.data.message || "닉네임 변경에 실패했습니다.");
      }
    } catch (error: any) {
      console.error("닉네임 변경 중 오류 발생:", error);
  
      if (error.response) {
        console.error("서버 응답:", error.response.data);
        setIsError(error.response.data.message || "서버 오류가 발생했습니다.");
      } else {
        setIsError("서버 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <Modal onClose={onClose}>
      <Container>
        <Img src={vector} />
        <Title>닉네임 변경하기</Title>
        <Error>{isError}</Error>
        <Input
          value={name}
          onChange={handleChangeName}
          placeholder="닉네임을 입력하세요. (한글, 숫자, 영어 2~10자)"
          isError={!!isError}
        />
        <Button disabled={!name || loading} onClick={handleSubmit}>
          {loading ? '변경 중...' : '변경하기'}
        </Button>
      </Container>
    </Modal>
  );
};

export default NameEditModal;


const Error = styled.div`
  margin-top: 28px;
  margin-left: 10px;
  width: 275px;
  height: 17px;
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  color: #c908ff;
  font-family: 'Noto Sans KR';
  transform: translateX(-18px);
`;

const Button = styled.button`
  width: 302px;
  height: 39px;
  border-radius: 7px;
  background-color: #c908ff;
  border: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  cursor: pointer;
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Input = styled.input<{ isError: boolean }>`
  margin-top: 4px;
  margin-bottom: 161px;
  border-radius: 5px;
  border: ${({ isError }) => (isError ? '1px solid #C908FF' : 'none')};
  background: #f7f7f7;
  width: 272px;
  height: 31px;
  display: inline-flex;
  padding: 3.2px 14px;
  justify-content: center;
  align-items: center;
  outline: none;
  &::placeholder {
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 300;
  }
`;

const Title = styled.div`
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  font-family: Pretendard;
`;

const Img = styled.img`
  margin-top: 64px;
  width: 31px;
  height: 30px;
  margin-bottom: 20px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

