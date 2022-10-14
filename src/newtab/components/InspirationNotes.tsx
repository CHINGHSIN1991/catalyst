import React from 'react';
import styled from "styled-components";
import { useState, useEffect, useContext } from "react";
import { useSelector } from 'react-redux';

import { getShortcuts } from '../features/reducers/shortcutsSlice';
import AlertContext from '../features/alertContext';

import { PanelBasicSetting, PanelTitle, ScrollbarContainer } from '../../static/styleSetting';
import { handleInputChange, handleTextAreaChange, handleErrorImage } from '../../utils/functions';
import { scheme, isEditOn, inspirationNote } from '../../static/types';

type length = { length: number; };
type shortcutNumber = { shortcutNumber: number; };

const TempLinksPanel = styled(PanelBasicSetting)`
  display: flex;
  flex-grow:1;
  flex-shrink:1;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 0;
  flex-shrink:0;
  width: 24px;
  height: 24px;
  background-color: rgba(255,255,255,0.9);
  border-radius: 4px;
  margin-right: 8px;
`;

const NoteLinkIcon = styled.img`
  width: 14px;
  height: 14px;
  border-radius: 2px;
  object-fit: cover;
`;

const TempLinks = styled.ul`
  display: ${(props: length) => props.length === 0 ? 'none' : 'flex'};
  flex-direction: column;
  border: solid 1px rgba(255,255,255,0);
  border-radius: 4px;
  padding: 8px 4px;
  width: 100%;
  transition: 0.2s;
  :hover {
    background-color: rgba(255,255,255,0.1);
  }
`;

const CategoryTitle = styled.div`
  font-size: 0.875rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-right:  64px;
`;

const CategoryHr = styled.div`
  width: 100%;
  margin: 8px 0;
  background-color: rgba(180,180,180,0.5);
  height: 1px;
`;

const TextTitle = styled.div`
  font-size: 0.875rem;
  line-height: 1rem;
  padding: 4px 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const TextNote = styled.div`
  height: 0px;
  padding-top: 0px;
  font-size: 0.75rem;
  line-height: 1rem;
  color: rgb(200,200,200);
  text-overflow: ellipsis;
  word-break: break-all;
  overflow: hidden;
`;

const TitleEdit = styled.input`
  height: 24px;
  width: 100%;
  background-color: rgba(0,0,0,0.2);
  padding: 4px 8px;
  border: solid 1px darkgrey;
  outline: none;
  color: ${(props: scheme) => props.theme.primary};
  border-radius: 4px;
  transition: 0.3s;
  :focus{
    background-color: rgba(0,0,0,0.4);
  }
`;

const NoteEdit = styled.textarea`
  width: 100%;
  height: 56px;
  resize: none;
  background-color: rgba(0,0,0,0.2);
  border: solid 1px darkgrey;
  outline: none;
  color: ${(props: scheme) => props.theme.primary};
  border-radius: 4px;
  transition: 0.3s;
  padding: 4px 8px;
  :focus{
    background-color: rgba(0,0,0,0.4);
  }
`;

const TempLink = styled.li`
  flex-shrink:0;
  padding: 8px 4px;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.3s;
  margin: 4px 0;
  
  :hover{
    background-color: rgba(240,240,240,0.1);
    transform: translateY(-2px);
    box-shadow: 2px 2px 4px 1px rgba(0, 0, 0, 0.1);
    ${TextNote}{
      padding-top: 4px;
      max-height: 40px;
      height: 100%;
    }
  }
`;

const LinkContent = styled.div`
  display: flex;
  align-items: flex-start;
  color: ${(props: scheme) => props.theme.primary};
`;

const TextContent = styled.a`
  color: ${(props: scheme) => props.theme.primary};
  flex-grow: 1;
  overflow: hidden;
`;

const EditTrigger = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 8px;
  width: 16px;
`;

const ScrollContainer = styled(ScrollbarContainer)`
  display: flex;
  flex-direction: column;
  padding-right: 2px;
  max-height: ${(props: shortcutNumber) => `calc(100vh - (288px + ${Math.ceil((props.shortcutNumber + 1) / 4) * 88}px ))`};
  flex-grow: 1;  
  @media (max-width:1180px) {
    max-height: calc(100vh - 332px);
  } 
`;

