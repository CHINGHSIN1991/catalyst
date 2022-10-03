import React from 'react';
import styled from "styled-components";
import { useState, useEffect } from "react";

import { handleInputChange, handleTextAreaChange } from '../../utils/functions';
import { AlertComponent } from './AlertComponent';

const Wrapper = styled.div`
  position: relative;
  color: rgba(40,40,40,0);
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

const TagInput = styled.input`
  color: rgba(40,40,40,1);
  box-sizing: border-box !important;
  margin: 0;
  height: 24px;
  overflow: hidden;
  border: none !important;
  border-radius: 4px;
  padding: ${(props) => { return props.isEditOn ? '0 4px !important' : '0 !important'; }}; 
  border: none;
  width: ${(props) => { return props.isEditOn ? '120px !important' : '0px !important'; }};
  transition: 0.3s;
  background-color: rgb(224,224,224);
  :focus{
    outline: none;
    background-color: rgb(200,200,200) !important;
  }
`;

const SelectOption = styled.option`
  color: rgba(40,40,40,1);
  height: 24px; 
  line-height: 24px;
  padding: 4px;
  :hover{
    box-shadow: 0 0 10px 100px #1882A8 inset;
  }
`;

const SelectBlock = styled.select`
  color: rgba(40,40,40,1);
  height: 24px;
  border-radius: 4px;
  border: none;
  width: ${(props) => { return props.isEditOn ? '0px' : '140px'; }};
  overflow: hidden;
  transition: 0.3s;
  margin: 0;
  background-color: rgb(224,224,224);
  :focus{
    border: none;
    outline: none;
  }
`;

const Title = styled.div`
  font-size: 12px;
  /* padding-bottom: 2px; */
  color: rgb(100,100,100);
  width: 100%;
  height: 16px;
  line-height: 16px;
`;

const Btn = styled.div`
  display: flex;
  font-size: bold;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: rgb(160,160,160);
  color: white;
  font-size: 12px;
  line-height: 28px;
  border-radius: 4px;
  margin-left: 4px;
  transition: 0.3s;
  width: ${(props) => { return props.isEditOn ? '48px' : '56px'; }};
  height: 24px;
  :hover{
    background-color: rgb(120,120,120);
  }
`;

const AddBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props) => { return props.isEditOn ? '24px' : '0'; }};
  overflow: hidden;
  border-radius: 4px;
  margin-left: ${(props) => { return props.isEditOn ? '4px' : '0'; }};
  transition: 0.3s;
  height: 24px;
  color: white;
  background-color: ${(props) => { return props.isEditOn ? 'rgb(144,144,144)' : 'rgb(224,224,224)'; }};
  :hover{
    background-color: rgb(96,96,96);
  }
`;

const TitleInput = styled.input`
  color: rgba(40,40,40,1);
  box-sizing: border-box;
  border: none !important;
  width: 200px !important;
  margin: 0;
  height: 28px;
  padding: 4px 8px;
  background-color: rgb(224,224,224) !important;
  border-radius: 4px;
  :focus {
    background-color: rgb(200,200,200) !important;
    outline: none;
  }
`;

