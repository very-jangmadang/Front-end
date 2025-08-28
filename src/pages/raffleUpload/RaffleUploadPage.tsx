import styled from 'styled-components';
import BigTitle from '../../components/BigTitle';
import imgUpload from '../../assets/imgUpload.svg';
import imgArrow from '../../assets/imgSelectArrow.png';
import React, { useEffect, useRef, useState } from 'react';
import { useModalContext } from '../../components/Modal/context/ModalContext';
import UploadModal from './modals/UploadModal';
import TicketModal from './modals/TicketModal';
import media from '../../styles/media';
import ImgSlider from './components/imageSlider';
import CustomCalendar from './components/CustomCalendar';

const RaffleUploadPage = () => {
  const [moreTicketText, setMoreTicketText] = useState<string>('직접 입력');
  const tickets = ['1개', '2개', '3개', moreTicketText];
  const [ticketNum, setTicketNum] = useState<string>('');
  // 시작 날짜 최소: 래플 업로드 눌렀을 때 현재 시각 + 10분 후부터 가능
  const [startDate, setStartDate] = useState<null | Date>(null);
  const [endDate, setEndDate] = useState<null | Date>(null);
  const [startTime, setStartTime] = useState<null | Date>(null);
  const [endTime, setEndTime] = useState<null | Date>(null);
  const { openModal } = useModalContext();
  const [leastTicketNum, setLeastTicketNum] = useState<string>('');
  const [name, setName] = useState<string>('');
  const fileRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<File[]>([]);
  const [category, setCategory] = useState<string>('');

  // 응모 시작 시간 조건
  const createdAt = new Date();
  const minDateTime = new Date(createdAt.getTime() + 10 * 60 * 1000);
  const maxDateTime = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);

  const handleChangeImgInput = (e: React.ChangeEvent) => {
    const targetFiles = (e.target as HTMLInputElement).files as FileList;
    const targetFilesArr = Array.from(targetFiles).slice(0, 10);
    console.log(targetFilesArr);
    setImages(targetFilesArr);
  };

  const handleCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();

    const description = (
      document.getElementById('upload-textarea') as HTMLInputElement
    ).value;

    // 모두 입력했는지 확인
    if (images.length === 0) return alert('상품 이미지를 추가해주세요');
    if (
      category === '' ||
      name === '' ||
      description.length === 0
    )
      return alert('상품 정보를 모두 입력해주세요');
    if (ticketNum === '')
      return alert('거래 설정을 모두 입력해주세요');
    if (
      startDate === null ||
      startTime === null ||
      endDate === null ||
      endTime === null
    )
      return alert('개최 기간을 설정해주세요');
    const startAt = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
      startTime.getHours(),
      startTime.getMinutes(),
    );

    const endAt = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
      endTime.getHours(),
      endTime.getMinutes(),
    );
    console.log(createdAt);
    console.log(startAt);
    console.log(endAt);
    if (
      createdAt >= startAt ||
      endAt.getTime() - startAt.getTime() < 24 * 60 * 60 * 1000 ||
      startAt >= endAt
    )
      return alert('개최 기간이 올바르지 않습니다');
    if (endAt.getTime() - startAt.getTime() > 30 * 24 * 60 * 60 * 1000)
      return alert('응모 진행 기간은 최대 30일입니다');

    const formData = new FormData();
    images.forEach((image) => {
      console.log('images:', image);
      formData.append(`files`, image);
    });
    formData.append('category', category);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('ticketNum', parseInt(ticketNum).toString());
    formData.append('minTicket', leastTicketNum.replace(',', ''));
    const offset = 1000 * 60 * 60 * 9;
    console.log(
      new Date(startAt.getTime() + offset).toISOString().slice(0, 19),
    );
    formData.append(
      'startAt',
      new Date(startAt.getTime() + offset).toISOString().slice(0, 19),
    );
    formData.append(
      'endAt',
      new Date(endAt.getTime() + offset).toISOString().slice(0, 19),
    );

    openModal(({ onClose }) => (
      <UploadModal
        onClose={onClose}
        images={images}
        name={name}
        formData={formData}
      />
    ));
  };

  const handleTicketNum = (key: string) => {
    if (key === moreTicketText) handleTicketModal();
    else setTicketNum(key);
  };

  const handleLeastTicketNum = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLeastTicketNum(
      e.target.value
        .replace(/[^0-9]/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    );
  };

  // 응모 티켓 개수 직접 입력 모달 open
  const handleTicketModal = () => {
    openModal(({ onClose }) => (
      <TicketModal
        onClose={onClose}
        setMoreTicketText={setMoreTicketText}
        setTicketNum={setTicketNum}
      />
    ));
  };

  return (
    <UploadForm>
      <div>
        <BigTitle>상품 정보</BigTitle>
        <ItemInfoContainer>
          <ImgContainer>
            <ImgSpan>상품 이미지</ImgSpan>
            <div>
              {images.length === 0 ? (
                <ImgFileLabel htmlFor="img-file">
                  <ImgFileIcon src={imgUpload} />
                </ImgFileLabel>
              ) : (
                <ImgSlider
                  images={images.map((image) => URL.createObjectURL(image))}
                >
                  <ImgFileLabel htmlFor="img-file" />
                </ImgSlider>
              )}
            </div>
            <InputImgFile
              name="files"
              ref={fileRef}
              type="file"
              id="img-file"
              accept="image/*"
              multiple
              onChange={handleChangeImgInput}
            />
          </ImgContainer>
          <ItemInfoRightContainer>
            <div>
              <TitleSpan>카테고리</TitleSpan>
              <ItemCategorySelect onChange={handleCategory}>
                <option value="">- - 선택하세요 - -</option>
                <option value="여성의류">여성의류</option>
                <option value="남성의류">남성의류</option>
                <option value="신발">신발</option>
                <option value="악세서리">악세사리</option>
                <option value="디지털">디지털</option>
                <option value="가전제품">가전제품</option>
                <option value="스포츠/레저">스포츠/레저</option>
                <option value="차량/오토바이">차량/오토바이</option>
                <option value="굿즈">굿즈</option>
                <option value="예술/희귀/수집품">예술/희귀/수집품</option>
                <option value="음반/악기">음반/악기</option>
                <option value="도서/티켓/문구">도서/티켓/문구</option>
                <option value="뷰티">뷰티</option>
                <option value="인테리어">인테리어</option>
                <option value="생활용품">생활용품</option>
                <option value="공구/산업용품">공구/산업용품</option>
                <option value="식품">식품</option>
                <option value="유아">유아</option>
                <option value="반려동물">반려동물</option>
                <option value="기타">기타</option>
                <option value="재능">재능</option>
              </ItemCategorySelect>
            </div>
            <div>
              <TitleSpan>상품명</TitleSpan>
              <InputContainer width={635}>
                <InputBox
                  type="text"
                  name="itemStatus"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </InputContainer>
            </div>

            <TextareaDiv>
              <TitleSpan>설명</TitleSpan>
              <Textarea id="upload-textarea" />
            </TextareaDiv>
          </ItemInfoRightContainer>
        </ItemInfoContainer>
      </div>
      <div>
        <BigTitle>거래 설정</BigTitle>
        <SetConditionContainer>
          <SetConditionBox>
            <TitleSpan2>응모 티켓 개수</TitleSpan2>
            <div>
              {tickets.map((t) => (
                <ConditionBtn
                  type="button"
                  key={t}
                  onClick={() => handleTicketNum(t)}
                  $clicked={String(t === ticketNum)}
                >
                  {t}
                </ConditionBtn>
              ))}
            </div>
          </SetConditionBox>

          <SetConditionBox>
            <TitleSpan2>정가</TitleSpan2>
            <InputContainer>
              <InputBox
                type="text"
                name="minTicket"
                value={leastTicketNum}
                onChange={handleLeastTicketNum}
              />
            </InputContainer>
          </SetConditionBox>
          <SetConditionBox>
            <TitleSpan2>시작 일시</TitleSpan2>
            <CustomCalendar
              date={startDate}
              setDate={setStartDate}
              minDateTime={minDateTime}
              maxDateTime={maxDateTime}
              time={startTime}
              setTime={setStartTime}
            />
          </SetConditionBox>
          <SetConditionBox>
            <TitleSpan2>종료 일시</TitleSpan2>
            {/* 최소 응모 기간 임의로 하루 설정 */}
            <CustomCalendar
              date={endDate}
              setDate={setEndDate}
              minDateTime={
                startDate === null
                  ? new Date(createdAt.getTime() + 24 * 60 * 60 * 1000)
                  : new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
              }
              maxDateTime={
                new Date(
                  startDate === null
                    ? new Date(createdAt.getTime() + 30 * 24 * 60 * 60 * 1000)
                    : startDate?.getTime() + 30 * 24 * 60 * 60 * 1000,
                )
              }
              time={endTime}
              setTime={setEndTime}
            />
          </SetConditionBox>

        </SetConditionContainer>
      </div>
      <SubmitBtn type="submit" value={'업로드'} onClick={handleSubmit} />
    </UploadForm>
  );
};

