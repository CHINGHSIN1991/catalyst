import React from 'react';
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { useSelector } from 'react-redux';

import { getPersonalization } from '../features/reducers/optionsSlice';

const Wrapper = styled.div`
  /* border: solid 1px; */
  font-family: 'Noto Sans', 'Trebuchet MS', 'Microsoft JhengHei';
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const DateBlock = styled.div`
  font-size: 2rem;
  text-align: center;
  font-weight: bold;
  color: ${props => props.theme.primary};
  padding-bottom: 32px;
  transform: translateY(-80px);
  text-shadow: 0 0 5px ${props => props.theme.inversePrimary},  0 0 8px ${props => props.theme.primaryOpacity};
  /* text-shadow: 0 0 20px rgba(10, 175, 230, 1),  0 0 20px rgba(10, 175, 230, 0); */
`;

const TimeBlock = styled.div`
  display: flex;
  align-items: flex-end;
  font-size: 7rem;
  text-align: center;
  font-weight: normal;
  padding-bottom: 32px;
  color: ${props => props.theme.primary};
  transform: translateY(-80px);
  text-shadow: 0 0 16px ${props => props.theme.inversePrimary},  0 0 20px ${props => props.theme.primaryOpacity};
  /* text-shadow: 0 0 20px rgba(10, 175, 230, 1),  0 0 20px rgba(10, 175, 230, 0); */
`;

const TimeBlockSmall = styled.div`
  font-size: 3.5rem;
  padding: 8px 20px;
`;


export const TimePanel: React.FC<{}> = () => {
  const week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const personalization = useSelector(getPersonalization);
  const timerID: React.MutableRefObject<any> = useRef();
  const [currentClock, setCurrentClock] = useState({
    hour24: '',
    hour12: '',
    hourTerm: '',
    minutes: '',
    seconds: '',
    date: '',
  });


  function updateTime() {
    const cd = new Date();
    const tempClock = { ...currentClock };
    tempClock.hour24 = JSON.stringify(cd.getHours()).padStart(2, "0");
    if (cd.getHours() > 12) {
      tempClock.hour12 = JSON.stringify(cd.getHours() - 12).padStart(2, "0");
      tempClock.hourTerm = 'PM';
    } else {
      tempClock.hour12 = JSON.stringify(cd.getHours()).padStart(2, "0");
      tempClock.hourTerm = 'AM';
    }
    tempClock.minutes = JSON.stringify(cd.getMinutes()).padStart(2, "0");
    tempClock.seconds = JSON.stringify(cd.getSeconds()).padStart(2, "0");
    tempClock.date = `${JSON.stringify(cd.getFullYear()).padStart(4, "0")} - ${JSON.stringify(cd.getMonth() + 1).padStart(2, "0")} - ${JSON.stringify(cd.getDate()).padStart(2, "0")} ${week[cd.getDay()]}`;
    setCurrentClock(tempClock);
  }

  useEffect(() => {
    timerID.current = setInterval(updateTime, 1000);
    updateTime();
  }, []);

  return (
    <Wrapper>
      <DateBlock>{currentClock.date}</DateBlock>
      {personalization.isMilitary && <TimeBlock>{`${currentClock.hour24} : ${currentClock.minutes} : ${currentClock.seconds}`}</TimeBlock>}
      {!personalization.isMilitary && <TimeBlock>
        {`${currentClock.hour12} : ${currentClock.minutes} : ${currentClock.seconds}`}
        {/* <TimeBlockSmall>{currentClock.hourTerm}</TimeBlockSmall> */}
      </TimeBlock>}
    </Wrapper>
  );
};