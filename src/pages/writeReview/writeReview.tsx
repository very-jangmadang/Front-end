import styled from 'styled-components';
import BigTitle from '../../components/BigTitle';
import StarRating from '../../components/StarRating';
import media from '../../styles/media';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import imgUpload from '../../assets/imgUpload.svg';
import ReviewModal from './modals/ReviewModal';
import { useModalContext } from '../../components/Modal/context/ModalContext';
import ImgSlider from './components/imageSlider';

const WriteReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { raffleId } = location.state as { raffleId: number };
  const { openModal } = useModalContext();

  const [score, setScore] = useState<number>(0);
  const [text, setText] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleImgClick = () => {
    fileRef.current?.click();
  };

  const handleChangeImgInput = (e: React.ChangeEvent) => {
    const targetFiles = (e.target as HTMLInputElement).files as FileList;
    const targetFilesArr = Array.from(targetFiles).slice(0, 10);
    console.log(targetFilesArr);
    setImages(targetFilesArr);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    openModal(({ onClose }) => (
      <ReviewModal
        onClose={onClose}
        raffleId={raffleId}
        score={score}
        text={text}
        images={images}
      />
    ));
  };

  return (
    <Wrapper>
      <BigTitle>후기 남기기</BigTitle>

      <ImgContainer>
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

      <ScoreBox>
        <TextBox>평점 매기기:</TextBox>
        <StarRating onRatingChange={setScore} />
      </ScoreBox>

      <Textarea
        placeholder="후기는 1~100자로 입력해주세요."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <Button
        onClick={handleSubmit}
        disabled={images.length === 0 || text.length === 0 || score === 0}
      >
        작성 완료
      </Button>
    </Wrapper>
  );
};

export default WriteReview;

const Wrapper = styled.form`
  padding-top: 63px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ScoreBox = styled.div`
  display: flex;
  align-items: center;
  padding-top: 73px;
  margin-bottom: 65px;
`;

const TextBox = styled.div`
  color: #8f8e94;
  text-align: center;
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 500;
  margin-right: 28px;
`;

const Textarea = styled.textarea`
  width: 866px;
  height: 497px;
  padding: 10px;
  margin-bottom: 137px;
  border: 1px solid #8f8e94;
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 400;
  resize: none;

  ${media.medium`
    width: 658px;
  `}
`;

const Button = styled.button`
  width: 424px;
  height: 57px;
  border-radius: 7px;
  border: none;
  background: #c908ff;
  color: #fff;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 167px;
  &:hover {
    cursor: pointer;
  }
`;

const ImgContainer = styled.div`
  padding-top: 44px;
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
`;

const ImgFileIcon = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const SelectedImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
  pointer-events: none;
`;

const InputImgFile = styled.input`
  display: none;
`;
