import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from '../../../components/Modal/Modal';
import vector from '../../../assets/Vector.png';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../apis/axiosInstance';
import useHostResultStore from '../store/hostResultStore';

interface ModalProps {
  onClose: () => void;
  deliveryId: number;
}

const courierList = [
  '우체국택배',
  'CJ대한통운',
  '로젠택배',
  '한진택배',
  '롯데택배',
  '드림택배',
  '대신택배',
  '일양로지스',
  '경동택배',
];

const DeliverModal: React.FC<ModalProps> = ({ onClose, deliveryId }) => {
  const navigate = useNavigate();
  const [courierName, setCourierName] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [invoiceError, setInvoiceError] = useState('');
  const { raffleData, deliveryData, setRaffleData, setDeliveryData } =
    useHostResultStore();

  const handleInvoiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (/^\d*$/.test(value)) {
      setInvoiceNumber(value);
      setInvoiceError('');
    } else {
      setInvoiceError('운송장 번호는 숫자만 사용 가능합니다.');
    }
  };

  const handleClick = async () => {
    try {
      const { data } = await axiosInstance.post(
        `/api/member/delivery/${deliveryId}/owner`,
        { courierName, invoiceNumber },
      );
    } catch (error) {
      console.error('POST 요청 실패', error);
    } finally {
      onClose();
    }
  };

  return (
    <Modal onClose={onClose}>
      <Container>
        <Img src={vector} />
        <Title>상품의 운송장을 입력해주세요.</Title>

        <Row>
          <SelectWrapper>
            <SelectBox onClick={() => setIsOpen(!isOpen)}>
              <CourierText isPlaceholder={!courierName}>
                {courierName || '택배사'}
              </CourierText>
              {!courierName && (
                <DropdownIcon
                  xmlns="http://www.w3.org/2000/svg"
                  width="9"
                  height="7"
                  viewBox="0 0 9 7"
                  fill="none"
                >
                  <path
                    d="M4.5 7L0.602886 0.25L8.39711 0.25L4.5 7Z"
                    fill="#8F8E94"
                  />
                </DropdownIcon>
              )}
            </SelectBox>

            {isOpen && (
              <Options>
                {courierList.map((courier) => (
                  <Option
                    key={courier}
                    onClick={() => {
                      setCourierName(courier);
                      setIsOpen(false);
                    }}
                  >
                    {courier}
                  </Option>
                ))}
              </Options>
            )}
          </SelectWrapper>

          <InputWrapper>
            <Input
              placeholder="운송장 번호 입력"
              value={invoiceNumber}
              onChange={handleInvoiceChange}
              isError={!!invoiceError}
            />
            <Error>{invoiceError}</Error>
          </InputWrapper>
        </Row>

        <Short>
          해당 운송장은 당첨자가 이메일과
          <br /> 알림페이지로 확인할 수 있습니다.
        </Short>

        <Button
          onClick={handleClick}
          disabled={!courierName || !invoiceNumber || !!invoiceError}
        >
          운송장 입력하기
        </Button>
      </Container>
    </Modal>
  );
};

export default DeliverModal;

const Short = styled.div`
  color: #c908ff;
  text-align: center;
  font-family: 'Noto Sans KR';
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  margin-top: 30px;
  margin-bottom: 70px;
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

  &:disabled {
    background: #e4e4e4;
    border: 1px solid #8f8e94;
    color: #8f8e94;
    cursor: not-allowed;
  }
`;
const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const Input = styled.input<{ isError: boolean }>`
  border-radius: 7px;
  border: 1px solid #000;
  width: 190px;
  height: 39px;
  flex-shrink: 0;
  display: inline-flex;
  padding: 3.2px 14px;
  justify-content: center;
  align-items: center;
  outline: none;
  cursor: pointer;
  border: ${({ isError }) =>
    isError ? '1px solid #C908FF' : '1px solid #000'};
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

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 39px 0 20px;
  height: 60px;
`;

const SelectWrapper = styled.div`
  position: relative;
  width: 120px;
`;

const SelectBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 15px;
  border-radius: 7px;
  border: 1px solid #000;
  cursor: pointer;
  background-color: #fff;
  font-size: 14px;
  width: 100%;
  height: 39px;
  flex-shrink: 0;
`;

const CourierText = styled.span<{ isPlaceholder: boolean }>`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  color: ${({ isPlaceholder }) => (isPlaceholder ? '#8F8E94' : '#000')};
  font-size: 14px;
`;

const DropdownIcon = styled.svg``;

const Options = styled.ul`
  position: absolute;
  top: 110%;
  left: 0;
  width: 100%;
  background-color: white;
  border: 0.5px solid #f5f5f5;
  max-height: 180px;
  overflow-y: auto;
  z-index: 10;
`;

const Option = styled.li`
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;

  border: 0.5px solid #f5f5f5;
  &:hover {
    border: 0.5px solid #c908ff;
    background: #fff;
  }
`;

const Error = styled.div`
  margin-top: 8px;
  margin-left: 4px;
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  color: #c908ff;
  font-family: 'Noto Sans KR';
`;
