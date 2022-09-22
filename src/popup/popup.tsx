import React from 'react';
import ReactDOM from 'react-dom/client';
import styled from "styled-components";
import { ResetStyle, GlobalStyle } from "../static/globalStyle";
// import { useState, useEffect } from "react";

import { PomodoroPanel } from './PomodoroPanel';
import { ToDoList } from './ToDoList';

const Wrapper = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
  width: 240px;
  color: rgb(40,40,40);
  min-height: 120px;
  background-color: rgba(0,0,0,0.05);
`;

const App: React.FC<{}> = () => {
  return (
    <Wrapper>
      <ResetStyle />
      <GlobalStyle />
      <PomodoroPanel></PomodoroPanel>
      <ToDoList></ToDoList>
    </Wrapper >
  );
};

const rootElement = document.createElement('div');
document.body.appendChild(rootElement);
const root = ReactDOM.createRoot(rootElement);

root.render(<App />);