import React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Draggable from "react-draggable";
import { v4 as uuidv4 } from "uuid";

import { handleInputChange } from "../../utils/inputHandler";


const Wrapper = styled.div`
  border: solid 1px;
  /* display: flex; */
  /* flex-wrap: wrap;
  flex-direction: row; */
  width: 100vw;
  height: 100vh;
  overflow-y:auto;
`;

const MemoContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
`;

const Memo = styled.div`
  width: 240px;
  min-height: 80px;
  margin: 8px;
  border-radius: 2px;
  padding: 6px;
  word-break: break-all;
`;

export const BulletinBoard: React.FC<{ setIsBoardOn: (boo: boolean) => void; }> = (props) => {
  const [tempNote, setTempNote] = useState({ note: "" });
  const [notes, setNotes] = useState(JSON.parse(localStorage.getItem("notes")) || []);

  function addNoteByEnter(e) {
    var code = e.keyCode || e.which;
    if (code === 13) {
      addNote();
    }
  };

  function sortByCreateTime() {
    let tempNotes = [...notes];
    tempNotes.forEach((item) => item.position = { x: 0, y: 0 });
    setNotes(tempNotes);
  }

  function addNote() {
    if (tempNote.note.trim() !== "") {
      const newNote = {
        id: uuidv4(),
        note: tempNote.note,
        color: "lightgrey",
        position: { x: 0, y: 0 },
        createTime: Date.now()
      };
      setNotes([...notes, newNote]);
      setTempNote({ note: "" });
    } else {
      alert("Key some notes");
      setTempNote({ note: "" });
    }
  }

  function changePosition(coord: { x: number, y: number; }, index: number) {
    const tempNotes = [...notes];
    tempNotes[index].position = { x: coord.x, y: coord.y };
    setNotes(tempNotes);
  }

  function deleteNote(id: string) {
    setNotes(notes.filter((item) => item.id !== id));
  }

  function clearAll() {
    setNotes([]);
  }

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  return (
    <Wrapper>
      <button onClick={() => { props.setIsBoardOn(false); }}>go back</button>
      <input
        type="text"
        name="note"
        id=""
        value={tempNote.note}
        onChange={(e) => handleInputChange(e, tempNote, setTempNote)}
        onKeyPress={(e) => addNoteByEnter(e)}
      />
      <button onClick={addNote}>ENTER</button>
      <button onClick={clearAll}> Clear all</button>
      <button onClick={sortByCreateTime}>Sort by created time</button>
      <MemoContainer>
        {notes.map((item, index: number) => {
          return (
            <Draggable
              key={item.id}
              defaultPosition={{ x: 0, y: 0 }}
              position={item.position}
              onStop={(e, data) => {
                changePosition(data, index);
              }}
            >
              <Memo style={{ backgroundColor: item.color }}>
                {item.note}
                <button id="delete" onClick={(e) => deleteNote(item.id)}>
                  X
                </button>
              </Memo>
            </Draggable>
          );
        })}
      </MemoContainer>
    </Wrapper>
  );
};