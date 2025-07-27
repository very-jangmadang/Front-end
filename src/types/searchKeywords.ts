export type TSearch = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    recentSearch: string[];
    popularSearch: string[];
  };
};
