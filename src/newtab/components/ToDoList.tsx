import React from 'react';
import styled from "styled-components";
import { useState, useEffect } from "react";

import { PanelBasicSetting, PanelTitle, CreateButton, ScrollbarContainer } from '../../static/styleSetting';
import { handleInputChange } from '../../utils/functions';
import { todo, scheme, isEditOn } from '../../static/types';

type isDone = { isDone: boolean; };

const WorksPanel = styled(PanelBasicSetting)`
  display: flex;
  flex-grow:1;
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
  height: 0px;
  padding-top: 0px;
  font-size: 0.75rem;
  line-height: 1rem;
  color: ${(props: scheme) => props.theme.tertiary};
  text-overflow: ellipsis;
  word-break: break-all;
  overflow: hidden;
  transition: 0.2s;
`;


const TempLink = styled.div`
  flex-shrink:0;
  padding: 4px;
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

const ToDoElements = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const ToDoContent = styled.div`
  display: flex;
  align-items: flex-start;
  color: ${(props: scheme) => props.theme.primary};
`;

const TextContent = styled.div`
  color: ${(props: scheme) => props.theme.primary};
  flex-grow: 1;
  width: auto;
  overflow: hidden;
`;

const TextTitle = styled.div`
  font-size: 0.875rem;
  line-height: 1rem;
  color: ${(props: isDone & scheme) => props.isDone ? props.theme.tertiary : props.theme.primary};
  text-decoration: ${(props: isDone) => props.isDone ? "line-through" : "none"};
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
  color: ${(props: scheme) => props.theme.primary};
  border-radius: 4px;
  transition: 0.3s;
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
  height: 24px;
  width: 100%;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  margin-bottom: 4px;
  transition: 0.2s;
  background-color: rgba(240,240,240,0.7);
  :hover {
    background-color: rgba(255,255,255,0.9);
  }
`;

const CompleteBtns = styled.div`
  display: flex;
  flex-direction: column;
  width: 48px;
`;

const EditPanel = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  padding: ${(props: isEditOn) => props.isEditOn ? '16px' : '0px'};
  border-radius: 4px;
  top: 0;
  right: 0;
  transition: 0.1s;
  width: ${(props: isEditOn) => props.isEditOn ? "100%" : "0%"};
  height: 100%;
  background-color: rgba(80,80,80,0.5);
  backdrop-filter: blur(8px);
  overflow: hidden;
`;

const EditOption = styled.div`
  padding: 6px;
  margin: 8px 24px;
  opacity: ${(props: isEditOn) => props.isEditOn ? 1 : 0};
  transform: ${(props: isEditOn) => props.isEditOn ? 'translateY(0%)' : 'translateY(50%)'};  
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

const AddToDoContainer = styled.div`
  border-radius: 4px;
  background-color: rgba(255,255,255,0.1);
  width: 100%;
  height: ${(props: isEditOn) => props.isEditOn ? "86px" : "0px"};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: 0.2s;
  flex-direction: column;
`;

const ToDoLabel = styled.label`
  padding-top: 4px;
  width: 100%;
  display: flex;
  align-items: center;
`;

const ToDoTitle = styled.div`
  padding-left: 4px;
  font-size: 0.875rem;
  width: 48px;
`;

const ToDoInput = styled.input`
  height: 24px;
  padding: 0 4px;
  color: ${(props: scheme) => props.theme.primary};
  border: solid 1px gray;
  border-radius: 4px;
  background-color: rgba(0,0,0,0.1);
  ::-webkit-calendar-picker-indicator {
    filter: invert(1);
  }
  :focus{
    border: solid 1px gray;
    outline: solid 1px gray;
  }
`;

const AlarmTrigger = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 28px;
  width: 16px;
  cursor: pointer;
`;

const EditButton = styled.div`
  cursor: pointer;
  text-align: center;
  font-size: 0.75rem;
  width: 100%;
  border: solid 1px;
  background-color: rgba(200,200,200,0.2);
  border-radius: 4px;
  margin: 0 4px;
  padding: 4px;
  margin-top: 4px;
  transition: 0.2s;

  :hover{
    background-color: rgba(200,200,200,0.5);
  }
`;

const ToDoContainer = styled(ScrollbarContainer)`
  width: 100%;
  transition: 0.2s;
  height: ${(props: isEditOn) => props.isEditOn ? 'calc(100vh - 836px)' : 'calc(100vh - 750px)'};
  @media (max-width:1580px) {
    height: ${(props: isEditOn) => props.isEditOn ? 'calc(100vh - 614px)' : 'calc(100vh - 528px)'};
  }
  @media (max-width:1180px) {
    height: ${(props: isEditOn) => props.isEditOn ? 'calc(100vh - 428px)' : 'calc(100vh - 342px)'};
  }
`;

