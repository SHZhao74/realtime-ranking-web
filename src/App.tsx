import React, { useEffect, useState } from 'react';
import './App.css';
import Podium from './img/podium.png';
import Scroll from './img/scroll.png';
import Logo from './img/logo.png';
import Avatar1 from './img/avatar1.png';
import Avatar5 from './img/avatar5.png';
import { Gender } from './constant';

let oldRank: Candidate[] = [];
let oldShowNameArray: boolean[] = Array(10).fill(false);
const scollDown = 'scrollDown 1s linear forwards';

function Vote({
  votes = 0,
  oldVotes = 0,
  sortingIndex = 0,
}: {
  votes: number;
  oldVotes: number;
  sortingIndex?: number;
}) {
  return (
    <div className='flex justify-center text-black overflow-hidden h-[72px] border-cyan-200 ring-0'>
      <div
        className='text-7xl self-end w-[72px] flex flex-col items-end'
        style={{
          animation: scollDown,
          animationDelay: `${sortingIndex * 800}ms`,
          // transform: 'translateY(-45%)',
        }}
      >
        <div className=' flex items-center text-right'>{votes}</div>
        <div className='flex items-center align-middle text-right'>
          {oldVotes}
        </div>
      </div>
      <div className='text-lg self-end pb-1 pl-2'>票</div>
    </div>
  );
}
function NumberToRank(n: number) {
  if (n === 1) return '1st';
  if (n === 2) return '2nd';
  if (n === 3) return '3rd';

  return `${n}th`;
}
function GenderAvatar({
  gender = Gender.female,
  size = 'sm',
  className = '',
}: {
  gender: Gender;
  size: 'sm' | 'lg';
  className?: string;
}) {
  let avatarSize: string;
  if (size === 'sm') {
    avatarSize = 'w-[150px] h-[150px]';
  } else {
    avatarSize = 'w-[180px] h-[180px]';
  }
  return (
    <div
      className={`p-8 rounded-full flex justify-center items-center ${avatarSize}
      ${gender === Gender.female ? 'bg-[#947E7E]' : 'bg-[#769CAC]'} 
      ${className}`}
    >
      <img
        src={gender === Gender.female ? Avatar1 : Avatar5}
        // src={avatars[Math.floor(Math.random() * avatars.length)]}
        alt=''
        className='w-auto h-auto hover:animate-spin'
      />
    </div>
  );
}
function DisplayName({
  candiate,
  sortingIdx,
  isShowName,
  showNameArray,
}: {
  candiate: Candidate;
  sortingIdx: number;
  isShowAllName: boolean;
  showNameRange: number;
  isShowName: boolean;
  showNameArray: boolean[];
}) {
  let PropertyOrName;

  if (isShowName) {
    PropertyOrName = [
      <span
        key={sortingIdx}
        style={{
          color: '#454545',
          animation: oldShowNameArray[sortingIdx]
            ? undefined
            : 'ScaleSmall 0.6s linear',
          // animationPlayState: oldShowNameArray[sortingIdx]
          //   ? 'running'
          //   : '',
        }}
      >
        {candiate.nickName}
      </span>,
    ];
  } else {
    const property = Array.from(candiate.property);

    const index = Math.floor(Math.random() * property.length);
    property.splice(index, 1);
    const index2 = Math.floor(Math.random() * property.length);

    PropertyOrName = [
      <span className='badge badge-lg text-4xl h-11' key='123'>
        {candiate.property[index]}
      </span>,
      <span className='badge badge-lg text-4xl h-11' key='456'>
        {property.length < 1 ? '懶惰' : property[index2]}
      </span>,
    ];
  }
  return (
    <button
      className='text-5xl text-weight-500 w-[5em] text-start'
      onClick={() => {
        const newArray = Array.from(showNameArray);
        newArray[sortingIdx] = !showNameArray[sortingIdx];
        oldShowNameArray = newArray;
      }}
    >
      <div
        style={{
          animationPlayState: PropertyOrName.length > 1 ? 'running' : 'paused',
        }}
        className='whitespace-nowrap space-x-3 only-of-type:text-red flex justify-center
          '
      >
        {PropertyOrName}
      </div>
    </button>
  );
}
function App({
  rankState: [rank],
  isShowAllName,
  showNameRange,
  cancelAllInterval,
}: {
  rankState: [Candidate[], React.Dispatch<React.SetStateAction<Candidate[]>>];
  onVoting: (idx: number) => void;
  isShowAllName: boolean;
  showNameRange: number;
  cancelAllInterval: () => void;
}) {
  // const [oldRank, setOldRank] = useState<Candidate[]>(rank);
  const [showNameArray] = useState(Array(10).fill(false));
  const getPreviousCandidateData = (index: number): Candidate =>
    oldRank.find((item) => item.index === index) || {
      votes: 0,
      name: 'default name',
      nickName: 'defualt nickname',
      index: 999,
      gender: Gender.female,
      property: [],
      isShowName: false,
      isSpy: false,
    };
  useEffect(() => {
    document.title = '盧總３０大壽';
  }, []);
  useEffect(() => {
    oldRank = rank;
  }, [rank]);
  useEffect(() => {
    oldShowNameArray = showNameArray;
  }, [showNameArray]);
  if (rank.length < 1) return null;
  return (
    <div
      className='overflow-auto
      p-6 pb-0'
      style={{
        height: '100vh',
        backgroundColor: '#ECE9E9',
      }}
    >
      <div className='mx-auto flex justify-items-stretch flex-col items-center  h-full'>
        <button
          onClick={() => cancelAllInterval()}
          // className='btn btn-link'
          type='button'
        >
          <img src={Logo} className='w-[800px]' alt='' />
        </button>

        <div
          className='flex items-stretch
      w-full h-full'
        >
          {/* 前三名 */}
          <div
            className=' h-full
          flex flex-row justify-start items-start
          space-x-5 bg-no-repeat w-[80%] '
            style={{
              // paddingBottom: '210px',
              backgroundImage: `url(${Podium})`,
              backgroundSize: '100%',
              backgroundPosition: 'center bottom',
              // backgroundPositionY: '',
            }}
          >
            {/* 2nd */}
            <div
              className='text-center   flex flex-col items-center
            translate-y-[210px]
            translate-x-[230px]
              '
            >
              <DisplayName
                candiate={rank[1]}
                sortingIdx={1}
                isShowAllName={isShowAllName}
                showNameRange={showNameRange}
                showNameArray={showNameArray}
                isShowName={
                  showNameArray[1] || isShowAllName || 1 + showNameRange > 9
                }
              />
              <div className='h-[8px]' />
              <GenderAvatar gender={rank[1].gender} size='sm' />
              <div className='h-[21px]' />
              <Vote
                votes={rank[1].votes}
                oldVotes={getPreviousCandidateData(rank[1].index)?.votes}
              />
            </div>
            {/* 1st */}
            <div
              className='text-center  flex flex-col items-center
            translate-y-[70px]
            translate-x-[250px]
              '
            >
              <DisplayName
                candiate={rank[0]}
                sortingIdx={0}
                isShowAllName={isShowAllName}
                showNameRange={showNameRange}
                showNameArray={showNameArray}
                isShowName={
                  showNameArray[0] || isShowAllName || 0 + showNameRange > 9
                }
              />
              <div className='h-[16px]' />
              <GenderAvatar gender={rank[0].gender} size='lg' />
              <div className='h-[16px]' />
              <Vote
                votes={rank[0].votes}
                oldVotes={getPreviousCandidateData(rank[0].index)?.votes}
              />
            </div>
            {/* 3rd */}
            <div
              className='text-center   flex flex-col items-center
              translate-x-[300px]
              translate-y-[250px]
              '
            >
              <DisplayName
                candiate={rank[2]}
                sortingIdx={2}
                isShowAllName={isShowAllName}
                showNameRange={showNameRange}
                showNameArray={showNameArray}
                isShowName={
                  showNameArray[2] || isShowAllName || 2 + showNameRange > 9
                }
              />
              <div className='h-[8px]' />
              <GenderAvatar gender={rank[2].gender} size='sm' />
              <div className='h-[21px]' />
              <Vote
                votes={rank[2].votes}
                oldVotes={getPreviousCandidateData(rank[2].index)?.votes}
              />
            </div>
          </div>
          <div className='w-8' />
          <div
            className='w-[40%] pb-10 pt-[150px] px-3 self-stretch'
            style={{
              backgroundImage: `url(${Scroll})`,
              backgroundPosition: ' center bottom',
              backgroundRepeat: 'no-repeat',
              // backgroundAttachment: 'fixed',
              backgroundSize: '100%',
            }}
          >
            <ol className='px-8 space-y-5'>
              {rank.slice(3, 10).map((item, idx) => (
                <li
                  className=' transition  flex'
                  key={idx}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    className='text-6xl font-weight-400 text-[#9B9B9B] w-[72px]'
                    style={{}}
                  >
                    {NumberToRank(idx + 4)}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <DisplayName
                      candiate={item}
                      sortingIdx={idx + 3}
                      isShowAllName={isShowAllName}
                      showNameRange={showNameRange}
                      showNameArray={showNameArray}
                      isShowName={
                        showNameArray[idx + 3] ||
                        isShowAllName ||
                        idx + 3 + showNameRange > 9
                      }
                    />
                  </div>
                  <Vote
                    votes={item.votes}
                    sortingIndex={idx + 1}
                    oldVotes={getPreviousCandidateData(item.index)?.votes}
                  />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
