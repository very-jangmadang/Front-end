import styled from 'styled-components';
import BigTitle from '../../components/BigTitle';
import Address from './components/Address';
import { useEffect, useState } from 'react';
import { useModalContext } from '../../components/Modal/context/ModalContext';
import AddAddress from './components/modal/AddAddress';
import media from '../../styles/media';
import axiosInstance from '../../apis/axiosInstance';

export type TAddress = {
  addressId: number;
  addressName: string;
  recipientName: string;
  addressDetail: string;
  phoneNumber: string;
  isDefault: boolean;
};

const AddressSetPage = () => {
  const [isSelect, setIsSelect] = useState(false);
  const { openModal } = useModalContext();
  const [addressList, setAddressList] = useState<TAddress[] | undefined>([]);
  const [addressId, setAddressId] = useState<number[]>([]);

  const handleModal = () => {
    openModal(({ onClose }) => (
      <AddAddress onClose={onClose} fetchAddresses={fetchAddresses} />
    ));
  };

  const fetchAddresses = async () => {
    const { data } = await axiosInstance.get(
      '/api/member/mypage/setting/addresses',
    );
    setAddressList(data.result.addressList);
    console.log(data.result.addressList);
  };

  const handleDelete = () => {
    const deleteAddress = async () => {
      const { data } = await axiosInstance.delete(
        '/api/member/mypage/setting/addresses',
        {
          data: { addressIdList: addressId },
        },
      );
      await fetchAddresses();
    };
    if (addressId.length > 0) {
      // 기본 배송지 삭제 막기 위한 조치
      let canDelete = true;
      addressList?.map((address) => {
        if (addressId.includes(address.addressId) && address.isDefault)
          canDelete = false;
      });
      canDelete ? deleteAddress() : alert('기본 배송지는 삭제할 수 없습니다');
    }
    setAddressId([]);
    setIsSelect(false);
  };

  const handleCancel = () => {
    setIsSelect(false);
    setAddressId([]);
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <Wrapper>
      <BigTitle>
        배송지 설정
        {isSelect ? (
          <>
            <SelectBtn $right={'128px'} onClick={handleDelete}>
              배송지 삭제
            </SelectBtn>
            <SelectBtn
              $background={'rgba(201, 8, 255, 0.20)'}
              color={'#C908FF'}
              onClick={handleCancel}
            >
              선택 취소
            </SelectBtn>
          </>
        ) : (
          <SelectBtn onClick={() => setIsSelect(true)}>선택</SelectBtn>
        )}
      </BigTitle>
      <AddressList>
        {addressList?.map((v) => (
          <Address
            key={v.addressId}
            isSelect={isSelect}
            address={v}
            addressId={addressId}
            setAddressId={setAddressId}
            fetchAddresses={fetchAddresses}
          />
        ))}
      </AddressList>
      <Button onClick={handleModal}>새 배송지 추가하기</Button>
    </Wrapper>
  );
};

export default AddressSetPage;

const Wrapper = styled.div`
  padding-top: 63px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SelectBtn = styled.button<{
  $background?: string;
  color?: string;
  $right?: string;
}>`
  display: inline-flex;
  height: 31px;
  padding: 0px 14px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 11px;
  border: 1px solid #c908ff;
  background: ${(props) => (props.$background ? props.$background : '#C908FF')};
  color: ${(props) => (props.color ? props.color : '#FFF')};
  text-align: center;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 36.832px; /* 204.622% */
  position: absolute;
  right: ${(props) => (props.$right ? props.$right : '0')};
  box-sizing: border-box;
  &:hover {
    cursor: pointer;
  }
  ${media.small`
    display: absolute;
    bottom: -2.5em;
  `}
`;

const AddressList = styled.ul`
  padding-top: 63px;
  margin-bottom: 120px;
  display: flex;
  flex-direction: column;
  row-gap: 30px;

  ${media.medium`
    padding-inline-start: 13px;
  `}
  ${media.small`
    padding-inline-start: 0;
    margin-top: 1.5em;
  `}
`;

const Button = styled.button`
  width: 424px;
  height: 57px;
  border: none;
  border-radius: 7px;
  background: #c908ff;
  color: white;
  text-align: center;
  font-family: Pretendard;
  font-size: 22px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px;
  letter-spacing: -0.165px;
  margin-bottom: 150px;
  &:hover {
    cursor: pointer;
  }
  ${media.small`
      width: 342px;
    `}
`;
