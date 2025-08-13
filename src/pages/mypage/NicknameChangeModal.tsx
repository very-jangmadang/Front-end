import React, { useState } from "react";
import Modal from "../../components/Modal/Modal";
import styled from "styled-components";

interface ModalProps {
  onClose: () => void;
}

const NicknameChangeModal: React.FC<ModalProps> = ({ onClose }) => {
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!nickname.trim()) {
      setError("닉네임을 입력해주세요.");
      return;
    }
    setLoading(true);
    setError("");

    const token = localStorage.getItem("AccessToken");
    if (!token) {
      setError("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch("/api/mypage/nickname", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ nickname }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "닉네임 변경에 실패했습니다.");
      }
      
      if (data.isSuccess) {
        alert("닉네임이 변경되었습니다!");
        onClose();
      } else {
        setError(data.message || "닉네임 변경에 실패했습니다.");
      }
    } catch (error: any) {
      setError(error.message || "서버 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <Container>
        <Title>닉네임 변경</Title>
        <StyledInput
          type="text"
          placeholder="새 닉네임을 입력하세요"
          value={nickname}
          $isError={!!error} // styled-components에서 prop으로 처리
          onChange={(e) => setNickname(e.target.value)}
        />
        {error && <ErrorText>{error}</ErrorText>}
        <ButtonWrapper>
          <CancelButton onClick={onClose} disabled={loading}>취소</CancelButton>
          <SaveButton onClick={handleSave} disabled={loading}>
            {loading ? "변경 중..." : "변경하기"}
          </SaveButton>
        </ButtonWrapper>
      </Container>
    </Modal>
  );
};

export default NicknameChangeModal;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Title = styled.div`
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const StyledInput = styled.input<{ $isError: boolean }>`
  width: 100%;
  max-width: 300px;
  padding: 10px;
  border: 1px solid ${({ $isError }) => ($isError ? "red" : "#ccc")};
  border-radius: 5px;
  font-size: 16px;
  margin-bottom: 10px;
`;

const ErrorText = styled.div`
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background: #ccc;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const SaveButton = styled.button`
  padding: 10px 20px;
  background: #c908ff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
