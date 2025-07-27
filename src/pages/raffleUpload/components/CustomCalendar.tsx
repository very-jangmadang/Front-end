import React, { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale/ko';
import styled from 'styled-components';
import media from '../../../styles/media';

interface ICalendar {
  date: null | Date;
  setDate: React.Dispatch<React.SetStateAction<null | Date>>;
  minDateTime: Date;
  maxDateTime: Date;
  time: null | Date;
  setTime: React.Dispatch<React.SetStateAction<null | Date>>;
}

const CustomCalendar: React.FC<ICalendar> = ({
  date,
  setDate,
  minDateTime,
  maxDateTime,
  time,
  setTime,
}) => {
  const [minTime, setMinTime] = useState<Date>(minDateTime);
  const [maxTime, setMaxTime] = useState<Date>(maxDateTime);

  registerLocale('ko', ko);

  const handleDateChange = (date: null | Date) => {
    if (date == null) return;
    setDate(date);
    setTime(null);
    const isSameDay = (a: Date, b: Date) =>
      a.toDateString() === b.toDateString();

    if (isSameDay(date, minDateTime)) {
      setDate(minDateTime);
      setMinTime(minDateTime);
      setMaxTime(
        new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59),
      );
    } else {
      setDate(date);
      setMinTime(
        new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0),
      );
      setMaxTime(
        new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59),
      );
    }
  };

  return (
    <>
      <DatePickerBox>
        <DatePicker
          className="datepicker--date"
          onKeyDown={(e) => {
            e.preventDefault();
          }}
          dateFormat="yyyy년 MM월 dd일"
          locale="ko"
          dateFormatCalendar="yyyy년 MM월"
          selected={date}
          onChange={handleDateChange}
          minDate={minDateTime}
          maxDate={maxDateTime}
        />
      </DatePickerBox>
      <DatePickerBox>
        <DatePicker
          onKeyDown={(e) => e.preventDefault()}
          dateFormat="a hh:mm"
          locale="ko"
          selected={time}
          onChange={(t) => setTime(t)}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={10}
          minTime={minTime}
          maxTime={maxTime}
        />
      </DatePickerBox>
    </>
  );
};

export default CustomCalendar;

const DatePickerBox = styled.div`
  .react-datepicker__input-container {
    // width: 636px;
    width: 313px;
    height: 45px;
    border-radius: 7px;
    border: 1px solid #8f8e94;
    box-sizing: border-box;
    padding: 0 10px;
    display: flex;

    &:first-child {
      margin-right: 10px;
    }

    ${media.medium`
            // width: 464px;
            width: 227px;
        `}
  }

  input {
    width: 100%;
    font-size: 18px;
    font-family: Pretendard;
    font-style: normal;
    line-height: 18px;
    letter-spacing: -0.165px;
    border: none;
    outline: none;
    readonly: true;
    caret-color: transparent;
  }
`;