const NoteArea = styled.textarea`
  color: rgba(40,40,40,1);
  font-family: 'Noto Sans', 'Trebuchet MS', 'Microsoft JhengHei';
  box-sizing: border-box;
  width: 200px !important;
  background-color: rgb(224,224,224);
  height: 56px;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  margin: 0;
  resize: none;
  :focus {
    background-color: rgb(200,200,200) !important;
    outline: none;
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

export const NotesPanel = () => {
  const [noteCategories, setNoteCategories] = useState([]);
  const [isEditOn, setIsEditOn] = useState(false);
  const [tempCategory, setTempCategory] = useState({ category: "" });
  const [currentCategory, setCurrentCategory] = useState('no category');
  const [noteLink, setNoteLink] = useState({ title: '', note: '' });
  const [processStatus, setProcessStatus] = useState(0);


  function handleCurrentCategory(e: React.ChangeEvent<HTMLSelectElement>) {
    setCurrentCategory(e.target.value);
  }

  function addCategory() {
    const notes = noteCategories;
    if (tempCategory.category) {
      notes.push(tempCategory.category);
      chrome.storage.sync.set({ noteCategories: notes }, function () {
        console.log(notes);
        setNoteCategories([...notes]);
        setTempCategory({ category: "" });
        setIsEditOn(false);
        setCurrentCategory(tempCategory.category);
      });
    }
  }

  function addQuickNotes() {
    setProcessStatus(1);
    const linkUrl = new URL(window.location.href);
    const inspirationNote = {
      id: Date.now(),
      title: noteLink.title || window.document.title,
      url: window.location.href,
      logo: `https://icon.horse/icon/${linkUrl.hostname}`,
      note: noteLink.note
    };
    chrome.storage.sync.get(['inspirationNotes'], (result) => {
      let tempInspirationNotes = result.inspirationNotes;
      let targetCategoryNotes = [];
      if (tempInspirationNotes) {
        targetCategoryNotes = tempInspirationNotes[currentCategory] || [];
      }
      targetCategoryNotes.push(inspirationNote);
      tempInspirationNotes = { ...tempInspirationNotes, [currentCategory]: targetCategoryNotes };
      console.log(tempInspirationNotes);
      chrome.storage.sync.set({ inspirationNotes: tempInspirationNotes }, () => { console.log('done'); });
      setNoteLink({ title: '', note: '' });
      setTimeout(() => setProcessStatus(2), 600);
    });
  }

  useEffect(() => {
    chrome.storage.sync.get(['noteCategories'], (result) => {
      console.log(result.noteCategories);
      if (result.noteCategories) {
        setNoteCategories(result.noteCategories);
      }
    });
  }, []);

  useEffect(() => {
    if (processStatus === 2) {
      setTimeout(() => {
        setProcessStatus(3);
      }, 600);
    } else if (processStatus === 3) {
      setTimeout(() => {
        setProcessStatus(0);
      }, 600);
    }
  }, [processStatus]);

  return (
    <Wrapper>
      <TagsPanel onClick={(e) => e.stopPropagation()}>
        <TagInput isEditOn={isEditOn} name="category" value={tempCategory.category} onChange={(e) => handleInputChange(e, tempCategory, setTempCategory)} type="text"></TagInput>
        <AddBtn isEditOn={isEditOn} onClick={addCategory}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
        </AddBtn>
        <SelectBlock isEditOn={isEditOn} value={currentCategory} onChange={handleCurrentCategory} name="" id="">
          <SelectOption value="no category" style={{ color: "darkgray" }}>- Tag -</SelectOption>
          {noteCategories.map((category, index) => { return <SelectOption key={category + index} value={category}>{category}</SelectOption>; })}
        </SelectBlock>
        <Btn isEditOn={isEditOn} onClick={(e) => { setIsEditOn(!isEditOn); }}>
          {isEditOn ? 'CANCEL' : 'ADD TAG'}
        </Btn>
      </TagsPanel>
      <InputContainer>
        <Title>Title</Title>
        <TitleInput
          name="title"
          onClick={(e) => { e.stopPropagation(); }}
          onChange={(e) => { handleInputChange(e, noteLink, setNoteLink); }}
          value={noteLink.title}
          type="text" />
      </InputContainer>
      <InputContainer>
        <Title>Quick note</Title>
        <NoteArea
          name="note"
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => { handleTextAreaChange(e, noteLink, setNoteLink); }}
          value={noteLink.note}
          id=""></NoteArea>
      </InputContainer>
      <AddNoteBtn onClick={(e) => { e.stopPropagation(); addQuickNotes(); }}>Add to Inspiration Notes</AddNoteBtn>
      <AlertComponent processStatus={processStatus}></AlertComponent>
    </Wrapper >
  );
};