export default RaffleUploadPage;

const UploadForm = styled.form`
  max-width: 1080px;
  min-height: 1498px;
  display: flex;
  align-items: safe center;
  flex-direction: column;
  padding-top: 63px;
`;

const ItemInfoContainer = styled.div`
  display: flex;
  column-gap: 73px;
  ${media.medium`
      flex-direction: column;
      align-items: center;
  `}
  ${media.small`
    padding: 0 24px;
  `}
`;

const ImgContainer = styled.div`
  padding-top: 44px;
`;

const ImgSpan = styled.span`
  display: inline-block;
  color: #8f8e94;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 36.832px; /* 184.159% */
`;

const ImgFileIcon = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const ImgFileLabel = styled.label`
  display: inline-block;
  position: relative;
  width: 261px;
  height: 261px;
  border-radius: 5px;
  border: 1px solid #8f8e94;
  background: #f5f5f5;
  &:hover {
    cursor: pointer;
  }
  ${media.small`
    width: 217px;
    height: 217px;
  `}
`;
// const SelectedImg = styled.img`
//   display: inline-block;
//   position: relative;
//   width: 261px;
//   height: 261px;
//   border-radius: 5px;
// `;
const InputImgFile = styled.input`
  display: none;
`;

const ItemInfoRightContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 23px;
  padding-top: 77px;
  ${media.medium`
        padding-top: 50px;
    `}
