import React from 'react';
import ReactDOM from 'react-dom/client'
import styled from "styled-components";
import { ResetStyle, GlobalStyle } from "../static/globalStyle"
import { useState, useEffect, useReducer } from "react";

import { CommonLinkPanel } from './commonLinks';
import { InspirationNotePanel } from './inspirationNotes';
import { TimePanel } from './timePanel';
import { ToDoListPanel } from './toDoList';
import { PersonalServicePanel } from './personalService';
import { CalendarPanel } from './calendarPanel';


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
      </FocusPanel>
      <MenuContainer>
        <PersonalServicePanel></PersonalServicePanel>
        <CalendarPanel></CalendarPanel>
        <ToDoListPanel></ToDoListPanel>
      </MenuContainer>
    </Wrapper>
  )
}

const rootElement = document.createElement('div');
document.body.appendChild(rootElement);
const root = ReactDOM.createRoot(rootElement);

root.render(<App />)