type CandidateOnFile = {
  name: string;
  nickName: string;
  avatar: string; //url
  gender: string;
  property: string;
  isSpy?: 'Y';
};
type Candidate = {
  name: string;
  nickName: string;
  index: number;
  votes: number;
  avatar: string; //url
  gender: number;
  property: string[];
  isShowName: boolean;
  isSpy: boolean;
};
