import React, { useRef } from 'react';
import styled from "styled-components";
import { useState, useEffect } from "react";

import { PanelBasicSetting } from '../styleSetting';

import { handleInputChange } from '../../utils/inputHandler';

const WorksPanel = styled(PanelBasicSetting)`
  /* border: solid 1px;   */
  display: flex;
  flex-grow:1;
`;

const ListItem = styled.div`
  border: solid 1px;
  display: flex;
`;

const WorkContent = styled.div`
  border: solid 1px;
  width: 120px;
`;

const CheckContainer = styled.div`
  width: 12px;
  height: 24px;
  display: flex;
  margin-right: 8px;
  justify-content: center;
  align-items: center;
`;

const AlarmContainer = styled.div`
  width: 12px;
  height: 24px;
  display: flex;
  margin-right: 8px;
  justify-content: center;
  align-items: center;
`;

const TextNote = styled.div`
  /* border: solid 1px; */
  height: 0px;
  padding-top: 0px;
  font-size: 0.75rem;
  line-height: 1rem;
  color: rgb(200,200,200);
  text-overflow: ellipsis;
  word-break: break-all;
  overflow: hidden;
  transition: 0.2s;
`;


const TempLink = styled.div`
  /* border: solid 1px; */
  flex-shrink:0;
  padding: 6px 4px;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.3s;
  margin: 2px 0;
  
  :hover{
    background-color: rgba(240,240,240,0.1);
    ${TextNote}{
      padding-top: 4px;
      height: 20px;
    }
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 0;
  flex-shrink:0;
  width: 24px;
  height: 24px;
  background-color: rgba(255,255,255,0.9);
  border-radius: 4px;
  margin-right: 8px;
`;

const ToDoContent = styled.div`
  /* border: solid 1px; */
  display: flex;
  align-items: flex-start;
  color: white;
`;

const NoteLinkIcon = styled.img`
  width: 14px;
  height: 14px;
  border-radius: 2px;
  object-fit: cover;
`;

const TextContent = styled.a`
  /* border: solid 1px; */
  color: white;
  flex-grow: 1;
  overflow: hidden;
`;

const TextTitle = styled.div`
  font-size: 0.875rem;
  line-height: 1rem;
  /* width: 80px; */
  color: ${(props) => { return props.isDone ? "lightgray" : "white"; }};
  text-decoration: ${(props) => { return props.isDone ? "line-through" : "none"; }};
  padding: 4px 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const TitleEdit = styled.input`
  height: 24px;
  width: 100%;
  background-color: rgba(0,0,0,0.2);
  padding: 4px 8px;
  border: solid 1px darkgrey;
  outline: none;
  color: white;
  border-radius: 4px;
  transition: 0.3s;
  :focus{
    background-color: rgba(0,0,0,0.4);
  }
`;

const NoteEdit = styled.textarea`
  width: 100%;
  height: 56px;
  resize: none;
  background-color: rgba(0,0,0,0.2);
  border: solid 1px darkgrey;
  outline: none;
  color: white;
  border-radius: 4px;
  transition: 0.3s;
  padding: 4px 8px;
  :focus{
    background-color: rgba(0,0,0,0.4);
  }
`;

const EditTrigger = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 8px;
  width: 16px;
`;

const Btn = styled.div`
  font-size: .75rem;
  line-height: 20px;
  color: black;
  height: 20px;
  width: calc(100% - 12px);
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  margin: 2px 6px;
  transition: 0.2s;
  background-color: rgba(240,240,240,0.7);
  :hover {
    background-color: rgba(255,255,255,0.9);
  }
`;

const CompleteBtns = styled.div`
  display: flex;
  flex-direction: column;
  width: 96px;
`;

const EditPanel = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  padding: ${(props) => { return props.isEditOn ? '16px' : '0px'; }};
  border-radius: 4px;
  top: 0;
  right: 0;
  transition: 0.1s;
  width: ${(props) => { return props.isEditOn ? "100%" : "0%"; }};
  height: 100%;
  background-color: rgba(80,80,80,0.5);
  backdrop-filter: blur(8px);
  overflow: hidden;
`;

const EditOption = styled.div`
  padding: 6px;
  margin: 8px 24px;
  opacity: ${(props) => { return props.isEditOn ? 1 : 0; }};
  transform: ${(props) => { return props.isEditOn ? 'translateY(0%)' : 'translateY(50%)'; }};  
  transition: 0.2s;
  font-size: 0.75rem;
  color: black;
  text-align: center;
  width: 100%;
  border-radius: 4px;
  background-color: rgba(255,255,255,0.6);
  :hover{
    background-color: rgba(255,255,255,0.95);
  }