const EditPanel = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  padding: ${(props: isEditOn) => props.isEditOn ? '16px' : '0px'};
  border-radius: 4px;
  top: 0;
  right: 0;
  transition: 0.1s;
  width: ${(props: isEditOn) => props.isEditOn ? "100%" : "0%"};
  height: 100%;
  background-color: rgba(80,80,80,0.5);
  backdrop-filter: blur(8px);
  overflow: hidden;
`;

const CompleteBtns = styled.div`
  display: flex;
  flex-direction: column;
  width: 96px;
`;

const Btn = styled.div`
  font-size: .75rem;
  line-height: 20px;
  color: black;
  height: 20px;
  width: calc(100% - 12px);
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  margin: 2px 6px;
  transition: 0.2s;
  background-color: rgba(240,240,240,0.7);
  :hover {
    background-color: rgba(255,255,255,0.9);
  }
`;

const DeleteTagButton = styled.div`
  padding: 0 3px;
  color: rgba(255,255,255,0.3);
  background-color: rgba(0,0,0,0.1);
  text-align: end;
  font-size: 12px;
  line-height: 16px;
  position: absolute;
  overflow: hidden;
  right: 8px;
  top: 8px;
  border: solid 1px rgba(255,255,255,0.0);
  border-radius: 8px;
  width: 16px;
  height: 16px;
  cursor: pointer;
  white-space: nowrap;
  transition: 0.2s;
  text-align: center;
  :hover {
    width: 64px;
    border: solid 1px rgba(255,255,255,0.5);
    color: rgba(255,255,255,0.8);
  }
`;

const EditOption = styled.div`
  padding: 6px;
  margin: 8px 24px;
  opacity: ${(props: isEditOn) => props.isEditOn ? 1 : 0};
  transform: ${(props: isEditOn) => props.isEditOn ? 'translateY(0%)' : 'translateY(50%)'};  
  transition: 0.2s;
  font-size: 0.75rem;
  color: black;
  text-align: center;
  width: 100%;
  border-radius: 4px;
  background-color: rgba(255,255,255,0.6);
  :hover{
    background-color: rgba(255,255,255,0.95);
  }
`;

const EditOption1 = styled(EditOption)`
  transition-delay: 0.15s;
  transition-property: transform,opacity;
`;

const EditOption2 = styled(EditOption)`
  transition-delay: 0.2s;
  transition-property: transform,opacity;
