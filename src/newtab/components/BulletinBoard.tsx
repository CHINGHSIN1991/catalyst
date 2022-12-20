import React, { useContext } from 'react'
import styled from 'styled-components'
import Draggable from 'react-draggable'
import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

import AlertContext from '../features/alertContext'

import { handleTextAreaChange } from '../../utils/functions'
import { BulletinTogglePanel } from './BulletinTogglePanel'
import { memo, scheme, tempMemo } from '../../static/types'
import { memoColorList } from '../../static/optionList'
import {
  ScrollbarContainer,
  ScrollbarTextArea,
} from '../../static/styleSetting'

type color = { color: string }
type colorComparison = { color: string; tempColor: string }
type coord = { x: number; y: number }
type isEditOn = { isEditOn: boolean }

const Wrapper = styled(ScrollbarContainer)`
  width: 100vw;
  height: 100vh;
`

const CreatePanel = styled.div<scheme>`
  border-radius: 8px;
  border: ${(props) => props.theme.panelBorder};
  background-color: ${(props) => props.theme.panelBackground};
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 0px 0px;
  width: 344px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const MemoInput = styled(ScrollbarTextArea)<color>`
  border-radius: 6px;
  padding: 8px;
  resize: none;
  width: 332px;
  height: 64px;
  background-color: ${(props) => props.color};
  transition: 0.2s;
  opacity: 0.8;
  border: solid rgb(160, 160, 160) 1px;
  z-index: 3;
  :focus {
    outline: none;
  }
`

const OptionContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 2px;
  width: 338px;
  z-index: 3;
`

const ColorBorder = styled.div<colorComparison>`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 24px;
  margin: 4px 12px 4px 4px;
  border-radius: 7px;
  border: solid 2px
    ${(props) =>
      props.color === props.tempColor
        ? 'rgba(255,255,255,1)'
        : 'rgba(255,255,255,0)'};
  box-shadow: ${(props) =>
    props.color === props.tempColor
      ? '2px 2px 2px 1px rgba(0, 0, 0, 0.2)'
      : 'none'};
`

const ColorContent = styled.div<color>`
  width: 100%;
  height: 100%;
  border-radius: 4px;
  background-color: ${(props) => props.color};
`

const CreateBtn = styled.div`
  cursor: pointer;
  text-align: center;
  height: 24px;
  line-height: 22px;
  border-radius: 6px;
  padding: 0 8px;
  margin: 4px 4px;
  margin-left: auto;
  background-color: rgba(255, 255, 255, 0.8);
  border: solid 1px rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(8px);
  transition: 0.2s;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
  :hover {
    background-color: rgba(255, 255, 255, 0.9);
  }
`

const MemoContainer = styled.div`
  width: 100%;
  margin-top: 128px;
  height: auto;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
`

const Memo = styled.div`
  position: relative;
  width: 200px;
  min-height: 80px;
  margin: 8px;
  border-radius: 4px;
  padding: 8px 8px 16px 16px;
  word-break: break-all;
  box-shadow: 2px 2px 8px 1px rgba(0, 0, 0, 0.3);
`

const MemoWrapper = styled.div<color>`
  position: absolute;
  border-radius: 4px;
  left: 0px;
  top: 0px;
  opacity: 0.85;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.color};
`

const MemoContent = styled(ScrollbarContainer)`
  max-height: 240px;
`
const MemoEditPanel = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
`
const MemoEditCheckBox = styled.div<isEditOn>`
  display: flex;
  justify-content: flex-end;
  overflow: hidden;
  transition: 0.1s;
  width: ${(props) => (props.isEditOn ? '0px' : '80px')};
`

const MemoEditBtn = styled.div`
  position: relative;
  margin-left: 8px;
  color: gray;
  white-space: nowrap;
  font-size: 10px;
  line-height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  :hover {
    color: black;
  }
`

const MemoTextContent = styled.div`
  font-size: 14px;
  line-height: 20px;
  word-break: break-word;
  min-height: 40px;
