import styled from 'styled-components';
import axiosInstance from '../../../apis/axiosInstance';
import { useEffect, useState } from 'react';
import media from '../../../styles/media';
import { useNavigate } from 'react-router-dom';
import { useModalContext } from '../../../components/Modal/context/ModalContext';
import AskModal from './modals/AskModal';

const WriteAsk = ({ type }: { type: string | undefined }) => {
  const { openModal } = useModalContext();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isReload, setIsReload] = useState<boolean>(false);

  const handleAskModal = () => {
    openModal(({ onClose }) => (
      <AskModal
        onClose={onClose}
        type={type}
        title={title}
        content={content}
        setTitle={setTitle}
        setContent={setContent}
        setIsReload={setIsReload}
      />
    ));
  };

  const handleAsk = () => {
    if (title === '') alert('제목을 입력해주세요');
    else if (content === '') alert('내용을 입력해주세요');
    else handleAskModal();
  };

  useEffect(() => {
    if (isReload) {
      setIsReload(false);
      location.reload();
    }
  }, [isReload]);

  return (
    <Container>
      <TitleContainer>
        <Text>제목</Text>
        <TitleBox>
          <Input
            value={title}
            maxLength={30}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
          />
        </TitleBox>
      </TitleContainer>
      <ContentsContainer>
        <Text>내용</Text>
        <TextareaBox>
          <Textarea
            value={content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setContent(e.target.value)
            }
            maxLength={1000}
          />
          <WordCountDiv>{content.length}/1000자</WordCountDiv>
        </TextareaBox>
      </ContentsContainer>
      <Button onClick={handleAsk}>문의하기</Button>
    </Container>
  );
};

export default WriteAsk;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 44px;
  ${media.small`
    row-gap: 25px;
  `}
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Text = styled.div`
  display: inline-block;
  width: 35px;
  margin-right: 76px;

  color: #000;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 36.832px; /* 184.159% */

  ${media.medium`
    margin-right: 20px;
  `}
`;

const TextareaBox = styled.div`
  // display: flex;
  // flex-direction: column;
`;

const TitleBox = styled.div`
  width: 747px;
  height: 45px;
  border-radius: 7px;
  border: 1px solid #8f8e94;
  background: #f5f5f5;
  padding: 0 8px;
  box-sizing: border-box;

  ${media.medium`
    width: 467px;
  `}
  ${media.small`
    width: 288px;
  `}
`;
const Input = styled.input`
  background: transparent;
  border: none;
  outline: none;
  width: 100%;
  padding-top: 3px;

  color: #000;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 36.832px; /* 184.159% */
`;

const ContentsContainer = styled.div`
  display: flex;
  align-items: flex-start;
`;

const Textarea = styled.textarea`
  width: 747px;
  height: 328px;
  border-radius: 7px;
  border: 1px solid #8f8e94;
  background: #f5f5f5;
  resize: none;
  padding: 0 8px;
  box-sizing: border-box;
  outline: none;

  color: #000;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 36.832px; /* 184.159% */

  ${media.medium`
    width: 467px;
  `}
  ${media.small`
    width: 288px;
  `}
`;
const WordCountDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  padding-right: 2px;
  box-sizing: border-box;

  color: rgb(101, 101, 101);
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 184.159%;
`;

const Button = styled.button`
  width: 424px;
  height: 57px;
  border-radius: 7px;
  background: #c908ff;
  border: none;
  margin: 60px 0 50px;

  color: #fff;
  text-align: center;
  font-family: Pretendard;
  font-size: 22px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px; /* 81.818% */
  letter-spacing: -0.165px;

  &:hover {
    cursor: pointer;
  }

  ${media.small`
    width: 342px;
  `}
`;