`;

const EditOption1 = styled(EditOption)`
  transition-delay: 0.15s;
  transition-property: transform,opacity;
`;
const EditOption2 = styled(EditOption)`
  transition-delay: 0.2s;
  transition-property: transform,opacity;
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

export const ToDoListPanel: React.FC<{}> = () => {
  const [workList, setWorkList] = useState(null);
  const [tempTodo, setTempTodo] = useState({
    id: 0,
    workContent: "",
    isSetAlert: false,
  } as todo);
  const [isEditOn, setIsEditOn] = useState(false);
  const toDoListPort = useRef(null);

  function editTodo() {
    let tempWorkList = [];
    if (tempTodo.id) {
      let tempItem = { ...tempTodo };
      if (tempTodo.isSetAlert && tempTodo.alertDate && tempTodo.alertTime) {
        tempItem = { ...tempItem, alertSend: false };
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
      });
    } else {
      if (workList) {
        tempWorkList = [...workList];
      }
      let tempTodoToAdd = { ...tempTodo, id: Date.now(), isDone: false };
      if (tempTodo.isSetAlert && tempTodo.alertTime && tempTodo.alertDate) {
        tempTodoToAdd = { ...tempTodoToAdd, alertSend: false };
      } else {
        tempTodoToAdd = { ...tempTodoToAdd, isSetAlert: false };
        delete tempTodoToAdd.alertDate;
        delete tempTodoToAdd.alertTime;
        delete tempTodoToAdd.alertSend;
      }
      tempWorkList.push(tempTodoToAdd);
    }
    chrome.storage.sync.set({ todoList: tempWorkList }, function () {
      console.log(tempWorkList);
      setWorkList(tempWorkList);
      setTempTodo({ workContent: "", id: 0, isDone: false, isSetAlert: false });
      setIsEditOn(false);
    });

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
    });
    chrome.storage.sync.set({ todoList: tempWorkList }, function () {
      setWorkList(tempWorkList);
    });
  }

  function delTodo(id: number) {
    const tempWorkList = workList.filter((todo) => todo.id !== id);
    chrome.storage.sync.set({ todoList: tempWorkList }, function () {
      setWorkList(tempWorkList);
    });
    toDoListPort.current.postMessage({ msg: "update" });
  }

  useEffect(() => {
    chrome.storage.sync.get(['todoList'], function (result) {
      setWorkList(result.todoList);
    });
    const queryOptions = { active: true, lastFocusedWindow: true };
    chrome.tabs.query(queryOptions).then((res) => {
      toDoListPort.current = chrome.tabs.connect(res[0].id, { name: "todo" });
      toDoListPort.current.onMessage.addListener(function (res: { msg: string; }) {
        console.log(res);
        if (res.msg === "update") {
          console.log("todolist panel update");
        }
      });
    });
    // toDoListPort.current = chrome.runtime.connect({ name: "todo" });
    // toDoListPort.current.onMessage.addListener(function (res: { msg: string; }) {
    //   console.log(res);
    //   if (res.msg === "update") {
    //     console.log("todolist panel update");
    //   }
    // });
  }, []);

  return (
    <WorksPanel>
      To do list
      {workList && workList.map((item: todo) => {
        return <ToDoElement key={item.id} changeIsDone={changeIsDone} delTodo={delTodo} setTempTodo={setTempTodo} item={item as todo} setIsEditOn={setIsEditOn} tempTodo={tempTodo}></ToDoElement>;
      })
      }
      <button onClick={() => { setIsEditOn(true); }}>Add</button>
      {isEditOn &&
        <div>
          <label htmlFor=""> Work content
            <input type="text" name="workContent" value={tempTodo.workContent} onChange={(e) => handleInputChange(e, tempTodo, setTempTodo)} />
          </label>
          <input type="checkbox" checked={tempTodo.isSetAlert} onChange={handleIsSetAlert} />
          Set alert
          {tempTodo.isSetAlert && <label htmlFor="">
            <input name="alertDate" onChange={(e) => handleInputChange(e, tempTodo, setTempTodo)} value={tempTodo.alertDate || ""} type="date" />
            <input name="alertTime" onChange={(e) => handleInputChange(e, tempTodo, setTempTodo)} value={tempTodo.alertTime || ""} type="time" />
          </label>}
          <button onClick={editTodo}>Confirm</button>
          <button onClick={() => { setIsEditOn(false); setTempTodo({ workContent: "", id: 0, isDone: false, isSetAlert: false }); }}>Cancel</button>
        </div>
      }
    </WorksPanel >
  );
};

