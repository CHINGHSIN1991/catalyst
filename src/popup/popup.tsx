import React from 'react';
import ReactDOM from 'react-dom/client';
import styled from "styled-components";
import { ResetStyle, GlobalStyle } from "../static/globalStyle";
// import { useState, useEffect } from "react";

import { PomodoroPanel } from './PomodoroPanel';
import { ToDoList } from './ToDoList';

const Wrapper = styled.div`
  border-radius: 4px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  width: 240px;
  min-height: 120px;
  /* background-color: rgba(0,0,0,0.5); */
`;

const App: React.FC<{}> = () => {
  // const [noteCategories, setNoteCategories] = useState([]);
  // const [tempCategory, setTempCategory] = useState("");
  // const [currentCategory, setCurrentCategory] = useState('no category');
  // const [quickNote, setQuickNote] = useState("");


  // function handleTempCategory(e: React.ChangeEvent<HTMLInputElement>) {
  //   setTempCategory(e.target.value);
  // }

  // function handleCurrentCategory(e: React.ChangeEvent<HTMLSelectElement>) {
  //   setCurrentCategory(e.target.value);
  // }

  // function handleQuickNote(e: React.ChangeEvent<HTMLTextAreaElement>) {
  //   setQuickNote(e.target.value);
  // }

  // function addCategory() {
  //   const notes = noteCategories;
  //   if (tempCategory) {
  //     notes.push(tempCategory);
  //     chrome.storage.sync.set({ noteCategories: notes }, function () {
  //       console.log(notes);
  //       setNoteCategories([...notes]);
  //       setTempCategory("");
  //     });
  //   }
  // }

  // function addQuickNotes() {
  //   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //     console.log(tabs[0]);
  //     const linkUrl = new URL(tabs[0].url);
  //     const timeStamp = Date.now();
  //     const inspirationNote = {
  //       id: timeStamp,
  //       title: tabs[0].title,
  //       url: linkUrl.href,
  //       logo: `https://icon.horse/icon/${linkUrl.hostname}`,
  //       note: quickNote
  //     };
  //     // chrome.storage.sync.set({ inspirationNotes: {} }, () => { console.log('done') });
  //     chrome.storage.sync.get(['inspirationNotes'], (result) => {
  //       let tempInspirationNotes = result.inspirationNotes;
  //       let targetCategoryNotes = [];
  //       if (tempInspirationNotes) {
  //         targetCategoryNotes = tempInspirationNotes[currentCategory] || [];
  //       }
  //       targetCategoryNotes.push(inspirationNote);
  //       tempInspirationNotes = { ...tempInspirationNotes, [currentCategory]: targetCategoryNotes };
  //       console.log(tempInspirationNotes);
  //       chrome.storage.sync.set({ inspirationNotes: tempInspirationNotes }, () => { console.log('done'); });
  //       setQuickNote("");
  //     });
  //   });
  // }

  // useEffect(() => {
  //   chrome.storage.sync.get(['noteCategories'], (result) => {
  //     console.log(result.noteCategories);
  //     if (result.noteCategories) {
  //       setNoteCategories(result.noteCategories);
  //     }
  //   });
  // }, []);

  return (
    <Wrapper>
      <ResetStyle />
      <GlobalStyle />
      <PomodoroPanel></PomodoroPanel>
      <ToDoList></ToDoList>
      {/* <label htmlFor="">category
        <select value={currentCategory} onChange={handleCurrentCategory} name="" id="">
          <option value="no category" selected style={{ color: "lightgray" }}>- Category -</option>
          {noteCategories.map((category, index) => { return <option key={category + index} value={category}>{category}</option>; })}
        </select>
        <input value={tempCategory} onChange={handleTempCategory} type="text" />
        <button onClick={addCategory}>add category</button>
      </label>
      <label htmlFor="">quick note<textarea value={quickNote} onChange={handleQuickNote} name="" id=""></textarea></label>

      <button onClick={addQuickNotes}>save to Inspiration Notes</button> */}
      {/* <NotesPanel></NotesPanel> */}
    </Wrapper >
  );
};

const rootElement = document.createElement('div');
document.body.appendChild(rootElement);
const root = ReactDOM.createRoot(rootElement);

root.render(<App />);