export const ToDoListPanel: React.FC<{}> = () => {
  const [workList, setWorkList] = useState(null);
  const [tempTodo, setTempTodo] = useState<todo>({
    id: 0,
    workContent: "",
    isSetAlert: false,
  });
  const [isEditOn, setIsEditOn] = useState(false);

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
      workList.forEach((item: todo) => {
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
      if (tempTodo.workContent) {
        let tempTodoToAdd = { ...tempTodo, id: Date.now(), isDone: false };
        if (tempTodo.alertTime && tempTodo.alertDate) {
          tempTodoToAdd = { ...tempTodoToAdd, isSetAlert: true, alertSend: false };
        } else {
          tempTodoToAdd = { ...tempTodoToAdd, isSetAlert: false };
          delete tempTodoToAdd.alertDate;
          delete tempTodoToAdd.alertTime;
          delete tempTodoToAdd.alertSend;
        }
        tempWorkList.push(tempTodoToAdd);
      }
    }
    chrome.storage.local.set({ todoList: tempWorkList }, function () {
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
    workList.forEach((todo: todo) => {
      if (todo.id === id) {
        todo.isDone = !todo.isDone;
        tempWorkList.push(todo);
      } else {
        tempWorkList.push(todo);
      }
    });
    chrome.storage.local.set({ todoList: tempWorkList }, function () {
      setWorkList(tempWorkList);
    });
  }

  function delTodo(id: number) {
    const tempWorkList = workList.filter((todo) => todo.id !== id);
    chrome.storage.local.set({ todoList: tempWorkList }, function () {
      setWorkList(tempWorkList);
    });
  }

  function getTodo() {
    chrome.storage.local.get(['todoList'], function (result) {
      setWorkList(result.todoList);
    });
  }

  useEffect(() => {
    getTodo();
    chrome.storage.onChanged.addListener(function (changes) {
      if (changes.todoList) {
        getTodo();
      }
    });
  }, []);

  return (
    <WorksPanel>
      <PanelTitle>To do list</PanelTitle>
      {!tempTodo.id && <AddToDoPanel isEditOn={isEditOn} setIsEditOn={setIsEditOn} tempTodo={tempTodo} setTempTodo={setTempTodo} editTodo={editTodo} handleIsSetAlert={handleIsSetAlert}></AddToDoPanel>}
      <ToDoContainer isEditOn={isEditOn}>
        <ToDoElements>
          {workList && workList.map((item: todo) => {
            return <ToDoElement key={item.id} editTodo={editTodo} changeIsDone={changeIsDone} delTodo={delTodo} setTempTodo={setTempTodo} item={item as todo} setIsEditOn={setIsEditOn} tempTodo={tempTodo}></ToDoElement>;
          })
          }
        </ToDoElements>
      </ToDoContainer>
      <CreateButton onClick={() => { setIsEditOn(!isEditOn); }}>{!isEditOn && '+'}{isEditOn && '-'}</CreateButton>
    </WorksPanel >
  );
};

const ToDoElement: React.FC<{
  item: todo,
  editTodo: () => void;
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
        {props.tempTodo.id !== props.item.id && <CheckContainer onClick={() => { props.changeIsDone(props.item.id); }}>
          {!props.item.isDone &&
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-square" viewBox="0 0 16 16">
              <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            </svg>
          }
          {props.item.isDone &&
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="gray" className="bi bi-check-square-fill" viewBox="0 0 16 16">
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z" />
            </svg>
          }
        </CheckContainer>}
        {props.tempTodo.id === props.item.id && <CheckContainer onClick={() => props.setTempTodo({ ...props.tempTodo, isSetAlert: !props.tempTodo.isSetAlert })}>
          {props.tempTodo.isSetAlert && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bell-fill" viewBox="0 0 16 16">
            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z" />
          </svg>}
          {!props.tempTodo.isSetAlert && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bell-slash-fill" viewBox="0 0 16 16">
            <path d="M5.164 14H15c-1.5-1-2-5.902-2-7 0-.264-.02-.523-.06-.776L5.164 14zm6.288-10.617A4.988 4.988 0 0 0 8.995 2.1a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 7c0 .898-.335 4.342-1.278 6.113l9.73-9.73zM10 15a2 2 0 1 1-4 0h4zm-9.375.625a.53.53 0 0 0 .75.75l14.75-14.75a.53.53 0 0 0-.75-.75L.625 15.625z" />
          </svg>}
        </CheckContainer>}
        {props.tempTodo.id !== props.item.id && <TextContent onClick={() => { props.changeIsDone(props.item.id); }}>
          <TextTitle isDone={props.item.isDone}>{props.item.workContent}</TextTitle>
          {props.item.isSetAlert && <TextNote>{`Alarm : ${props.item.alertDate} ${props.item.alertTime}`}</TextNote>}
        </TextContent>}
        {props.tempTodo.id === props.item.id && <TextContent>
          <TitleEdit style={{ width: "224px" }} value={props.tempTodo.workContent} name="workContent" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, props.tempTodo, props.setTempTodo)} type="text" ></TitleEdit>
          {props.tempTodo.isSetAlert && <ToDoLabel htmlFor="">
            <ToDoInput name="alertDate" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, props.tempTodo, props.setTempTodo)} value={props.tempTodo.alertDate || ""} type="date" />
            <ToDoInput name="alertTime" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, props.tempTodo, props.setTempTodo)} value={props.tempTodo.alertTime || ""} type="time" />
          </ToDoLabel>}
        </TextContent>}
        {props.item.isSetAlert && props.tempTodo.id !== props.item.id &&
          <AlarmContainer>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-bell-fill" viewBox="0 0 16 16">
              <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z" />
            </svg>
          </AlarmContainer>}
        {props.tempTodo.id !== props.item.id && <EditTrigger title="More actions" onClick={(e: Event) => { e.stopPropagation(); setIsEditOn(true); }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
          </svg>
        </EditTrigger>}
        {props.tempTodo.id === props.item.id && <CompleteBtns>
          <Btn onClick={() => { props.editTodo(); setIsEditOn(false); }}>Done</Btn>
          <Btn onClick={() => { setIsEditOn(false); props.setTempTodo({ id: 0, workContent: "", isSetAlert: false }); }}>Cancel</Btn>
        </CompleteBtns>}
      </ToDoContent>
      <EditPanel isEditOn={isEditOn} onClick={(e: Event) => { e.stopPropagation(); setIsEditOn(false); }}>
        <EditOption1 isEditOn={isEditOn} onClick={(e: Event) => { e.stopPropagation(); setIsEditOn(false); props.setTempTodo(props.item); }}>Edit</EditOption1>
        <EditOption2 isEditOn={isEditOn} onClick={(e: Event) => { e.stopPropagation(); props.delTodo(props.item.id); }}>Delete</EditOption2>
      </EditPanel>
    </TempLink>
  );
};

