import styled from 'styled-components';
import AnswerBox from './AnswerBox';

interface IReplay {
  timestamp: string;
  content: string;
  title: string;
}

interface IAnswerItem {
  nickname: string;
  inquiryContent: string;
  timestamp: string;
  status: string;
  inquiryId: number;
  inquiryTitle: string;
  comments: IReplay[];
}

interface IAnsweredProps {
  list: IAnswerItem[];
}

const Answered: React.FC<IAnsweredProps> = ({ list }) => {
  if (list.length === 0) {
    return <EmptyMessage>궁금한 사항이 있다면 문의해주세요!</EmptyMessage>;
  }

  return <AnswerBox list={list} type={1} />;
};

const EmptyMessage = styled.div`
  padding: 80px 0;
  text-align: center;
  font-size: 16px;
  color: #8e8e8e;
  font-weight: 500;
  border-bottom: 1px solid #e8e8e8;
`;

export default Answered;
