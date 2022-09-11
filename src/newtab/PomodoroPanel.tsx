import React, { useRef } from 'react';
import styled from "styled-components";
import { ResetStyle, GlobalStyle } from "../static/globalStyle";
import { useState, useEffect } from "react";

const Wrapper = styled.div`

`;
export const PomodoroPanel: React.FC<{}> = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [pomoTimer, setPomoTimer] = useState("");
  const pomoTimeId = useRef(null);

  function triggerTimer() {
    chrome.storage.local.set({ pomoIsRunning: !isRunning });
    setIsRunning(!isRunning);
  }

  function clearTimer() {
    chrome.storage.local.set({ pomoIsRunning: false, pomoTimer: 0 });
    setIsRunning(false);
  }

  function updateTime() {
    chrome.storage.local.get(["pomoTimer"], (res) => {
      const minutes = `${25 - Math.ceil(res.pomoTimer / 60)}`.padStart(2, "0");
      const seconds = `${res.pomoTimer % 60 && 60 - res.pomoTimer % 60}`.padStart(2, "0");
      setPomoTimer(`${minutes} : ${seconds}`);
    });
  }

  useEffect(() => {
    chrome.storage.local.get(["pomoIsRunning"], (res) => {
      if (res.pomoIsRunning) {
        setIsRunning(true);
      } else {
        setIsRunning(false);
      }
    });
    updateTime();
    pomoTimeId.current = setInterval(updateTime, 1000);
  }, []);

  return (
    <Wrapper>
      <div>{pomoTimer}</div>
      <input type="number" />
      <button onClick={triggerTimer}>{isRunning ? "Pause" : "Start"}</button>
      <button onClick={clearTimer}>Clear</button>
    </Wrapper>
  );
};

