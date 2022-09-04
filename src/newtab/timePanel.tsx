import React from 'react';
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";

const Wrapper = styled.div`
  /* border: solid 1px; */
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const DateBlock = styled.div`
  font-size: 2rem;
  text-align: center;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 20px rgba(0, 0, 0, 1),  0 0 20px rgba(0, 0, 0, 0);
  /* text-shadow: 0 0 20px rgba(10, 175, 230, 1),  0 0 20px rgba(10, 175, 230, 0); */
`

const TimeBlock = styled.div`
  font-size: 7rem;
  text-align: center;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 20px rgba(0, 0, 0, 1),  0 0 20px rgba(0, 0, 0, 0);
  /* text-shadow: 0 0 20px rgba(10, 175, 230, 1),  0 0 20px rgba(10, 175, 230, 0); */
`


export const TimePanel: React.FC<{}> = () => {
  const week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const timerID: React.MutableRefObject<any> = useRef();
  const [currentClock, setCurrentClock] = useState({
    time: "",
    date: "",
  })


  function updateTime() {
    const cd = new Date();
    const tempClock = { ...currentClock }
    tempClock.time = `${JSON.stringify(cd.getHours()).padStart(2, "0")} : ${JSON.stringify(cd.getMinutes()).padStart(2, "0")} : ${JSON.stringify(cd.getSeconds()).padStart(2, "0")}`;
    tempClock.date = `${JSON.stringify(cd.getFullYear()).padStart(4, "0")} - ${JSON.stringify(cd.getMonth() + 1).padStart(2, "0")} - ${JSON.stringify(cd.getDate()).padStart(2, "0")} ${week[cd.getDay()]}`;
    setCurrentClock(tempClock);
  }

  useEffect(() => {
    timerID.current = setInterval(updateTime, 1000);
    updateTime();
  }, [])

  return (
    <Wrapper>
      <DateBlock>{currentClock.date}</DateBlock>
      <TimeBlock>{currentClock.time}</TimeBlock>
    </Wrapper>
  );
}