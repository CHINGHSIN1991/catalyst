import React from 'react';
import styled from "styled-components";
import { useState, useEffect } from "react";

import { PanelBasicSetting } from './styleSetting';

const WorksPanel = styled(PanelBasicSetting)`
  /* border: solid 1px;   */
`
const ListItem = styled.div`
  border: solid 1px;
  display: flex;
`
const WorkContent = styled.div`
  border: solid 1px;
  width: 120px;
`

interface todo {
  workContent: string;
  isDone: boolean;
  id: number;
  isSetAlert: boolean;
  alertDate?: string;
  alertTime?: string;
  alertSend?: boolean;
}

export const ToDoListPanel: React.FC<{}> = () => {
  const [workList, setWorkList] = useState([]);
  const [tempTodo, setTempTodo] = useState({
    workContent: "",
    isSetAlert: false,
  } as todo);
  const [isEditOn, setIsEditOn] = useState(false);

  function editTodo() {
    let tempWorkList = []
    if (tempTodo.id) {
      let tempItem = { ...tempTodo }
      if (tempTodo.isSetAlert && tempTodo.alertDate && tempTodo.alertTime) {
        tempItem = { ...tempItem, alertSend: false }
      } else {
        delete tempItem.alertDate;
        delete tempItem.alertTime;
        delete tempItem.alertSend;
      }
      workList.forEach((item) => {
        if (item.id === tempItem.id) {
          tempWorkList.push(tempItem);
        } else {
          tempWorkList.push(item);
        }
      })
    } else {
      if (workList) {
        tempWorkList = [...workList]
      }
      let tempTodoToAdd = { ...tempTodo, id: Date.now(), isDone: false }
      if (tempTodo.isSetAlert && tempTodo.alertTime && tempTodo.alertDate) {
        tempTodoToAdd = { ...tempTodoToAdd, alertSend: false }
      } else {
        tempTodoToAdd = { ...tempTodoToAdd, isSetAlert: false }
        delete tempTodoToAdd.alertDate;
        delete tempTodoToAdd.alertTime;
        delete tempTodoToAdd.alertSend;
      }
      tempWorkList.push(tempTodoToAdd)
    }
    chrome.storage.sync.set({ todoList: tempWorkList }, function () {
      console.log(tempWorkList);
      setWorkList(tempWorkList);
      setTempTodo({ workContent: "", id: 0, isDone: false, isSetAlert: false });
      setIsEditOn(false);
    });

  }

  function handleContent(e: React.ChangeEvent<HTMLInputElement>) {
    setTempTodo({ ...tempTodo, workContent: e.target.value });
    console.log({ ...tempTodo, workContent: e.target.value });
  }

  function handleDate(e: React.ChangeEvent<HTMLInputElement>) {
    setTempTodo({ ...tempTodo, alertDate: e.target.value });
    console.log({ ...tempTodo, alertDate: e.target.value });
  }

  function handleTime(e: React.ChangeEvent<HTMLInputElement>) {
    setTempTodo({ ...tempTodo, alertTime: e.target.value });
    console.log({ ...tempTodo, alertTime: e.target.value });
  }

  function handleIsSetAlert(e: React.ChangeEvent<HTMLInputElement>) {
    setTempTodo({ ...tempTodo, isSetAlert: e.target.checked });
  }

  function changeIsDone(id: number) {
    let tempWorkList = [];
    workList.forEach((todo) => {
      if (todo.id === id) {
        todo.isDone = !todo.isDone;
        tempWorkList.push(todo);
      } else {
        tempWorkList.push(todo);
      }
    })
    chrome.storage.sync.set({ todoList: tempWorkList }, function () {
      setWorkList(tempWorkList);
    });
  }

  function delTodo(id: number) {
    let tempWorkList = [];
    workList.forEach((todo) => {
      if (todo.id === id) {
      } else {
        tempWorkList.push(todo);
      }
    })
    chrome.storage.sync.set({ todoList: tempWorkList }, function () {
      setWorkList(tempWorkList);
    });
  }

  useEffect(() => {
    chrome.storage.sync.get(['todoList'], function (result) {
      setWorkList(result.todoList);
    });
  }, [])

  return (
    <WorksPanel>
      To do list
      {workList && !!workList.length && workList.map((item: todo) => {
        return <ToDoItem key={item.id} changeIsDone={changeIsDone} delTodo={delTodo} setTempTodo={setTempTodo} item={item as todo} setIsEditOn={setIsEditOn}></ToDoItem>
      })

      }
      <button onClick={() => { setIsEditOn(true) }}>Add</button>
      {isEditOn &&
        <div>
          <label htmlFor=""> Work content
            <input type="text" value={tempTodo.workContent} onChange={handleContent} />
          </label>
          <input type="checkbox" checked={tempTodo.isSetAlert} onChange={handleIsSetAlert} />
          Set alert
          {tempTodo.isSetAlert && <label htmlFor="">
            <input onChange={handleDate} value={tempTodo.alertDate || ""} type="date" />
            <input onChange={handleTime} value={tempTodo.alertTime || ""} type="time" />
          </label>}
          <button onClick={editTodo}>Confirm</button>
          <button onClick={() => { setIsEditOn(false); setTempTodo({ workContent: "", id: 0, isDone: false, isSetAlert: false }); }}>Cancel</button>
        </div>
      }
    </WorksPanel >
  );
}

const ToDoItem: React.FC<{ item: todo, changeIsDone: (id: number) => void, delTodo: (id: number) => void, setTempTodo: (item: todo) => void, setIsEditOn: (boo: boolean) => void }> = (props) => {
  return (
    <ListItem>
      <input type="checkbox" checked={props.item.isDone} onChange={() => { props.changeIsDone(props.item.id) }} />
      <WorkContent>{props.item.workContent}</WorkContent>
      {props.item.isSetAlert ? `deadline: ${props.item.alertDate} ${props.item.alertTime}` : <button onClick={() => { props.setTempTodo({ ...props.item, isSetAlert: true }); props.setIsEditOn(true) }}>set alert</button>}
      <button onClick={() => { props.setTempTodo(props.item); props.setIsEditOn(true) }}>edit</button>
      <button onClick={() => { props.delTodo(props.item.id) }}>x</button>
    </ListItem>
  );
}