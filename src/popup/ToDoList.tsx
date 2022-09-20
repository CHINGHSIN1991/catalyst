import React from 'react';
import ReactDOM from 'react-dom/client';
import styled from "styled-components";
import { useState, useEffect } from "react";

const Wrapper = styled.div`
  font-family: 'Noto Sans', 'Trebuchet MS', 'Microsoft JhengHei';
  width: 100%;
`;

const Title = styled.div`
  width: 100%;
  font-weight: bold;
  padding: 8px;
`;

const ToDoItem = styled.div`
  padding-bottom: 8px;
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

export const ToDoList: React.FC<{}> = () => {
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
    <Wrapper>
      <Title>To Do List</Title>
      {workList && workList.map((item: todo) => { return <ToDoItem key={item.id}><input type="checkbox" checked={item.isDone} onClick={(e) => { e.stopPropagation(); }} onChange={() => { changeIsDone(item.id); }} />{item.workContent}</ToDoItem>; })}
    </Wrapper>
  );
};
