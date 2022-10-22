import React, { useContext } from "react";
import styled from "styled-components";
import Draggable from "react-draggable";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import AlertContext from "../features/alertContext";

import { handleTextAreaChange } from "../../utils/functions";
import { BulletinTogglePanel } from "./BulletinTogglePanel";
import { memo, scheme, tempMemo } from "../../static/types";
import { memoColorList, colorScheme } from "../../static/optionList";
import { ScrollbarContainer, ScrollbarTextArea } from "../../static/styleSetting";

type color = { color: string; };
type colorComparison = { color: string, tempColor: string; };
type coord = { x: number, y: number; };

const Wrapper = styled(ScrollbarContainer)`
  width: 100vw;
  height: 100vh;
`;

const CreatePanel = styled.div`
  border-radius: 8px;
  border: ${(props: scheme) => props.theme.panelBorder};
  background-color: ${(props: scheme) => props.theme.panelBackground};
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
`;

const MemoInput = styled(ScrollbarTextArea)`
  border-radius: 6px;
  padding: 8px;
  resize: none;
  width: 332px;
  height: 64px;
  background-color: ${(props: color) => props.color};
  transition: 0.2s;
  opacity: 0.8;
  border: solid rgb(160,160,160) 1px;
  z-index: 3;
  :focus {
    outline: none;
  }
 `;

const OptionContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 2px;
  width: 338px;
  z-index: 3;
`;

const ColorBorder = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 24px;
  margin: 4px 12px 4px 4px;
  border-radius: 7px;
  border: solid 2px ${(props: colorComparison) => props.color === props.tempColor ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0)'};
  box-shadow: ${(props: colorComparison) => props.color === props.tempColor ? '2px 2px 2px 1px rgba(0, 0, 0, 0.2)' : 'none'};
`;

const ColorContent = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 4px;
  background-color: ${(props: color) => props.color};
`;

const CreateBtn = styled.div`
  cursor: pointer;
  text-align: center;
  height: 24px;
  line-height: 22px;
  border-radius: 6px;
  padding: 0 8px;
  margin: 4px 4px;
  margin-left: auto;
  background-color: rgba(255,255,255,0.8);
  border: solid 1px rgba(255,255,255,0.5);
  backdrop-filter: blur(8px);
  transition: 0.2s;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
  :hover{
    background-color: rgba(255,255,255,0.9);
  }
`;

const MemoContainer = styled.div`
  width: 100%;
  margin-top: 128px;
  height: auto;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
`;

const Memo = styled.div`
  position: relative;
  width: 200px;
  min-height: 80px;
  margin: 8px;
  border-radius: 4px;
  padding: 28px 16px 16px;
  word-break: break-all;
  box-shadow: 2px 2px 8px 1px rgba(0, 0, 0, 0.3);
`;

const MemoWrapper = styled.div`
  position: absolute;
  border-radius: 4px;
  left: 0px;
  top: 0px;
  opacity: 0.85;
  width: 100%;
  height: 100%;
  background-color: ${(props: color) => props.color};
`;

const MemoContent = styled(ScrollbarContainer)`
  max-height: 240px;
`;

const MemoEditBtn = styled.div`
  position: absolute;
  color: gray;
  right: 12px;
  top: 8px;
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: flex-end;
  cursor: pointer;
  :hover{
    color: black;
  }
`;

const MemoTextContent = styled.div`
  font-size: 14px;
  line-height: 20px;
  word-break: break-word;
`;

const CreateAtContainer = styled.div`
  font-size: 12px;
  line-height: 16px;
  padding-top: 12px;
  border-top: solid 1px rgba(160,160,160,0.8);
  margin-top: 12px;
`;

const CreateAt = styled.a`
  color: rgb(160,160,160,0.8);
  transition: 0.2s;
  :hover {
    color: rgb(80,80,80,1);
  }