`
const MemoEditArea = styled(ScrollbarTextArea)<color>`
  position: absolute;
  background-color: ${(props) => props.color};
  border: none;
  line-height: 18px;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  resize: none;
  :focus {
    outline: none;
  }
`

const CreateAtContainer = styled.div`
  font-size: 12px;
  line-height: 16px;
  padding-top: 12px;
  border-top: solid 1px rgba(160, 160, 160, 0.8);
  margin-top: 12px;
`

const CreateAt = styled.a`
  color: rgb(160, 160, 160, 0.8);
  transition: 0.2s;
  :hover {
    color: rgb(80, 80, 80, 1);
  }
`

const BulletinBoard: React.FC<{
  setIsBoardOn: (boo: boolean) => void
}> = (props) => {
  const [alertState, setAlertState] = useContext(AlertContext)
  const [tempMemo, setTempMemo] = useState({
    memo: '',
    color: memoColorList[0],
  })
  const [memos, setMemos] = useState<memo[]>(null)

  function addMemoByEnter(e) {
    if (tempMemo.memo) {
      const code = e.code || e.key
      if (code === 'Enter') {
        addMemo()
      }
    }
  }

  function sortByCreateTime() {
    let tempMemos = [...memos]
    tempMemos.sort((a, b) => a.createTime - b.createTime)
    tempMemos.forEach((item) => (item.position = { x: 0, y: 0 }))
    setMemos(tempMemos)
  }

  function sortByColor() {
    let tempMemos = [...memos]
    tempMemos.sort(
      (a, b) => hexStringToColor(a.color) - hexStringToColor(b.color)
    )
    tempMemos.forEach((item) => (item.position = { x: 0, y: 0 }))
    setMemos(tempMemos)
  }

  function hexStringToColor(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16)
    return r + g + b
  }

  function addMemo() {
    if (tempMemo.memo.trim() !== '') {
      const newMemo = {
        id: uuidv4(),
        memo: tempMemo.memo,
        color: tempMemo.color,
        position: { x: 0, y: 0 },
        createTime: Date.now(),
      }
      setMemos([...memos, newMemo])
      setTempMemo({ ...tempMemo, memo: '' })
    } else {
      setAlertState({ title: 'Empty memo', message: 'Please key some content' })
      setTempMemo({ ...tempMemo, memo: '' })
    }
  }

  function editContent(id: string, content: string) {
    let tempMemos = [...memos]
    tempMemos.forEach((memo) => {
      if (memo.id === id) {
        memo.memo = content
      }
    })
    setMemos(tempMemos)
  }

  function changePosition(coord: coord, index: number) {
    const tempMemos = [...memos]
    tempMemos[index].position = { x: coord.x, y: coord.y }
    setMemos(tempMemos)
  }

  function deleteMemo(id: string) {
    setMemos(memos.filter((item) => item.id !== id))
  }

  function clearAll() {
    setMemos([])
  }

  function takeMemos() {
    chrome.storage.local.get(['memos'], (res) => {
      if (res.memos) {
        setMemos(res.memos)
      }
    })
  }

  useEffect(() => {
    takeMemos()
    chrome.storage.onChanged.addListener(function (changes) {
      if (changes.memos) {
        takeMemos()
      }
    })
  }, [])

  useEffect(() => {
    if (memos) {
      chrome.storage.local.set({ memos })
    }
  }, [memos])

  return (
    <Wrapper>
      <MemoContainer>
        {memos &&
          memos.map((item, index: number) => {
            return (
              <MemoTemplate
                key={item.id}
                index={index}
                memo={item}
                editContent={editContent}
                changePosition={changePosition}
                deleteMemo={deleteMemo}
              ></MemoTemplate>
            )
          })}
      </MemoContainer>
      <CreatePanel>
        <MemoInput
          name="memo"
          value={tempMemo.memo}
          onChange={(e) => handleTextAreaChange(e, tempMemo, setTempMemo)}
          onKeyPress={(e) => addMemoByEnter(e)}
          color={tempMemo.color}
        ></MemoInput>
        <OptionContainer>
          {memoColorList &&
            memoColorList.map((item) => {
              return (
                <ColorElement
                  key={item}
                  color={item}
                  tempMemo={tempMemo}
                  setTempMemo={setTempMemo}
                ></ColorElement>
              )
            })}
          <CreateBtn onClick={addMemo}>Create</CreateBtn>
        </OptionContainer>
      </CreatePanel>
      <BulletinTogglePanel
        sortByCreateTime={sortByCreateTime}
        sortByColor={sortByColor}
        setIsBoardOn={props.setIsBoardOn}
        clearAll={clearAll}
        memos={memos}
      ></BulletinTogglePanel>
    </Wrapper>
  )
}

const MemoTemplate: React.FC<{
  index: number
  memo: memo
  editContent: (id: string, content: string) => void
  changePosition: (data: coord, index: number) => void
  deleteMemo: (id: string) => void
}> = (props) => {
  const [isEditOn, setIsEditOn] = useState(false)
  const [editContent, setEditContent] = useState({
    editContent: props.memo.memo,
  })

  useEffect(() => {
    if (isEditOn) {
      setEditContent({
        editContent: props.memo.memo,
      })
    }
  }, [isEditOn])

  return (
    <Draggable
      key={props.memo.id}
      defaultPosition={{ x: 0, y: 0 }}
      position={props.memo.position}
      onStop={(e, data) => {
        props.changePosition(data, props.index)
      }}
    >
      <Memo>
        <MemoWrapper color={props.memo.color}></MemoWrapper>
        <MemoEditPanel>
          <MemoEditCheckBox isEditOn={isEditOn}>
            <MemoEditBtn onClick={() => setIsEditOn(true)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-pencil-square"
                viewBox="0 0 16 16"
              >
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                <path
                  fillRule="evenodd"
                  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                />
              </svg>
            </MemoEditBtn>
          </MemoEditCheckBox>
          <MemoEditCheckBox isEditOn={!isEditOn}>
            <MemoEditBtn
              onClick={() => {
                props.editContent(props.memo.id, editContent.editContent)
                setIsEditOn(false)
              }}
            >
              DONE
            </MemoEditBtn>
            <MemoEditBtn onClick={() => setIsEditOn(false)}>CANCEL</MemoEditBtn>
          </MemoEditCheckBox>
          <MemoEditBtn onClick={() => props.deleteMemo(props.memo.id)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="currentColor"
              className="bi bi-x-square"
              viewBox="0 0 16 16"
            >
              <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </MemoEditBtn>
        </MemoEditPanel>
        <MemoContent>
          <MemoTextContent>
            {props.memo.memo}
            {isEditOn && (
              <MemoEditArea
                color={props.memo.color}
                value={editContent.editContent}
                name="editContent"
                onChange={(e) => {
                  handleTextAreaChange(e, editContent, setEditContent)
                }}
              ></MemoEditArea>
            )}
          </MemoTextContent>
          {props.memo.createAt && (
            <CreateAtContainer>
              <CreateAt href={props.memo.createAt.url} target="_blank">
                create @ {props.memo.createAt.title}
              </CreateAt>
            </CreateAtContainer>
          )}
        </MemoContent>
      </Memo>
    </Draggable>
  )
}

const ColorElement: React.FC<{
  color: string
  tempMemo: tempMemo
  setTempMemo: (tempMemo: tempMemo) => void
}> = (props) => {
  function tempMemoEdit() {
    const tempMemo = { ...props.tempMemo, color: props.color }
    props.setTempMemo(tempMemo)
  }
  return (
    <ColorBorder
      onClick={tempMemoEdit}
      color={props.color}
      tempColor={props.tempMemo.color}
    >
      <ColorContent color={props.color}></ColorContent>
    </ColorBorder>
  )
}

export const MemoizedBulletinBoard = React.memo(BulletinBoard)
