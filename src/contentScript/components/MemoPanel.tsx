import React from 'react'
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { handleTextAreaChange, statusChangeDelay } from '../../utils/functions'
import { memoColorList } from '../../static/optionList'
import { ScrollbarTextArea } from '../../static/styleSetting'

import { AlertComponent } from './AlertComponent'

type bgColor = { bgColor: string }
type code = { code: string }
type codeComparison = { code: string; currentColor: string }

const Wrapper = styled.div`
  position: relative;
  color: rgba(40, 40, 40, 0);
  font-family: 'Noto Sans', 'Trebuchet MS', 'Microsoft JhengHei';
  display: flex;
  flex-direction: column;
`

const InputContainer = styled.div`
  padding-top: 8px;
`

const Title = styled.div`
  font-size: 12px;
  color: rgb(100, 100, 100);
  width: 100%;
  height: 16px;
  line-height: 16px;
  text-align: start;
`

const NoteArea = styled(ScrollbarTextArea)`
  color: rgba(40, 40, 40, 1);
  font-family: 'Noto Sans', 'Trebuchet MS', 'Microsoft JhengHei';
  box-sizing: border-box;
  width: 200px !important;
  background-color: ${(props: bgColor) => props.bgColor};
  height: 108px;
  border: solid 1px rgb(200, 200, 200);
  border-radius: 4px;
  padding: 12px;
  margin: 0;
  resize: none;
  :hover {
    background-color: ${(props: bgColor) => props.bgColor};
    border: solid 1px rgb(200, 200, 200);
  }
  :focus {
    outline: none;
    background-color: ${(props: bgColor) => props.bgColor};
    border: solid 1px rgb(200, 200, 200);
  }
`

const AddNoteBtn = styled.div`
  box-sizing: border-box;
  padding: 0;
  margin: 16px 0 0 0;
  text-align: center;
  font-size: 14px;
  line-height: 24px;
  width: 100%;
  height: 28px;
  border-radius: 4px;
  color: rgba(80, 80, 80, 1);
  background-color: rgba(80, 80, 80, 0);
  border: solid 2px rgba(80, 80, 80, 1);
  transition: 0.2s;
  :hover {
    color: rgba(255, 255, 255, 1);
    background-color: rgba(80, 80, 80, 1);
  }
`

const ColorPanel = styled.div`
  display: flex;
  box-sizing: border-box;
  width: 200px;
  height: 24px;
`

const ColorContainer = styled.div`
  box-sizing: border-box;
  border-radius: ${(props: codeComparison) =>
    props.code === props.currentColor ? '6px' : '5px'};
  border: solid
    ${(props: codeComparison) =>
      props.code === props.currentColor
        ? '2px rgba(120,120,120,1)'
        : '1px rgba(184,184,184,0.8)'};
  height: 24px;
  width: 18px;
  margin-right: 8px;
`

const Color = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 4px;
  background-color: ${(props: code) => props.code};
`

export const MemoPanel = () => {
  const [currentColor, setCurrentColor] = useState('#EAEAEA')
  const [tempMemo, setTempMemo] = useState({ memo: '' })
  const [processStatus, setProcessStatus] = useState(0)

  function addMemo() {
    if (tempMemo.memo.replace(/\s/g, '').length !== 0) {
      setProcessStatus(1)
      let tempMemoList = []
      const newMemo = {
        id: uuidv4(),
        memo: tempMemo.memo,
        color: currentColor,
        position: { x: 0, y: 0 },
        createTime: Date.now(),
        createAt: { title: window.document.title, url: window.location.href },
      }
      chrome.storage.local.get(['memos'], (res) => {
        if (res.memos) {
          tempMemoList = res.memos
        }
        tempMemoList.push(newMemo)
        chrome.storage.local.set({ memos: tempMemoList }, () => {
          setTempMemo({ memo: '' })
          setTimeout(() => setProcessStatus(2), 600)
        })
      })
    }
  }

  useEffect(() => {
    if (processStatus > 1) {
      statusChangeDelay(4, 400, processStatus, setProcessStatus)
    }
  }, [processStatus])

  return (
    <Wrapper>
      <ColorPanel onClick={(e: Event) => e.stopPropagation()}>
        {memoColorList &&
          memoColorList.map((code) => {
            return (
              <ColorContainer
                key={'memo' + code}
                code={code}
                onClick={() => setCurrentColor(code)}
                currentColor={currentColor}
              >
                <Color code={code} />
              </ColorContainer>
            )
          })}
      </ColorPanel>
      <InputContainer>
        <Title>Memo</Title>
        <NoteArea
          onClick={(e: Event) => e.stopPropagation()}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            handleTextAreaChange(e, tempMemo, setTempMemo)
          }
          value={tempMemo.memo}
          name="memo"
          id=""
          bgColor={currentColor}
        ></NoteArea>
      </InputContainer>
      <AddNoteBtn
        onClick={(e: Event) => {
          e.stopPropagation()
          addMemo()
        }}
      >
        Add to Bulletin Board
      </AddNoteBtn>
      <AlertComponent processStatus={processStatus}></AlertComponent>
    </Wrapper>
  )
}
