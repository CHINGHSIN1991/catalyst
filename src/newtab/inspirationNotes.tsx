import React from 'react';
import styled from "styled-components";
import { useState, useEffect } from "react";

import { PanelBasicSetting } from './styleSetting';

const TempLinksPanel = styled(PanelBasicSetting)`
`

const NoteLinkIcon = styled.img`
  width: 24px;
  height: 24px;
  object-fit: cover;
`

const TempLinks = styled.ul`
  border: solid 1px;
  width: 100%;
`

const TempLink = styled.li`
  cursor: pointer;
`

interface note {
  id: number;
  logo: string;
  note: string;
  title: string;
  url: string;
}

export const InspirationNotePanel: React.FC<{}> = () => {
  const [noteCategories, setNoteCategories] = useState([])
  const [inspirationNotes, setInspirationNotes] = useState({});
  const [tempNote, setTempNote] = useState({
    id: 0,
    logo: "",
    note: "",
    title: "",
    url: "",
  });
  const [isEditOn, setIsEditOn] = useState(false);

  function openTab(note: note) {
    setTempNote(note);
    setIsEditOn(true);
  }

  function handleTempNote(e: React.ChangeEvent<HTMLInputElement>) {
    setTempNote({ ...tempNote, [e.target.name]: e.target.value })
    console.log({ ...tempNote, [e.target.name]: e.target.value });
  }

  function changeNote() {
    let tempNotes = {}
    noteCategories.forEach((category) => {
      if (inspirationNotes[category]) {
        let tempArray = []
        inspirationNotes[category].forEach((note: note) => {
          if (note.id === tempNote.id) {
            tempArray.push(tempNote)
          } else {
            tempArray.push(note)
          }
        })
        tempNotes[category] = tempArray
      }
    })
    setChromeSyncNotes(tempNotes);
    setIsEditOn(false);
  }

  function delNote(id: number) {
    let tempNotes = {}
    noteCategories.forEach((category) => {
      if (inspirationNotes[category]) {
        let tempArray = []
        inspirationNotes[category].forEach((note: note) => {
          if (note.id === id) {
          } else {
            tempArray.push(note)
          }
        })
        tempNotes[category] = tempArray
      }
    })
    setChromeSyncNotes(tempNotes);
    setIsEditOn(false);
  }

  function setChromeSyncNotes(notes: { [key: string]: note[] }) {
    chrome.storage.sync.set({ inspirationNotes: notes }, function () {
      console.log(notes);
      setInspirationNotes(notes);
    });
  }

  useEffect(() => {
    chrome.storage.sync.get(['inspirationNotes', 'noteCategories'], (result) => {
      setInspirationNotes(result.inspirationNotes);
      setNoteCategories(result.noteCategories);
      console.log(result.inspirationNotes);
    });
  }, [])

  return (
    <TempLinksPanel>
      Inspiration Notes
      <hr />
      {!!noteCategories.length && noteCategories.map((category, index) => {
        return (
          <TempLinks key={category + index}>
            {inspirationNotes[category] && category}
            {inspirationNotes[category] && inspirationNotes[category].map((note: note) => {
              return (
                <TempLink key={note.id}>
                  <button onClick={() => { openTab(note) }}>edit</button>
                  <button onClick={() => { delNote(note.id) }}>x</button>
                  <a href={note.url} target="_blank">
                    <NoteLinkIcon src={note.logo}></NoteLinkIcon>
                    <div>
                      <div>{note.title}</div>
                      <div>{note.note}</div>
                    </div>
                  </a>
                </TempLink>
              );
            })}
          </TempLinks>
        );
      })}
      {isEditOn &&
        <div>
          <label htmlFor="">Title<input name="title" type="text" value={tempNote.title} onChange={handleTempNote} /></label>
          <label htmlFor="">Quick Note<input name="note" type="text" value={tempNote.note} onChange={handleTempNote} /></label>
          <button onClick={changeNote}>Conform</button>
          <button onClick={() => { setIsEditOn(false) }}>Cancel</button>
        </div>
      }

    </TempLinksPanel>
  );
}