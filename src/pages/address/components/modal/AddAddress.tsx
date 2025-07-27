import React, { PropsWithChildren, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { useModalContext } from '../../../../components/Modal/context/ModalContext';
import InputAddress from '../InputAddress';
import { ReactComponent as IcList } from '../../../../assets/icList.svg';
import { ReactComponent as closeModal } from '../../../../assets/icCloseAddressModal.svg';
import { Address, useDaumPostcodePopup } from 'react-daum-postcode';
import axiosInstance from '../../../../apis/axiosInstance';
import media from '../../../../styles/media';

const AddAddress = ({
  onClose,
  fetchAddresses,
}: PropsWithChildren<{
  onClose: () => void;
  fetchAddresses: () => Promise<void>;
}>) => {
  const open = useDaumPostcodePopup();
  const { clearModals } = useModalContext();
  const [apiAddress, setApiAddress] = useState<string>('');
  const [addressName, setAddressName] = useState<string>('');
  const [recipientName, setRecipientName] = useState<string>('');
  const [addressDetail, setAddressDetail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleComplete = (data: Address) => {
    let fullAddress = data.address; // 기본주소
    let extraAddress = '';

    // 기본 주소 타입: R(도로명)
    // bname: 법정동/법정리 이름
    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress +=
          extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    console.log(fullAddress);
    setApiAddress(fullAddress);
  };

  const handlePostcode = () => {
    open({ onComplete: handleComplete });
  };

  const onCloseModal = () => {
    onClose();
    clearModals();
  };

  const handleAddAddress = () => {
    const postAddress = async () => {
      const { data } = await axiosInstance.post(
        '/api/member/mypage/setting/addresses/add',
        {
          addressName,
          recipientName,
          addressDetail: apiAddress + ' ' + addressDetail,
          phoneNumber,
          message,
          isDefault: false,
        },
      );
      await fetchAddresses();
      console.log('Success POST');
    };
    if (
      addressName === '' ||
      recipientName === '' ||
      apiAddress === '' ||
      addressDetail === '' ||
      phoneNumber === ''
    )
      alert('필수 입력사항을 모두 입력해주세요');
    else {
      postAddress();
      onCloseModal();
    }
  };

  return ReactDOM.createPortal(
    <ModalOverlay>
      <ModalContent>
        <CloseModal onClick={onCloseModal} />
        <TopContainer>
          <TitleBox>배송지 추가</TitleBox>
          <LineDiv />
        </TopContainer>
        <ContentsContainer>
          <InputAddress
            listColor="#C908FF"
            title="배송지명"
            value={addressName}
            setValue={setAddressName}
          />
          <InputAddress
            listColor="#C908FF"
            title="받는 사람"
            value={recipientName}
            setValue={setRecipientName}
          />
          <AddressBox>
            <FlexContainer>
              <IcList fill="#C908FF" width={7} height={7} />
              <AddressTextBox>주소</AddressTextBox>
            </FlexContainer>
            <FindAddressBox>
              <FindAddress
                onClick={handlePostcode}
                readOnly
                value={apiAddress}
              />
              <FindAddress
                value={addressDetail}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAddressDetail(e.target.value)
                }
              />
            </FindAddressBox>
          </AddressBox>
          <InputAddress
            listColor="#C908FF"
            title="휴대폰"
            value={phoneNumber}
            setValue={setPhoneNumber}
          />
          <InputAddress
            listColor="#E4E4E4"
            title="주문 메시지"
            value={message}
            setValue={setMessage}
          />
        </ContentsContainer>
        <AddBtn onClick={handleAddAddress}>추가하기</AddBtn>
      </ModalContent>
    </ModalOverlay>,
    document.getElementById('modal-root') as HTMLElement,
  );
};

export default AddAddress;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 582px;
  height: auto;
  background-color: #fff;
  border-radius: 6px;
  padding: 58px 65px;
  box-sizing: border-box;
  ${media.small`
    width: 369px;
    `}
`;

const CloseModal = styled(closeModal)`
  position: absolute;
  top: 0;
  right: 0;
  &:hover {
    cursor: pointer;
  }
`;

const TopContainer = styled.div`
  width: 451px;
  height: 40px;
  position: relative;
  display: flex;
  align-items: flex-end;
  flex-direction: row-reverse;
  ${media.small`
    width: 268px;`}
`;
const TitleBox = styled.div`
  width: 127px;
  height: 40px;
  border-radius: 74px;
  background-color: #c908ff;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 18px; /* 100% */
  letter-spacing: -0.165px;
`;
const LineDiv = styled.div`
  width: 426px;
  height: 5px;
  background-color: #c908ff;
  ${media.small`
    width: 243px
  `}
`;

const ContentsContainer = styled.div`
  width: auto;
  display: flex;
  flex-direction: column;
  row-gap: 18px;
  padding: 29px 0 87px 0;
`;

const AddressBox = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
`;
const FlexContainer = styled.div`
  height: 38px;
  display: flex;
  align-items: center;
`;
const AddressTextBox = styled.div`
  width: 84px;
  padding-left: 12px;
  color: #8f8e94;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px; /* 150% */
  letter-spacing: -0.165px;
  box-sizing: border-box;
`;
const FindAddressBox = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 18px;
`;
const FindAddress = styled.input`
  width: 332px;
  height: 38px;
  border-radius: 3px;
  border: 0.5px solid #c1c1c1;
  background: #f7f7f7;
  padding: 0 5px;
  color: black;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px; /* 150% */
  letter-spacing: -0.165px;
  box-sizing: border-box;
  ${media.small`
    width: 163px;
    height: 37.7px;
  `}
`;

const AddBtn = styled.button`
  width: 302px;
  height: 39px;
  border-radius: 7px;
  background: #c908ff;
  border: none;
  color: #fff;
  text-align: center;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px; /* 128.571% */
  letter-spacing: -0.165px;
  &:hover {
    cursor: pointer;
  }
`;
