import React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Draggable from "react-draggable";
import { v4 as uuidv4 } from "uuid";

import { handleInputChange, handleTextAreaChange } from "../../utils/inputHandler";
import { BulletinTogglePanel } from "./BulletinTogglePanel";
import { memoColorList } from "../../static/optionList";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  overflow-y:auto;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-button {
    display: none;
    /* background: transparent;
    border-radius: 4px; */
  }
  &::-webkit-scrollbar-track-piece {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0,0,0,0.4);
    border: 1px solid slategrey
  }
  &::-webkit-scrollbar-track {
    box-shadow: transparent;
  }
`;

const CreatePanel = styled.div`
  /* border: solid 1px; */
  padding-top: 24px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const MemoInput = styled.textarea`
  border-radius: 4px;
  resize: none;
  padding: 8px;
  width: 360px;
  height: 64px;
  background-color: ${(props) => { return props.bgColor; }};
  opacity: 0.8;
  border: solid rgb(160,160,160) 2px;
  z-index: 3;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-button {
    display: none;
    /* background: transparent;
    border-radius: 4px; */
  }
  &::-webkit-scrollbar-track-piece {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0,0,0,0.1);
  }
  &::-webkit-scrollbar-track {
    box-shadow: transparent;
  }
  :focus{
    outline: solid 2px rgba(200,200,200,1);
  }
`;

const OptionContainer = styled.div`
  display: flex;
  align-items: center;
  width: 360px;
  z-index: 3;
`;

const ColorBorder = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 24px;
  margin: 8px 8px 8px 4px;
  border-radius: 6px;
  border: solid 2px ${(props) => { return props.color === props.tempColor ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0)'; }};
  box-shadow: ${(props) => { return props.color === props.tempColor ? '2px 2px 2px 1px rgba(0, 0, 0, 0.2)' : 'none'; }};
`;

const ColorContent = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 4px;
  background-color: ${(props) => { return props.color; }};
`;

const ColorPick = styled.input`
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  background: none;
  border: 0;
  cursor: pointer;
  margin: 8px 16px 8px 4px;
  height: 32px;
  padding: 0;
  width: 80px;
  /* border-radius: 4px; */
  ::-webkit-color-swatch{
    border-radius: 4px;
  }
`;

const CreateBtn = styled.div`
  cursor: pointer;
  text-align: center;
  height: 24px;
  line-height: 22px;
  border-radius: 6px;
  padding: 0 8px;
  margin: 8px 4px;
  margin-left: auto;
  /* box-shadow: 0px 5px 5px rgba(0,0,0,0.4); */
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
  background-color: ${(props) => { return props.color; }};
`;

const MemoContent = styled.div`
  max-height: 240px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-button {
    display: none;
    /* background: transparent;
    border-radius: 4px; */
  }
  &::-webkit-scrollbar-track-piece {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0,0,0,0.15);
  }
  &::-webkit-scrollbar-track {
    box-shadow: transparent;
  }
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

const MemoEditPanel = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  right: 12px;
  top: 24px;
  width: 64px;
  transition: 0.05s;
  height: ${(props) => { console.log(props.editId); return props.id === props.editId ? '40px' : '0px'; }};
  border-radius: 4px;
  overflow: hidden;
`;

const MemoEditOption = styled.div`
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  width: 100%;
  height: 20px;
  background-color: rgb(120,120,120);
  color: white;
  transition: 0.1s;
  cursor: pointer;
  :hover{
    background-color: rgb(80,80,80);
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

type memo = {
  id: string,
  memo: string,
  color: string,
  position: { x: number, y: number; },
  createTime: number,
  createAt?: { title: string, url: string; },
};

type tempMemo = {
  memo: string;
  color: string;
};

export const BulletinBoard: React.FC<{ setIsBoardOn: (boo: boolean) => void; }> = (props) => {
  const [tempMemo, setTempMemo] = useState({ memo: "", color: memoColorList[0] });
  const [memos, setMemos] = useState<memo[]>([]);

  function addMemoByEnter(e) {
    var code = e.keyCode || e.which;
    if (code === 13) {
      addMemo();
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
    // return (r | g << 8 | b << 16);
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
      alert("Key some memos");
      setTempMemo({ ...tempMemo, memo: "" });
    }
  }

  function changePosition(coord: { x: number, y: number; }, index: number) {
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

  useEffect(() => {
    chrome.storage.local.get(['memos'], (res) => {
      if (res.memos) {
        setMemos(res.memos);
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.set({ memos });
  }, [memos]);

  return (
    <Wrapper>
      <CreatePanel>
        <MemoInput
          name="memo"
          value={tempMemo.memo}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleTextAreaChange(e, tempMemo, setTempMemo)}
          onKeyPress={(e: Event) => addMemoByEnter(e)}
          bgColor={tempMemo.color}
        ></MemoInput>
        <OptionContainer>
          {memoColorList && memoColorList.map((item) => { return <ColorElement key={item} color={item} tempMemo={tempMemo} setTempMemo={setTempMemo}></ColorElement>; })}
          {/* <ColorPick type="color"></ColorPick> */}
          <CreateBtn onClick={addMemo}>Create a memo</CreateBtn>
        </OptionContainer>
      </CreatePanel>
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
                  {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots" viewBox="0 0 16 16">
                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                  </svg> */}
                </MemoEditBtn>
                <MemoContent>
                  <MemoTextContent>{item.memo}</MemoTextContent>
                  {item.createAt &&
                    <CreateAtContainer>
                      <CreateAt href={item.createAt.url} target="_blank">create @ {item.createAt.title}</CreateAt>
                    </CreateAtContainer>
                  }
                </MemoContent>
                {/* <MemoEditPanel id={item.id} editId={editMemo && editMemo.id}>
                  <MemoEditOption onClick={() => setEditOn(true)}>Edit</MemoEditOption>
                  <MemoEditOption onClick={() => deleteMemo(item.id)}>Delete</MemoEditOption>
                </MemoEditPanel> */}
              </Memo>
            </Draggable>
          );
        })}
      </MemoContainer>
      <BulletinTogglePanel sortByCreateTime={sortByCreateTime} sortByColor={sortByColor} setIsBoardOn={props.setIsBoardOn} clearAll={clearAll}></BulletinTogglePanel>
    </Wrapper>
  );
};

const ColorElement: React.FC<{ color: string; tempMemo: tempMemo; setTempMemo: (tempMemo: tempMemo) => void; }> = (props) => {
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
