import React, { useCallback, useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import Back from './Back';

import { Gender, UpdatePeriod } from './constant';
import { shuffle } from './utils';

const sort = (arr: Candidate[]) =>
  Array.from(arr.sort((a, b) => b.votes - a.votes));
function Routers() {
  const rankState = useState<Candidate[]>([]);
  const [showNameRange, setShowNameRange] = useState(-1);
  const [isShowAllName, setIsShowAllName] = useState(false);
  const [isStopUpdate, setIsStopUpdate] = useState(false);
  const [rank, setRank] = rankState;
  const [cancelGetRanks, setCancelGetRank] = useState<NodeJS.Timer[]>([]);

  const initializeApp = useCallback(() => {
    fetch('users.csv')
      .then((res) => res.text())
      .then((file) => {
        // @ts-ignore
        const csv = Papa.parse<CandidateOnFile>(file, {
          header: true,
          delimiter: ',',
          // encoding: 'utf-8',
        });
        const initRanks = shuffle(
          csv.data.map<Candidate>((item, index) => ({
            ...item,
            index,
            gender: item.gender === '男' ? Gender.male : Gender.female,
            property: item.property.split(','),
            votes: 0,
            isShowName: false,
            isSpy: item.isSpy === 'Y',
          }))
        );
        localStorage.setItem('ranks', JSON.stringify(initRanks));
        setRank(initRanks);
        setShowNameRange(0);
        setIsShowAllName(false);
      });
    localStorage.setItem('isShowName', 'false');
    localStorage.setItem('isStopUpdate', 'false');
    localStorage.setItem('showNameRange', '0');
  }, []);
  const updateData = useCallback(() => {
    const ranks = localStorage.getItem('ranks');
    const showNameRange = localStorage.getItem('showNameRange') || 0;
    const isShowAllName = localStorage.getItem('isShowAllName') || false;
    const stopUpdate = localStorage.getItem('isStopUpdate') || false;
    if (!ranks) {
      console.error('somthing is null', rank);
      return;
    }
    const newShowNameRange =
      typeof showNameRange === 'string'
        ? parseInt(showNameRange)
        : showNameRange;

    let newRank = JSON.parse(ranks) as Candidate[];
    newRank = newRank
      .sort((a, b) => b.votes - a.votes)
      .map((item, idx) => ({
        ...item,
        isShowName: idx < newShowNameRange,
      }));
    setRank(newRank);
    setShowNameRange(newShowNameRange);
    setIsShowAllName(
      typeof isShowAllName === 'string'
        ? JSON.parse(isShowAllName)
        : isShowAllName
    );
    const newisStop =
      typeof stopUpdate === 'string' ? JSON.parse(stopUpdate) : stopUpdate;
    setIsStopUpdate(newisStop);
    // console.log(
    //   '🚀 ~ file: Routers.tsx ~ line 78 ~ updateData ~ JSON.parse(stopUpdate)',
    //   newisStop,
    //   cancelGetRanks
    // );
    // if (newisStop && cancelGetRanks !== undefined) {
    //   console.log(
    //     '🚀 ~ file: Routers.tsx ~ line 84 ~ updateData ~ newisStop',
    //     newisStop
    //   );
    //   console.log(
    //     '🚀 ~ file: Routers.tsx ~ line 84 ~ updateData ~ cancelGetRanks',
    //     cancelGetRanks
    //   );
    //   clearInterval(cancelGetRanks);
    //   setCancelGetRank(undefined);
    // } else if (!newisStop && !cancelGetRanks) {
    //   console.log(
    //     '🚀 ~ file: Routers.tsx ~ line 103 ~ updateData ~ cancelGetRanks',
    //     cancelGetRanks
    //   );
    //   console.log(
    //     '🚀 ~ file: Routers.tsx ~ line 103 ~ updateData ~ newisStop',
    //     newisStop
    //   );

    //   // setCancelGetRank(IntervalUpdateData());
    // }
  }, []);

  // useEffect(() => {
  //   setRank(setIsShowCandidatesName());
  // }, [rank]);
  const IntervalUpdateData = useCallback(
    () => setInterval(updateData, UpdatePeriod),
    []
  );
  useEffect(() => {
    const cancel = IntervalUpdateData();
    console.log(
      '🚀 ~ file: Routers.tsx ~ line 119 ~ useEffect ~ cancel',
      cancel
    );

    setCancelGetRank(cancelGetRanks?.concat(cancel));

    updateData();

    return () => {
      clearInterval(cancel);
    };
  }, []);

  const cancelAllInterval = () => {
    cancelGetRanks?.forEach((item) => clearInterval(item));
    for (let i = 1; i < 300; i++) {
      clearInterval(i);
    }

    console.log('cancelGetRanks', cancelGetRanks);
    setCancelGetRank([]);
    // Note: 順便把Spy移出
    setRank(rank.filter((item) => !item.isSpy));
  };
  const handleVoting = (idx: number) => {
    rank[idx].votes += 1;
    const newRanks = sort(rank);
    localStorage.setItem('ranks', JSON.stringify(newRanks));
    setRank(newRanks);
    // updateData();
  };

  return (
    <Routes>
      <Route
        path='/'
        element={
          <App
            rankState={rankState}
            onVoting={handleVoting}
            isShowAllName={isShowAllName}
            showNameRange={showNameRange}
            cancelAllInterval={cancelAllInterval}
          />
        }
      />
      <Route
        path='/back'
        element={
          <Back
            rankState={rankState}
            onVoting={handleVoting}
            isShowAllName={isShowAllName}
            setIsShowAllName={setIsShowAllName}
            setShowNameRange={setShowNameRange}
            showNameRange={showNameRange}
            initializeApp={initializeApp}
            updateData={updateData}
            isStopUpdate={isStopUpdate}
            setIsStopUpdate={setIsStopUpdate}
          />
        }
      />
    </Routes>
  );
}

export default Routers;
