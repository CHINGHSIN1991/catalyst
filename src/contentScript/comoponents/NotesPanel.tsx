import React from 'react';
import styled from "styled-components";
import { useState, useEffect } from "react";

import { handleInputChange } from '../../utils/inputHandler';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const NotesPanel = () => {
  const [noteCategories, setNoteCategories] = useState([]);
  const [tempCategory, setTempCategory] = useState({ category: "" });
  const [currentCategory, setCurrentCategory] = useState('no category');
  const [quickNote, setQuickNote] = useState("");


  function handleCurrentCategory(e: React.ChangeEvent<HTMLSelectElement>) {
    setCurrentCategory(e.target.value);
  }

  function handleQuickNote(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setQuickNote(e.target.value);
  }

  function addCategory() {
    const notes = noteCategories;
    if (tempCategory.category) {
      notes.push(tempCategory.category);
      chrome.storage.sync.set({ noteCategories: notes }, function () {
        console.log(notes);
        setNoteCategories([...notes]);
        setTempCategory({ category: "" });
      });
    }
  }

  function addQuickNotes() {
    const linkUrl = window.location.href;
    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //   console.log(tabs[0]);
    //   const linkUrl = new URL(tabs[0].url);
    //   const timeStamp = Date.now();
    //   const inspirationNote = {
    //     id: timeStamp,
    //     title: tabs[0].title,
    //     url: linkUrl.href,
    //     logo: `https://icon.horse/icon/${linkUrl.hostname}`,
    //     note: quickNote
    //   };
    //   // chrome.storage.sync.set({ inspirationNotes: {} }, () => { console.log('done') });
    //   chrome.storage.sync.get(['inspirationNotes'], (result) => {
    //     let tempInspirationNotes = result.inspirationNotes;
    //     let targetCategoryNotes = [];
    //     if (tempInspirationNotes) {
    //       targetCategoryNotes = tempInspirationNotes[currentCategory] || [];
    //     }
    //     targetCategoryNotes.push(inspirationNote);
    //     tempInspirationNotes = { ...tempInspirationNotes, [currentCategory]: targetCategoryNotes };
    //     console.log(tempInspirationNotes);
    //     chrome.storage.sync.set({ inspirationNotes: tempInspirationNotes }, () => { console.log('done'); });
    //     setQuickNote("");
    //   });
    // });
  }

  useEffect(() => {
    chrome.storage.sync.get(['noteCategories'], (result) => {
      console.log(result.noteCategories);
      if (result.noteCategories) {
        setNoteCategories(result.noteCategories);
      }
    });
  }, []);

  return (
    <Wrapper onClick={(e) => e.stopPropagation()}>
      <label htmlFor="">category
        <select value={currentCategory} onChange={handleCurrentCategory} name="" id="">
          <option value="no category" selected style={{ color: "lightgray" }}>- Category -</option>
          {noteCategories.map((category, index) => { return <option key={category + index} value={category}>{category}</option>; })}
        </select>
        <input name="category" value={tempCategory.category} onChange={(e) => handleInputChange(e, tempCategory, setTempCategory)} type="text" />
        <button onClick={addCategory}>add category</button>
      </label>
      <label htmlFor="">quick note<textarea value={quickNote} onChange={handleQuickNote} name="" id=""></textarea></label>
      <button onClick={addQuickNotes}>save to Inspiration Notes</button>
    </Wrapper >
  );
};