`;

export const BulletinBoard: React.FC<{
  setIsBoardOn: (boo: boolean) => void;
}> = (props) => {
  const [alertState, setAlertState] = useContext(AlertContext);
  const [tempMemo, setTempMemo] = useState({ memo: "", color: memoColorList[0] });
  const [memos, setMemos] = useState<memo[]>([]);

  function addMemoByEnter(e: KeyboardEvent) {
    if (tempMemo.memo) {
      const code = e.code || e.key;
      if (code === 'Enter') {
        addMemo();
      }
    }
  };

  function sortByCreateTime() {
    let tempMemos = [...memos];
    tempMemos.sort((a, b) => a.createTime - b.createTime);
    tempMemos.forEach((item) => item.position = { x: 0, y: 0 });
    setMemos(tempMemos);
  }

  function sortByColor() {
    let tempMemos = [...memos];
    tempMemos.sort((a, b) => hexStringToColor(a.color) - hexStringToColor(b.color));
    tempMemos.forEach((item) => item.position = { x: 0, y: 0 });
    setMemos(tempMemos);
  }

  function hexStringToColor(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
    return (r + g + b);
  }

  function addMemo() {
    if (tempMemo.memo.trim() !== "") {
      const newMemo = {
        id: uuidv4(),
        memo: tempMemo.memo,
        color: tempMemo.color,
        position: { x: 0, y: 0 },
        createTime: Date.now()
      };
      setMemos([...memos, newMemo]);
      setTempMemo({ ...tempMemo, memo: "" });
    } else {
      setAlertState({ title: 'Empty memo', message: 'Please key some content' });
      setTempMemo({ ...tempMemo, memo: "" });
    }
  }

  function changePosition(coord: coord, index: number) {
    const tempMemos = [...memos];
    tempMemos[index].position = { x: coord.x, y: coord.y };
    setMemos(tempMemos);
  }

  function deleteMemo(id: string) {
    setMemos(memos.filter((item) => item.id !== id));
  }

  function clearAll() {
    setMemos([]);
  }

  function takeMemos() {
    chrome.storage.local.get(['memos'], (res) => {
      if (res.memos) {
        setMemos(res.memos);
      }
    });
  }

  useEffect(() => {
    takeMemos();
    chrome.storage.onChanged.addListener(function (changes) {
      if (changes.memos) {
        takeMemos();
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.set({ memos });
  }, [memos]);

  return (
    <Wrapper>
      <MemoContainer>
        {memos.map((item, index: number) => {
          return (
            <Draggable
              key={item.id}
              defaultPosition={{ x: 0, y: 0 }}
              position={item.position}
              onStop={(e, data) => {
                changePosition(data, index);
              }}
            >
              <Memo>
                <MemoWrapper color={item.color}></MemoWrapper>
                <MemoEditBtn onClick={() => deleteMemo(item.id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                  </svg>
                </MemoEditBtn>
                <MemoContent>
                  <MemoTextContent>{item.memo}</MemoTextContent>
                  {item.createAt &&
                    <CreateAtContainer>
                      <CreateAt href={item.createAt.url} target="_blank">create @ {item.createAt.title}</CreateAt>
                    </CreateAtContainer>
                  }
                </MemoContent>
              </Memo>
            </Draggable>
          );
        })}
      </MemoContainer>
      <CreatePanel
        panelBackground={colorScheme.light.panelBackground}
        panelBorder={colorScheme.light.panelBorder}
      >
        <MemoInput
          name="memo"
          value={tempMemo.memo}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleTextAreaChange(e, tempMemo, setTempMemo)}
          onKeyPress={(e: KeyboardEvent) => addMemoByEnter(e)}
          color={tempMemo.color}
        ></MemoInput>
        <OptionContainer>
          {memoColorList && memoColorList.map((item) => { return <ColorElement key={item} color={item} tempMemo={tempMemo} setTempMemo={setTempMemo}></ColorElement>; })}
          <CreateBtn onClick={addMemo}>Create</CreateBtn>
        </OptionContainer>
      </CreatePanel>
      <BulletinTogglePanel sortByCreateTime={sortByCreateTime} sortByColor={sortByColor} setIsBoardOn={props.setIsBoardOn} clearAll={clearAll} memos={memos}></BulletinTogglePanel>
    </Wrapper>
  );
};

const ColorElement: React.FC<{
  color: string,
  tempMemo: tempMemo,
  setTempMemo: (tempMemo: tempMemo) => void;
}> = (props) => {
  function tempMemoEdit() {
    const tempMemo = { ...props.tempMemo, color: props.color };
    props.setTempMemo(tempMemo);
  }
  return (
    <ColorBorder onClick={tempMemoEdit} color={props.color} tempColor={props.tempMemo.color}>
      <ColorContent color={props.color}></ColorContent>
    </ColorBorder>
  );
};