`;

export const InspirationNotePanel: React.FC<{}> = () => {
  const ShortcutNumber = useSelector(getShortcuts);
  const [alertState, setAlertState] = useContext(AlertContext);
  const [noteCategories, setNoteCategories] = useState([]);
  const [inspirationNotes, setInspirationNotes] = useState(null);
  const [tempNote, setTempNote] = useState({
    id: 0,
    logo: "",
    note: "",
    title: "",
    url: "",
  });

  function changeNote() {
    let tempNotes = {};
    ["no category", ...noteCategories].forEach((category) => {
      if (inspirationNotes[category]) {
        let tempArray = [];
        inspirationNotes[category].forEach((note: inspirationNote) => {
          if (note.id === tempNote.id) {
            tempArray.push(tempNote);
          } else {
            tempArray.push(note);
          }
        });
        tempNotes[category] = tempArray;
      }
    });
    setChromeSyncNotes(tempNotes);
  }

  function delNote(id: number) {
    let tempNotes = {};
    let tempCategories = [];
    if (noteCategories) {
      tempCategories = ["no category", ...noteCategories];
    } else {
      tempCategories = ["no category"];
    }
    tempCategories.forEach((category) => {
      if (inspirationNotes[category]) {
        let tempArray = [];
        inspirationNotes[category].forEach((note: inspirationNote) => {
          if (note.id === id) {
          } else {
            tempArray.push(note);
          }
        });
        tempNotes[category] = tempArray;
      }
    });
    setChromeSyncNotes(tempNotes);
  }

  function setChromeSyncNotes(notes: { [key: string]: inspirationNote[]; }) {
    chrome.storage.sync.set({ inspirationNotes: notes }, function () {
      setInspirationNotes(notes);
    });
  }

  function deleteTag(deletedTag: string) {
    const tempNoteCategories = [...noteCategories].filter((item) => item !== deletedTag);
    const tempInspirationNotes = JSON.parse(JSON.stringify(inspirationNotes));
    delete tempInspirationNotes[deletedTag];
    chrome.storage.sync.set({ noteCategories: tempNoteCategories, inspirationNotes: tempInspirationNotes }, function () {
      setNoteCategories(tempNoteCategories);
      setInspirationNotes(tempInspirationNotes);
    });
  }

  function checkToDeleteTag(deletedTag: string) {
    setAlertState({
      title: 'All notes with this tag will be deleted',
      message: 'Are you sure you want to delete this tag?',
      function: () => deleteTag(deletedTag)
    });
  }

  useEffect(() => {
    chrome.storage.sync.get(['inspirationNotes', 'noteCategories'], (result) => {
      setInspirationNotes(result.inspirationNotes);
      setNoteCategories(result.noteCategories);
    });
  }, []);

  return (
    <TempLinksPanel>
      <PanelTitle>Inspiration Notes</PanelTitle>
      <ScrollContainer shortcutNumber={ShortcutNumber.length}>
        {inspirationNotes && "no category" in inspirationNotes &&
          <TempLinks length={inspirationNotes["no category"].length}>
            {inspirationNotes["no category"] && inspirationNotes["no category"].map((note: inspirationNote) => {
              return (
                <TempLinkElement key={note.id} note={note} tempNote={tempNote} setTempNote={setTempNote} delNote={delNote} changeNote={changeNote}></TempLinkElement>
              );
            })}
          </TempLinks>
        }
        {noteCategories && inspirationNotes && noteCategories.map((category, index) => {
          return (
            <TempLinks key={category + index} length={inspirationNotes[category].length}>
              <DeleteTagButton onClick={() => checkToDeleteTag(category)}>
                ╳ Delete
              </DeleteTagButton>
              <CategoryTitle>{inspirationNotes[category] && !!inspirationNotes[category].length && category}</CategoryTitle>
              <CategoryHr></CategoryHr>
              {inspirationNotes[category] && inspirationNotes[category].map((note: inspirationNote) => {
                return (
                  <TempLinkElement key={note.id} note={note} tempNote={tempNote} setTempNote={setTempNote} delNote={delNote} changeNote={changeNote}></TempLinkElement>
                );
              })}
            </TempLinks>
          );
        })}
      </ScrollContainer>
    </TempLinksPanel >
  );
};

const TempLinkElement: React.FC<{
  note: inspirationNote,
  tempNote: inspirationNote,
  setTempNote: (note: inspirationNote) => void,
  delNote: (id: number) => void,
  changeNote: () => void,
}> = (props) => {
  const [isEditOn, setIsEditOn] = useState(false);

  return (
    <TempLink key={props.note.id} onMouseLeave={() => { setIsEditOn(false); }}>
      <LinkContent>
        <IconContainer>
          <NoteLinkIcon src={props.note.logo} onError={(e: Event) => handleErrorImage(e)}></NoteLinkIcon>
        </IconContainer>
        {props.tempNote.id !== props.note.id && <TextContent href={props.note.url} target="_blank">
          <TextTitle>{props.note.title}</TextTitle>
          <TextNote>{props.note.note}</TextNote>
        </TextContent>}
        {props.tempNote.id === props.note.id && <TextContent>
          <TitleEdit value={props.tempNote.title} name="title" type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, props.tempNote, props.setTempNote)}></TitleEdit>
          <NoteEdit value={props.tempNote.note} name="note" type="text" onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleTextAreaChange(e, props.tempNote, props.setTempNote)}></NoteEdit>
        </TextContent>}
        {props.tempNote.id !== props.note.id && <EditTrigger title="More actions" onClick={(e: Event) => { e.stopPropagation(); setIsEditOn(true); }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
          </svg>
        </EditTrigger>}
        {props.tempNote.id === props.note.id && <CompleteBtns>
          <Btn onClick={() => {
            props.changeNote(); props.setTempNote({
              id: 0,
              logo: "",
              note: "",
              title: "",
              url: "",
            });
          }}>Done</Btn>
          <Btn onClick={() => props.setTempNote({
            id: 0,
            logo: "",
            note: "",
            title: "",
            url: "",
          })}>Cancel</Btn>
        </CompleteBtns>}
      </LinkContent>
      <EditPanel isEditOn={isEditOn} onClick={(e: Event) => { e.stopPropagation(); setIsEditOn(false); }}>
        <EditOption1 isEditOn={isEditOn} onClick={(e: Event) => { e.stopPropagation(); props.setTempNote(props.note); setIsEditOn(false); }}>Edit</EditOption1>
        <EditOption2 isEditOn={isEditOn} onClick={(e: Event) => { e.stopPropagation(); props.delNote(props.note.id); }}>Delete</EditOption2>
      </EditPanel>
    </TempLink>
  );
};