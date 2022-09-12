import React, { useRef } from 'react';
import ReactDOM from 'react-dom/client';
import styled from "styled-components";
import { ResetStyle, GlobalStyle } from "../static/globalStyle";
import { useState, useEffect } from "react";

import { CommonLinkPanel } from './commonLinks';
import { InspirationNotePanel } from './inspirationNotes';
import { TimePanel } from './timePanel';
import { ToDoListPanel } from './toDoList';
import { PersonalServicePanel } from './personalService';
import { CalendarPanel } from './calendarPanel';
import { WeatherPanel } from './weatherInfoPanel';
import { SettingPanel } from './settingPanel';
import { PomodoroPanel } from './PomodoroPanel';
import { BulletinBoard } from './BulletinBoard';
import { CurrentFocusPanel } from './CurrentFocusPanel';


import { getBackgroundImg } from '../utils/api';

const Wrapper = styled.div`
  /* border: solid 5px; */
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  background-image: url(${(props) => { return props.currentBackground; }});
  background-position: center;
  background-size: cover;
  transition: 0.5s;
  overflow: hidden;
`;

const Container = styled.div`
  left: ${(props: { isBoardOn: boolean; }) => { return props.isBoardOn ? "-100vw" : "0"; }};
  display: flex;
  width: 200vw;
  height: 100vh;
  position: absolute;
  transition: 0.5s;
`;

const MenuContainer = styled.div`
  border: solid 1px;
  width: 360px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const FocusPanel = styled.div`
  border: solid 1px;
  width: calc(100% - 640px);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const MainBoard = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
`;

type backgroundInfo = {
  url: string,
  user: string,
  profile: string,
  downloadLink: string,
};

const App: React.FC<{}> = () => {
  const [currentBackground, setCurrentBackground] = useState({
    url: "https://images.unsplash.com/photo-1662900547193-7ef6d19ffcfc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&q=80",
    user: "Pascal Scholl",
    profile: "https://unsplash.com/@hghfve",
    downloadLink: "https://unsplash.com/photos/asmUeIsNIzw/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjYyOTgyNjk2&force=true",
  });
  const backgroundList = useRef(null);
  const [customBackgrounds, setCustomBackgrounds] = useState<string[]>([]);
  const [isBoardOn, setIsBoardOn] = useState(false);
  const timeIntervalId = useRef(null);
  // const [tebInfo, setTebInfo] = useState(null);


  useEffect(() => {
    // chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    //   setTebInfo(tabs[0]);
    // });
    getBackgroundImg("nature").then((res) => {
      const tempBackgrounds = [];
      res.forEach((item) => {
        tempBackgrounds.push(
          {
            url: item.urls.full,
            user: item.user.name,
            profile: item.user.links.html,
            downloadLink: item.links.download,
          });
      });
      backgroundList.current = tempBackgrounds;
    });
    timeIntervalId.current = setInterval(() => {
      const index = Math.floor(Math.random() * backgroundList.current.length);
      setCurrentBackground(backgroundList.current[index]);
    }, 60000);
  }, []);

  useEffect(() => {

  }, []);

  return (
    <Wrapper currentBackground={currentBackground.url}>
      <Container isBoardOn={isBoardOn}>
        <MainBoard>
          <ResetStyle />
          <GlobalStyle />
          <MenuContainer>
            <CommonLinkPanel></CommonLinkPanel>
            <InspirationNotePanel></InspirationNotePanel>
            <SettingPanel currentBackground={currentBackground.url} customBackgrounds={customBackgrounds} setCustomBackgrounds={setCustomBackgrounds}></SettingPanel>
          </MenuContainer>
          <FocusPanel>
            <TimePanel></TimePanel>
            <CurrentFocusPanel></CurrentFocusPanel>
            <button>Menu trigger</button>
            <PomodoroPanel></PomodoroPanel>
            <WeatherPanel></WeatherPanel>
            <button onClick={() => { setIsBoardOn(true); }}>Bulletin Board trigger</button>
          </FocusPanel>
          <MenuContainer>
            <PersonalServicePanel></PersonalServicePanel>
            <CalendarPanel></CalendarPanel>
            <ToDoListPanel></ToDoListPanel>
          </MenuContainer>
        </MainBoard>
        <BulletinBoard setIsBoardOn={setIsBoardOn}></BulletinBoard>
      </Container>
    </Wrapper>
  );
};

const rootElement = document.createElement('div');
document.body.appendChild(rootElement);
const root = ReactDOM.createRoot(rootElement);

root.render(<App />);