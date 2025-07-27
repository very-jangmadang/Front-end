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
  return <AnswerBox list={list} type={1} />;
};

export default Answered;
