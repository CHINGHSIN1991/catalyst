console.log("contentScript running!");
console.log(window.location.href);

import React from 'react';
import ReactDOM from 'react-dom/client';
import styled from "styled-components";
import { useState, useEffect } from "react";

import { PomodoroPanel } from './comoponents/PomodoroPanel';


const Wrapper = styled.div`
  box-sizing: border-box;
  position: fixed;
  right: 24px;
  bottom: 16px;
  min-width: ${(props) => { return props.isOpen ? "240px" : "56px"; }};
  min-height: ${(props) => { return props.isOpen ? "160px" : "56px"; }};
  border-radius: ${(props) => { return props.isOpen ? "8px 8px 0px 8px" : "50% 50% 0px 50%"; }};
  overflow: hidden;
  background-color: gray;  
  color: black;
  z-index: 99999;
  padding: ${(props) => { return props.isOpen ? "24px" : "8px"; }};;
  cursor: pointer;
  transition: 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.img`
  width: 32px;
  height: 32px;
  object-fit: cover;
`;

interface todo {
  workContent: string;
  isDone: boolean;
  id: number;
  isSetAlert: boolean;
  alertDate?: string;
  alertTime?: string;
  alertSend?: boolean;
}

const App: React.FC<{}> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [workList, setWorkList] = useState(null);

  function changeIsDone(id: number) {
    let tempWorkList = [];
    workList.forEach((todo) => {
      if (todo.id === id) {
        todo.isDone = !todo.isDone;
        tempWorkList.push(todo);
      } else {
        tempWorkList.push(todo);
      }
    });
    chrome.storage.sync.set({ todoList: tempWorkList }, function () {
      setWorkList(tempWorkList);
    });
  }

  useEffect(() => {
    chrome.storage.sync.get(['todoList'], function (result) {
      setWorkList(result.todoList);
    });
  }, []);

  return (
    <Wrapper isOpen={isOpen} onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}>
      {isOpen && <PomodoroPanel></PomodoroPanel>}
      {!isOpen && <Logo src="https://firebasestorage.googleapis.com/v0/b/catalyst-aws17.appspot.com/o/CatalystLogo.png?alt=media&token=578673e6-464a-446b-9202-8517c14beb84"></Logo>}
      {isOpen && workList && workList.map((item: todo) => { return <div key={item.id}><input type="checkbox" checked={item.isDone} onClick={(e) => { e.stopPropagation(); }} onChange={() => { changeIsDone(item.id); }} />{item.workContent}</div>; })}
    </Wrapper>
  );
};

const rootElement = document.createElement('div');
document.body.appendChild(rootElement);
const root = ReactDOM.createRoot(rootElement);

root.render(<App />);