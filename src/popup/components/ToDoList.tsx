import React from 'react'
import styled from 'styled-components'
import { useState, useEffect } from 'react'

import { todo } from '../../static/types'

type isDone = { isDone: boolean }

const Wrapper = styled.div`
  font-family: 'Noto Sans', 'Trebuchet MS', 'Microsoft JhengHei';
  width: 100%;
`

const Title = styled.div`
  width: 100%;
  padding: 12px 8px;
  font-weight: bold;
  color: rgb(100, 100, 100);
`

const ToDoItem = styled.div`
  padding: 0 0 4px 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${(props: isDone) => (props.isDone ? 'darkgray' : 'black')};
  text-decoration: ${(props: isDone) =>
    props.isDone ? 'line-through' : 'none'};
`

const CheckContainer = styled.div`
  width: 12px;
  height: 24px;
  display: flex;
  margin-right: 8px;
  color: rgb(40, 40, 40);
  justify-content: center;
  align-items: center;
`

const TaskContent = styled.div`
  display: flex;
  flex-grow: 1;
`

const IconContainer = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
`

export const ToDoList: React.FC<{}> = () => {
  const [workList, setWorkList] = useState(null)

  function changeIsDone(id: number) {
    let tempWorkList = []
    workList.forEach((todo: todo) => {
      if (todo.id === id) {
        todo.isDone = !todo.isDone
        tempWorkList.push(todo)
      } else {
        tempWorkList.push(todo)
      }
    })
    chrome.storage.local.set({ todoList: tempWorkList }, function () {
      setWorkList(tempWorkList)
    })
  }

  useEffect(() => {
    chrome.storage.local.get(['todoList'], function (result) {
      setWorkList(result.todoList)
    })
  }, [])

  return (
    <Wrapper>
      <Title>To Do List</Title>
      {workList &&
        workList.map((item: todo) => {
          return (
            <ToDoElement
              key={item.id}
              item={item}
              changeIsDone={changeIsDone}
            ></ToDoElement>
          )
        })}
      {/* {workList && workList.map((item: todo) => { return <ToDoItem key={item.id}><input type="checkbox" checked={item.isDone} onClick={(e) => { e.stopPropagation(); }} onChange={() => { changeIsDone(item.id); }} />{item.workContent}</ToDoItem>; })} */}
    </Wrapper>
  )
}

const ToDoElement: React.FC<{
  item: todo
  changeIsDone: (id: number) => void
}> = (props) => {
  return (
    <ToDoItem
      isDone={props.item.isDone}
      onClick={() => {
        props.changeIsDone(props.item.id)
      }}
    >
      <CheckContainer>
        {!props.item.isDone && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            fill="currentColor"
            className="bi bi-square"
            viewBox="0 0 16 16"
          >
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
          </svg>
        )}
        {props.item.isDone && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            fill="darkgray"
            className="bi bi-check-square-fill"
            viewBox="0 0 16 16"
          >
            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z" />
          </svg>
        )}
      </CheckContainer>
      <TaskContent>{props.item.workContent}</TaskContent>
      <IconContainer>
        {props.item.isSetAlert && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            fill="currentColor"
            className="bi bi-bell"
            viewBox="0 0 16 16"
          >
            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
          </svg>
        )}
      </IconContainer>
    </ToDoItem>
  )
}
