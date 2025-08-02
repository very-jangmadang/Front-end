import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from '../../../../components/Modal/Modal';
import Checkbox from '@mui/material/Checkbox';
import { Icon } from '@iconify/react';
import CircleChecked from '@mui/icons-material/CheckCircleOutline';
import CircleUnchecked from '@mui/icons-material/RadioButtonUnchecked';
import { PostCharge } from '../../apis/chargeAPI';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';

interface ModalProps {
  onClose: () => void;
  amount: number;
}

const ChargeModal: React.FC<ModalProps> = ({ onClose, amount }) => {
  const [checked, setChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const { mutate: postMutation } = useMutation({
    mutationFn: PostCharge,
    onSuccess: (data) => {
      if (!data?.redirectUrl) {
        console.error('redirectUrl이 존재하지 않습니다.');
        return;
      }

      console.log('원본 redirectUrl:', data.redirectUrl);

      try {
        let fullRedirectUrl = data.redirectUrl;

        // 만약 상대경로라면 절대경로로 변환
        if (!fullRedirectUrl.startsWith('http')) {
          fullRedirectUrl = `${window.location.origin}${fullRedirectUrl}`;
        }

        console.log('변환된 URL:', fullRedirectUrl);

        const urlParams = new URLSearchParams(new URL(fullRedirectUrl).search);
        const actualUrl = urlParams.get('url');

        let tid = urlParams.get('tid'); // tid 추출

        if (!tid) {
          console.warn('TID가 없어서 "tid"라는 기본 값을 사용합니다.');
          tid = 'tid'; // tid가 없을 경우 기본값 설정
        }

        console.log('now tid:', tid); // tid 로그 출력

        // 쿠키를 '/api/payment/approve' 경로에 설정
        Cookies.set('tid', tid, {
          expires: 1,
          path: '/', // 전체 경로에서 쿠키 유효
          domain: window.location.hostname, // 현재 도메인에 맞게 동적 설정
          secure: true, // HTTPS에서만 쿠키 유효
          sameSite: 'Lax', // SameSite 설정 변경 (보안을 위해 Lax로 설정)
        });

        console.log('쿠키 설정:', document.cookie); // 쿠키가 제대로 설정되었는지 확인

        if (actualUrl && actualUrl.startsWith('https://')) {
          console.log('Redirecting to:', actualUrl);
          window.location.href = actualUrl;
        } else {
          console.error('URL parameter "url" not found or invalid.');
        }
      } catch (error) {
        console.error('Error processing redirect URL:', error);
      }
    },
    onError: (error) => {
      console.log('충전 요청 실패 : ', error);
    },
  });

  const handleNextModal = () => {
    if (checked) {
      postMutation({
        itemId: '티켓',
        itemName: '테스트상품',
        totalAmount: amount,
      });
    }
  };

  return (
    <Modal onClose={onClose}>
      <Container>
        <Box>
          <Checkbox
            style={{
              transform: 'translateY(0px)',
            }}
            sx={{
              '& .MuiSvgIcon-root': { fontSize: 25 },
              '&.Mui-checked': {
                color: '#C908FF',
              },
            }}
            checked={checked}
            onChange={(event) => {
              event.stopPropagation();
              handleChange(event);
            }}
            icon={<CircleUnchecked />}
            checkedIcon={<CircleChecked />}
          />
          <Consent>
            <span style={{ color: '#C908FF' }}>[필수]</span> 전체동의
          </Consent>
        </Box>
        <CheckBox>
          <Short>상품, 가격, 결제 전 주의사항 확인</Short>
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
        <Button onClick={handleNextModal}>충전하기</Button>
      </Container>
    </Modal>
  );
};

const Consent = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  transform: translateY(1px);
`;

const CheckBox = styled.div`
  display: flex;
  margin-bottom: 48px;
  column-gap: 30px;
  align-items: center;
  transform: translateX(35px);
`;

const Short = styled.div`
  color: #8f8e94;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
`;

const Box = styled.div`
  width: 290px;
  height: 43px;
  border: 1px solid #c1c1c1;
  margin-top: 228px;
  margin-bottom: 15px;
  display: flex;
  column-gap: 15px;
  align-items: center;
  padding-left: 10px;
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
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default ChargeModal;