const AddToDoPanel: React.FC<{
  tempTodo: todo;
  setTempTodo: (tempTodo: todo) => void;
  editTodo: () => void;
  handleIsSetAlert: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditOn: boolean;
  setIsEditOn: (boo: boolean) => void;
}> = (props) => {

  return (
    <AddToDoContainer isEditOn={props.isEditOn}>
      <ToDoLabel htmlFor="workContent">
        <ToDoTitle>To do</ToDoTitle>
        <ToDoInput style={{ width: "224px" }} type="text" id="workContent" name="workContent" value={props.tempTodo.workContent} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, props.tempTodo, props.setTempTodo)} />
        <AlarmTrigger onClick={() => props.setTempTodo({ ...props.tempTodo, isSetAlert: !props.tempTodo.isSetAlert })}>
          {!props.tempTodo.isSetAlert && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bell-fill" viewBox="0 0 16 16">
            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z" />
          </svg>}
          {props.tempTodo.isSetAlert && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bell-slash-fill" viewBox="0 0 16 16">
            <path d="M5.164 14H15c-1.5-1-2-5.902-2-7 0-.264-.02-.523-.06-.776L5.164 14zm6.288-10.617A4.988 4.988 0 0 0 8.995 2.1a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 7c0 .898-.335 4.342-1.278 6.113l9.73-9.73zM10 15a2 2 0 1 1-4 0h4zm-9.375.625a.53.53 0 0 0 .75.75l14.75-14.75a.53.53 0 0 0-.75-.75L.625 15.625z" />
          </svg>}
        </AlarmTrigger>
      </ToDoLabel>
      {!props.tempTodo.isSetAlert && <ToDoLabel htmlFor="">
        <ToDoTitle>Alert</ToDoTitle>
        <ToDoInput name="alertDate" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, props.tempTodo, props.setTempTodo)} value={props.tempTodo.alertDate || ""} type="date" />
        <ToDoInput name="alertTime" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, props.tempTodo, props.setTempTodo)} value={props.tempTodo.alertTime || ""} type="time" />
      </ToDoLabel>}
      {props.isEditOn && <div style={{ display: "flex", paddingBottom: "4px" }}>
        <EditButton onClick={() => { props.editTodo(); props.setIsEditOn(false); }}>Done</EditButton>
        <EditButton onClick={() => { props.setIsEditOn(false); }}>Cancel</EditButton>
      </div>}
    </AddToDoContainer>
  );
};