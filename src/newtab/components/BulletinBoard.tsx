import React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Draggable from "react-draggable";
import { v4 as uuidv4 } from "uuid";

import { handleInputChange, handleTextAreaChange } from "../../utils/inputHandler";
import { BulletinTogglePanel } from "./BulletinTogglePanel";

const Wrapper = styled.div`
  /* border: solid 1px; */
  /* display: flex; */
  /* flex-wrap: wrap;
  flex-direction: row; */
  width: 100vw;
  height: 100vh;
  overflow-y:auto;
`;

const CreatePanel = styled.div`
  border: solid 1px;
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
  background-color: rgba(240,240,240,0.5);
  border: solid gray 0.5px;
  :focus{
    outline: solid rgba(240,240,240,1);
  }
`;

const OptionContainer = styled.div`
  display: flex;
  align-items: center;
  width: 360px;
`;

const ColorOption = styled.div`
  cursor: pointer;
  width: 16px;
  height: 16px;
  margin: 16px 8px 16px 4px;
  border-radius: 4px;
  border: solid 2px white;
  background-color: ${(props) => { return props.color; }};
`;

const ColorPick = styled.input`
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  background: none;
  border: 0;
  cursor: pointer;
  margin: 16px 16px 16px 4px;
  height: 32px;
  padding: 0;
  width: 80px;
  /* border-radius: 4px; */
  ::-webkit-color-swatch{
    border-radius: 4px;
  }
`;

const CreateBtn = styled.div`
  font-family: 'Noto Sans', 'Trebuchet MS', 'Microsoft JhengHei';
  cursor: pointer;
  text-align: center;
  width: 80px;
  height: 24px;
  line-height: 24px;
  border-radius: 4px;
  margin: 16px 4px;
  background-color: #fff;
  transition: 0.2s;
  :hover{
    background-color: rgba(0,0,0,0.5);
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
      <CreatePanel>
        <MemoInput
          name="note"
          value={tempNote.note}
          onChange={(e) => handleTextAreaChange(e, tempNote, setTempNote)}
          onKeyPress={(e) => addNoteByEnter(e)}
        ></MemoInput>
        {/* <input
          type="text"
          name="note"
          id=""
          value={tempNote.note}
          onChange={(e) => handleInputChange(e, tempNote, setTempNote)}
          onKeyPress={(e) => addNoteByEnter(e)}
        /> */}
        <OptionContainer>
          <ColorOption color="#cc164d"></ColorOption>
          <ColorOption color="#db8a18"></ColorOption>
          <ColorOption color="#d4cb26"></ColorOption>
          <ColorOption color="#36e08b"></ColorOption>
          <ColorOption color="#1aa1c9"></ColorOption>
          <ColorOption color="#764d9e"></ColorOption>
          <ColorPick type="color"></ColorPick>
          <CreateBtn onClick={addNote}>Create</CreateBtn>
        </OptionContainer>

      </CreatePanel>
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
      <BulletinTogglePanel sortByCreateTime={sortByCreateTime} setIsBoardOn={props.setIsBoardOn} clearAll={clearAll}></BulletinTogglePanel>
    </Wrapper>
  );
};