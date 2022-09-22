import React from 'react';
import styled from "styled-components";
import { useState, useEffect } from "react";

import { handleInputChange } from '../../utils/inputHandler';

const Wrapper = styled.div`
  font-family: 'Noto Sans', 'Trebuchet MS', 'Microsoft JhengHei';
  display: flex;
  flex-direction: column;
`;

const TagsPanel = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  /* border: solid 1px; */
  width: 200px;
`;

const InputContainer = styled.div`
  padding-top: 8px;
`;

const Title = styled.div`
  font-size: 12px;
  /* padding-bottom: 2px; */
  color: rgb(100,100,100);
  width: 100%;
  height: 16px;
  line-height: 16px;
`;

const NoteArea = styled.textarea`
  font-family: 'Noto Sans', 'Trebuchet MS', 'Microsoft JhengHei';
  box-sizing: border-box;
  width: 200px !important;
  background-color: ${(props) => { return props.bgColor; }};
  height: 108px;
  border: solid 1px rgb(200,200,200);
  border-radius: 4px;
  padding: 12px;
  resize: none;
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
  :hover {
    background-color: ${(props) => { return props.bgColor; }};
    border: solid 1px rgb(200,200,200);
  }
  :focus {
    outline: none;
    background-color: ${(props) => { return props.bgColor; }};
    border: solid 1px rgb(200,200,200);
  }
`;

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
  color: rgba(80,80,80,1);
  background-color: rgba(80,80,80,0);
  border: solid 2px rgba(80,80,80,1);
  transition: 0.2s;
  :hover{
    color: rgba(255,255,255,1);
    background-color: rgba(80,80,80,1);
  }
`;

const ColorPanel = styled.div`
  display: flex;
  box-sizing: border-box;
  /* border: solid 1px; */
  width: 200px;
  height: 24px;
`;

const ColorContainer = styled.div`
  box-sizing: border-box;
  border-radius: ${(props) => { return props.code === props.currentColor ? '6px' : '5px'; }};  
  border: solid ${(props) => { return props.code === props.currentColor ? '2px rgba(120,120,120,1)' : '1px rgba(184,184,184,0.8)'; }};
  height: 24px;
  width: 18px;
  margin-right: 8px;
`;

const Color = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 4px;
  background-color: ${(props) => { return props.code; }};
`;

const colorList = ['#EAEAEA', '#FFDCF1', '#FFF4C0', '#DCFFCC', '#DEF9FF', '#EEDCFF'];

export const MemoPanel = () => {
  const [currentColor, setCurrentColor] = useState('#EAEAEA');
  const [quickNote, setQuickNote] = useState("");


  function handleQuickNote(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setQuickNote(e.target.value);
  }

  return (
    <Wrapper>
      <ColorPanel onClick={(e) => e.stopPropagation()}>
        {colorList && colorList.map((code) => {
          return (<ColorContainer
            code={code}
            onClick={() => setCurrentColor(code)}
            currentColor={currentColor}
          ><Color code={code} /></ColorContainer>);
        }
        )}
      </ColorPanel>
      <InputContainer>
        <Title>Memo</Title>
        <NoteArea onClick={(e) => e.stopPropagation()} value={quickNote} onChange={handleQuickNote} name="" id="" bgColor={currentColor}></NoteArea>
      </InputContainer>
      <AddNoteBtn>Add to Bulletin Board</AddNoteBtn>
    </Wrapper >
  );
};
