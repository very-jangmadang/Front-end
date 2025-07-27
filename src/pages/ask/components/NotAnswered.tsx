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
interface INotAnsweredProps {
  list: IAnswerItem[];
}

const NotAnswered: React.FC<INotAnsweredProps> = ({ list }) => {
  return <AnswerBox list={list} type={0} />;
};

export default NotAnswered;
