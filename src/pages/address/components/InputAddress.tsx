/// <reference types="vite-plugin-svgr/client" />
import styled from 'styled-components';
import { ReactComponent as IcList } from '../../../assets/icList.svg';
import { useEffect, useState } from 'react';
import media from '../../../styles/media';

type TInputAddress = {
  listColor: string;
  title: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
};

const InputAddress = ({ listColor, title, value, setValue }: TInputAddress) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (title === '연락처' || title === '휴대폰') {
      let rawValue = e.target.value.replace(/-/g, '');
      const regex = /^[0-9]{0,13}$/;
      if (regex.test(rawValue) && rawValue.length < 12) {
        setValue(rawValue);
      }
    } else setValue(e.target.value);
  };

  useEffect(() => {
    if (title !== '연락처' && title !== '휴대폰') return;
    if (value.length === 10) {
      setValue(value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'));
    }
    if (value.length === 11) {
      setValue(
        value.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'),
      );
    }
  }, [value]);

  return (
    <Container>
      <IcList
        fill={listColor}
        width={7}
        height={7}
        style={{ display: 'block' }}
      />
      <TitleBox>{title}</TitleBox>
      <Input type={'text'} value={value} onChange={handleChange} />
    </Container>
  );
};

export default InputAddress;

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const TitleBox = styled.div`
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

const Input = styled.input`
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