`;

const TitleSpan = styled.div`
  min-width: 100px;
  display: inline-block;
  color: #000;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 36.832px; /* 184.159% */
  ${media.small`
    min-width: 81px;
  `}
`;
const TitleSpan2 = styled.div`
  min-width: 221px;
  display: inline-block;
  color: #000;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 36.832px; /* 184.159% */

  ${media.medium`
        min-width: 190px;
    `}
`;

const StyleP = styled.p`
  display: inline-block;
  color: #c908ff;
  text-align: right;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 36.832px; /* 263.085% */
  letter-spacing: -0.338px;
  &:hover {
    cursor: default;
  }
  ${media.small`
    display: none;
  `}
`;

const ItemCategorySelect = styled.select`
  width: 635px;
  height: 45px;
  border-radius: 7px;
  border: 1px solid #8f8e94;
  color: #000;
  font-family: Pretendard;
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: 36.832px; /* 184.159% */
  padding: 0 10px;
  background: url(${imgArrow}) no-repeat right 18px center;
  background-size: 16px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  &::-ms-expand {
    display: none;
  }

  ${media.medium`
    width: 530px;
  `}
  ${media.small`
    width: 260px;
  `}
`;

const ConditionBtn = styled.button<{ $clicked: string; $isState?: boolean }>`
  padding: 0 14px;
  height: 37px;
  border-radius: 11px;
  text-align: center;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 36.832px; /* 184.159% */
  margin-right: 13px;
  &:hover {
    cursor: pointer;
  }
  ${(props) =>
    props.$clicked === 'true'
      ? `
        border: 1px solid #C908FF;
        background: rgba(201, 8, 255, 0.20);
        color: #C908FF;
        `
      : `
        border: 1px solid #8F8E94;
        background: transparent;
        color: #000;
        `};
  ${(props) =>
    props.$isState &&
    media.small`
    min-widht: 34px;
    padding: 0;
  `}
`;

const Textarea = styled.textarea`
  width: 635px;
  height: 197px;
  resize: none;
  font-size: 18px;
  font-family: Pretendard;
  font-style: normal;
  line-height: 18px;
  letter-spacing: -0.165px;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 7px;

  ${media.medium`
        width: 530px;
    `}
  ${media.small`
    width: 260px;
  `}
`;

const TextareaDiv = styled.div`
  display: flex;

  ${media.medium`
        margin-bottom: 57px;
    `}
`;

const SetConditionContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 23px;
  align-items: center;
  padding-top: 60px;
  ${media.small`
    padding-top: 45px;
    row-gap: 27px;
    padding-right: 13px;
  `}
`;

const SetConditionBox = styled.div`
  width: 857px;
  // width: 100%;
  display: flex;
  ${media.medium`
        width: 100%;
        padding-left: 13px;
    `}
  ${media.small`
    flex-direction: column;
    gap: 17px;
    justify-content: space-between;
  `}
`;

const InputContainer = styled.div<{ width?: number }>`
  width: ${(props) => (props.width ? `${props.width}px` : '636px')};
  height: 45px;
  border-radius: 7px;
  border: 1px solid #8f8e94;
  box-sizing: border-box;
  padding: 2px 10px;
  // display: inline-block;
  display: inline-flex;
  align-items: center;

  ${media.medium`
        width: ${(props: { width?: number }) =>
          props.width ? '530px' : `464px`};
    `}
  ${(props) =>
    props.width ? media.small`width: 260px;` : media.small`width: 342px;`}
`;
const InputBox = styled.input`
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  font-size: 18px;
  font-family: Pretendard;
  font-style: normal;
  line-height: 18px;
  letter-spacing: -0.165px;
`;

const DatePickerBox = styled.div`
  .react-datepicker__input-container {
    width: 636px;
    height: 45px;
    border-radius: 7px;
    border: 1px solid #8f8e94;
    box-sizing: border-box;
    padding: 0 10px;
    display: flex;

    ${media.medium`
            width: 464px;
        `}
    ${media.small`
      width: 342px;
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

const SubmitBtn = styled.input`
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
  margin-top: 154px;
  margin-bottom: 100px;
  &:hover {
    cursor: pointer;
  }
  ${media.small`
    width: 342px;
  `}
`;
