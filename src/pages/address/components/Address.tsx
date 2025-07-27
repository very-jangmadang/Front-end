/// <reference types="vite-plugin-svgr/client" />
import React, { useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as checkbox } from '../../../assets/imgCheckbox.svg';
import media from '../../../styles/media';
import { TAddress } from '../addressSetPage';
import axiosInstance from '../../../apis/axiosInstance';

type TAddressProps = {
  isSelect: boolean;
  address: TAddress;
  addressId: number[];
  setAddressId: React.Dispatch<React.SetStateAction<number[]>>;
  fetchAddresses: () => Promise<void>;
};

const Address = ({
  isSelect,
  address,
  addressId,
  setAddressId,
  fetchAddresses,
}: TAddressProps) => {
  // const [defaultId, setDefaultId] = useState<number|null>(null);

  const defaultAddress = async () => {
    const { data } = await axiosInstance.post(
      '/api/member/mypage/setting/addresses',
      { addressId: address.addressId },
    );
    await fetchAddresses();
    console.log('Success POST: Change Default Address!');
  };

  const handleCheckbox = () => {
    addressId.includes(address.addressId)
      ? setAddressId((prev) => prev.filter((v) => v != address.addressId))
      : setAddressId((prev) => [...prev, address.addressId]);
  };
  return (
    <>
      <List>
        {isSelect ? (
          <Checkbox
            width={window.innerWidth > 744 ? 27 : 21}
            height={window.innerWidth > 744 ? 27 : 21}
            onClick={handleCheckbox}
            fill={addressId.includes(address.addressId) ? '#C908FF' : 'none'}
          />
        ) : (
          <ListIcon />
        )}
        <Title>{address.addressName}</Title>
        <AddressText>{address.addressDetail}</AddressText>
        <SetBtn $default={address.isDefault} onClick={defaultAddress}>
          {address.isDefault ? '기본 배송지로 설정됨' : '기본 배송지로 설정'}
        </SetBtn>
      </List>
    </>
  );
};

export default Address;

const List = styled.li`
  display: flex;
  align-items: center;
  // justify-content: space-between;
  column-gap: 74px;
  width: 940px;
  box-sizing: border-box;
  ${media.medium`
    width: 631px;
    column-gap: 49px;
    // justify-content: space-between;
  `}
  ${media.small`
    width: 342px;
    column-gap: auto;
    justify-content: space-between;
  `}
`;

const Checkbox = styled(checkbox)`
  width: 27.2px;
  height: 27.1px;
  flex-shrink: 0;
  &:hover {
    cursor: pointer;
  }

  ${media.medium`
    width: 21px;
    height: 21px;
  `}
`;

const ListIcon = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  // margin: 6.5px;
  background-color: rgba(201, 8, 255, 0.2);
  border-radius: 100%;
  // margin-right: 78px;
`;

const Title = styled.div`
  width: 70px;
  color: #000;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${media.medium`
    width: 52px;
  `}
`;

const AddressText = styled.span`
  color: #000;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 20.363px; /* 113.13% */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 383px;
  ${media.medium`
    width: 229px;
  `}
  ${media.small`
    display: none;
  `}
`;

const SetBtn = styled.button<{ $default: boolean }>`
  display: flex;
  height: 31px;
  padding: 0px 14px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 5px;
  border: 1px solid #c908ff;
  text-align: center;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 36.832px; /* 230.199% */
  // margin-right: 14px;
  box-sizing: border-box;
  &:hover {
    cursor: pointer;
  }
  ${(props) =>
    props.$default
      ? `background: rgba(201, 8, 255, 0.20);
      color: #C908FF;
      min-width: 161px;`
      : `background: #C908FF;
      color: #FFF;
      min-width: 147px;`}
`;