const ToDoItem: React.FC<{ item: todo, changeIsDone: (id: number) => void, delTodo: (id: number) => void, setTempTodo: (item: todo) => void, setIsEditOn: (boo: boolean) => void; }> = (props) => {
  return (
    <ListItem>
      <CheckContainer onClick={() => { props.changeIsDone(props.item.id); }}>
        {!props.item.isDone &&
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-square" viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
          </svg>
        }
        {props.item.isDone &&
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-square-fill" viewBox="0 0 16 16">
            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z" />
          </svg>
        }
      </CheckContainer>
      <WorkContent>{props.item.workContent}</WorkContent>
      {props.item.isSetAlert ? `deadline: ${props.item.alertDate} ${props.item.alertTime}` : <button onClick={() => { props.setTempTodo({ ...props.item, isSetAlert: true }); props.setIsEditOn(true); }}>set alert</button>}
      <button onClick={() => { props.setTempTodo(props.item); props.setIsEditOn(true); }}>edit</button>
      <button onClick={() => { props.delTodo(props.item.id); }}>x</button>
    </ListItem>
  );
};

const ToDoElement: React.FC<{
  item: todo,
  changeIsDone: (id: number) => void,
  delTodo: (id: number) => void,
  setTempTodo: (item: todo) => void,
  setIsEditOn: (boo: boolean) => void;
  tempTodo: todo,
}> = (props) => {
  const [isEditOn, setIsEditOn] = useState(false);

  return (
    <TempLink key={props.item.id} onMouseLeave={() => { setIsEditOn(false); }}>
      <ToDoContent>
        <CheckContainer onClick={() => { props.changeIsDone(props.item.id); }}>
          {!props.item.isDone &&
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-square" viewBox="0 0 16 16">
              <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            </svg>
          }
          {props.item.isDone &&
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="lightgray" className="bi bi-check-square-fill" viewBox="0 0 16 16">
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z" />
            </svg>
          }
        </CheckContainer>
        <TextContent onClick={() => { props.changeIsDone(props.item.id); }}>
          <TextTitle isDone={props.item.isDone}>{props.item.workContent}</TextTitle>
          {/* <TextNote>{props.item.isSetAlert ? `deadline: ${props.item.alertDate} ${props.item.alertTime}` : <button onClick={() => { props.setTempTodo({ ...props.item, isSetAlert: true }); props.setIsEditOn(true); }}>set alert</button>}</TextNote> */}
          {props.item.isSetAlert && <TextNote>{`deadline: ${props.item.alertDate} ${props.item.alertTime}`}</TextNote>}
        </TextContent>
        {props.tempTodo.id === props.item.id && <TextContent>
          <TitleEdit value={props.tempTodo.workContent} name="title" type="text" ></TitleEdit>
          {/* <NoteEdit value={props.tempTodo.note} name="note" type="text" ></NoteEdit> */}
        </TextContent>}
        {props.item.isSetAlert &&
          <AlarmContainer>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-bell-fill" viewBox="0 0 16 16">
              <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z" />
            </svg>
          </AlarmContainer>}
        {props.tempTodo.id !== props.item.id && <EditTrigger title="More actions" onClick={(e) => { e.stopPropagation(); setIsEditOn(true); }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
          </svg>
        </EditTrigger>}
        {props.tempTodo.id === props.item.id && <CompleteBtns>
          <Btn>Done</Btn>
          <Btn>Cancel</Btn>
        </CompleteBtns>}
      </ToDoContent>
      <EditPanel isEditOn={isEditOn} onClick={(e) => { e.stopPropagation(); setIsEditOn(false); }}>
        <EditOption1 isEditOn={isEditOn} onClick={(e) => { e.stopPropagation(); setIsEditOn(false); }}>Edit</EditOption1>
        <EditOption2 isEditOn={isEditOn} onClick={(e) => { e.stopPropagation(); }}>Delete</EditOption2>
      </EditPanel>
    </TempLink>
  );
};