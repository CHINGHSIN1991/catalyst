import React from 'react';
import ReactDOM from 'react-dom/client'
import styled from "styled-components";
import { ResetStyle, GlobalStyle } from "../static/globalStyle"
import { useState, useEffect } from "react";

import { CommonLinkPanel } from './commonLinks';
import { InspirationNotePanel } from './inspirationNotes';
import { TimePanel } from './timePanel';
import { ToDoListPanel } from './toDoList';
import { PersonalServicePanel } from './personalService';
import { CalendarPanel } from './calendarPanel';
import { WeatherPanel } from './weatherInfoPanel';


const Wrapper = styled.div`
  border: solid 1px;
  width: 100vw;
  height: 100vh;
  display: flex;
  background-image: url(https://source.unsplash.com/random);
  background-position: center;
  background-size: cover;
`

const MenuContainer = styled.div`
  border: solid 1px;
  width: 360px;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const FocusPanel = styled.div`
  border: solid 1px;
  width: calc(100% - 640px);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const App: React.FC<{}> = () => {
  const [tebInfo, setTebInfo] = useState({}) as any;

  useEffect(() => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      console.log(tabs[0]);
      setTebInfo(tabs[0]);
    });
  }, [])
  return (
    <Wrapper>
      <ResetStyle />
      <GlobalStyle />
      <MenuContainer>
        <CommonLinkPanel></CommonLinkPanel>
        <InspirationNotePanel></InspirationNotePanel>
      </MenuContainer>
      <FocusPanel>
        <TimePanel></TimePanel>
        <WeatherPanel></WeatherPanel>
      </FocusPanel>
      <MenuContainer>
        <PersonalServicePanel></PersonalServicePanel>
        <CalendarPanel></CalendarPanel>
        <ToDoListPanel tebInfo={tebInfo}></ToDoListPanel>
      </MenuContainer>
    </Wrapper>
  )
}

const rootElement = document.createElement('div');
document.body.appendChild(rootElement);
const root = ReactDOM.createRoot(rootElement);

root.render(<App />)