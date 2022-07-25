import React from 'react';
import PistolImg from './pistol.png';
const Back = ({
  rankState: [rank],
  onVoting,
  isShowAllName,
  setIsShowAllName,
  initializeApp,
}: {
  rankState: [Candidate[], React.Dispatch<React.SetStateAction<Candidate[]>>];
  onVoting: (idx: number) => void;
  isShowAllName: boolean;
  setIsShowAllName: React.Dispatch<React.SetStateAction<boolean>>;
  isStopUpdate: boolean;
  setIsStopUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  showNameRange: number;
  setShowNameRange: React.Dispatch<React.SetStateAction<number>>;
  initializeApp: () => void;
  updateData: () => void;
}) => {
  const VoteButton = ({ idx }: { rank: Candidate[]; idx: number }) => (
    <button
      className='btn btn-circle btn-outline p-1 flex bg-transparent'
      onClick={() => onVoting(idx)}
    >
      <img src={PistolImg} className='w-full h-full' alt='' />
    </button>
  );
  return (
    <div className='container mx-auto'>
      <h1 className='text-3xl text-center my-10'>
        安安 我是後台
        <button className='btn btn-error btn-sm' onClick={initializeApp}>
          Initialize App
        </button>
      </h1>
      <div className='grid grid-cols-2 gap-4'>
        {/* <button className='btn btn-primary' onClick={initializeApp}>
          倒數十名開票
        </button> */}
        <div className='items-center flex justify-center form-control'>
          <label className='label cursor-pointer space-x-2'>
            <span className='label-text '>公佈全部答案</span>
            <input
              type='checkbox'
              className='toggle'
              checked={isShowAllName}
              onChange={() => {
                setIsShowAllName(!isShowAllName);
                localStorage.setItem(
                  'isShowAllName',
                  JSON.stringify(!isShowAllName)
                );
              }}
            />
          </label>
        </div>

        {/* <div className='items-center flex justify-center form-control'>
          <label className='label cursor-pointer'>
            <span className='label-text space-x-2'>倒數公佈前十名</span>
            <input
              type='number'
              className='input text-xl'
              min='0'
              value={showNameRange}
              max={rank.length}
              onChange={(e) => {
                setShowNameRange(e.target.value);
                localStorage.setItem(
                  'showNameRange',
                  JSON.stringify(parseInt(e.target.value))
                );
              }}
            />
          </label>
        </div> */}

        {/* <div className='items-center flex justify-center form-control'>
          <label className='label cursor-pointer space-x-2'>
            <span className='label-text'>停止自動更新</span>
            <input
              type='checkbox'
              className='toggle'
              checked={isStopUpdate}
              onChange={() => {
                setIsStopUpdate(!isStopUpdate);
                localStorage.setItem(
                  'isStopUpdate',
                  JSON.stringify(!isStopUpdate)
                );
                updateData();
              }}
            />
          </label>
        </div> */}
      </div>
      <table className='table mx-auto w-full table-zebra hover table-compact'>
        <thead>
          <tr>
            <th></th>
            <th>Index</th>
            <th>is Spy</th>
            <th className='text-xl'>Vote</th>
            <th className='text-xl'>Name</th>
            <th className='text-xl'>NickName</th>
            <th className='text-xl'>Property</th>
            <th>isShowName</th>
          </tr>
        </thead>
        <tbody>
          {rank
            .sort((a, b) => a.index - b.index)
            .map((item, idx) => (
              <tr key={idx}>
                <th className='p-1'>
                  <VoteButton rank={rank} idx={idx} />
                </th>
                <th className='text-xl text-yellow-500'>{item.index}</th>
                <th className='text-xl text-yellow-500'>
                  {item.isSpy ? (
                    <div className='badge badge-accent'>Yes</div>
                  ) : (
                    <div className='badge badge-secondary'>No</div>
                  )}
                </th>
                <td className='text-xl'>{item.votes}</td>
                <td className='text-xl'>{item.name}</td>
                <td className='text-xl'>{item.nickName}</td>
                <td className='text-xl'>{item.property}</td>
                <td className='text-xl'>
                  {item.isShowName ? (
                    <div className='badge badge-accent'>Yes</div>
                  ) : (
                    <div className='badge badge-secondary'>No</div>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Back;
