import React from 'react';
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';

import { getShortcuts, deleteShortcut, loadShortcuts } from '../features/reducers/shortcutsSlice';
import { setEditPanel } from '../features/reducers/editSlice';

import { PanelBasicSetting, ScrollbarList } from '../../static/styleSetting';
import { handleErrorImage, handleInputChange } from '../../utils/functions';
import { shortcut, scheme, isEditOn } from '../../static/types';

interface query {
  searchQuery: string,
}

const OrgFunctionPanel = styled(PanelBasicSetting)`
`;

const SearchPanel = styled.div`
  display: flex;
`;

const SearchInput = styled.input`
  background-color: rgba(255,255,255,0);
  width: 100%;
  color: ${(props: scheme) => props.theme.primary};
  height: 36px;
  padding: 8px 34px 8px 8px;
  margin: 2px 2px 16px 2px;
  transition: 0.2s;
  display:block;
  border:none;
  border-bottom:1px solid ${(props: scheme) => props.theme.primary};
  :focus {
    background-color: rgba(255,255,255,0.2);
    outline: none;
    border:none;
    border-bottom:1px solid white;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  color: ${(props: query) => { return props.searchQuery === '' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)'; }};
  top: 10px;
  right: 12px;
  width: 16px;
  height: 16px;
  cursor: pointer;
  transition: 0.3s;
  
  :hover{
    color: ${(props: scheme) => props.theme.primary};
  }
`;

const ShortcutsList = styled(ScrollbarList)`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  max-height: 280px;

  @media (max-width:1580px) {
    max-height: 200px;
  }
`;

const EditOptionContainer = styled.div`
  position: absolute;
  left: 0px;
  top: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  padding: ${(props: isEditOn) => props.isEditOn ? '8px' : '0px'};
  width: 100%;
  height: ${(props: isEditOn) => props.isEditOn ? '100%' : '0%'};
  transition-delay: opacity 0.3s;
  transition: 0.05s;
  background-color: rgba(80,80,80,0.5);
  backdrop-filter: blur(8px);
  overflow: hidden;
`;

const EditOption = styled.div`
  padding: ${(props: isEditOn) => props.isEditOn ? '4px' : '0px'};
  margin: ${(props: isEditOn) => props.isEditOn ? '3px' : '0px'};
  opacity: ${(props: isEditOn) => props.isEditOn ? 1 : 0};
  transform: ${(props: isEditOn) => props.isEditOn ? 'translateY(30%)' : 'translateY(80%)'};  
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

const EditIcon = styled.div`
  position: absolute;
  right: 2px;
  top: 2px;
  width: 16px;
  height: 24px;
  border-radius: 8px;
  transition: 0.1s;
  transition-delay: 0.9s;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
`;

const Shortcut = styled.li`
  position: relative;
  margin: 2px;
  border-radius: 4px;
  padding: 12px 24px;
  width: 74px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  transition: 0.2s;

  :hover {
    background-color: rgba(255,255,255,0.1);
    ${EditIcon}{
      opacity: 1;
    }
  }
`;

const LinkUrl = styled.a`
  color: ${(props: scheme) => props.theme.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 64px;
`;

const LinkTitle = styled.p`
  font-size: 0.75rem;
  line-height: 1rem;
  padding-top: 8px;
  width: 76px;
  text-align: center;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const ShortcutIconContainer = styled.div`
  width: 40px;
  height: 40px;
  background-color: rgba(255,255,255,0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ShortcutIcon = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  object-fit: cover;
`;

export const ShortcutsPanel: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const shortcuts = useSelector(getShortcuts);
  const [searchQuery, setSearchQuery] = useState({ text: "" });


  function delShortcut(id: number) {
    let tempLinks = shortcuts.filter((link) => link.id !== id);
    chrome.storage.sync.set({ shortcuts: tempLinks });
  }

  function search() {
    chrome.search.query({
      disposition: "NEW_TAB",
      text: searchQuery.text
    }, () => { });
  }

  function searchByEnter(e: KeyboardEvent) {
    const code = e.code || e.key;
    if (code === 'Enter') {
      search();
    }
  };

  useEffect(() => {
    chrome.storage.sync.get(['shortcuts'], function (res) {
      if (res.shortcuts) {
        dispatch(loadShortcuts(res.shortcuts));
      } else {
        dispatch(loadShortcuts([]));
      }
    });
  }, []);

  return (
    <OrgFunctionPanel>
      <SearchPanel>
        <SearchInput type="text" name="text" onKeyPress={(e: KeyboardEvent) => searchByEnter(e)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, searchQuery, setSearchQuery)} />
        <SearchIcon searchQuery={searchQuery.text} onClick={search}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
          </svg>
        </SearchIcon>
      </SearchPanel>
      <ShortcutsList>
        {shortcuts && !!shortcuts.length && shortcuts.map((shortcut) => {
          return <LinkElement key={shortcut.id} shortcut={shortcut} delShortcut={delShortcut}></LinkElement>;
        })}
        <Shortcut onClick={() => { dispatch(setEditPanel({ name: 'ShortcutAdd' })); }}>
          <ShortcutIconContainer>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" style={{ color: "gray" }} fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
            </svg>
          </ShortcutIconContainer>
          <LinkTitle>Add shortcut</LinkTitle>
        </Shortcut>
      </ShortcutsList>
    </OrgFunctionPanel>
  );
};

const LinkElement: React.FC<{ shortcut: shortcut; delShortcut: (id: number) => void; }> = (props) => {
  const dispatch = useDispatch();
  const [isEditOn, setIsEditOn] = useState(false);

  return (
    <Shortcut key={props.shortcut.id} onMouseLeave={() => setIsEditOn(false)}>
      <LinkUrl href={props.shortcut.url} target="_blank">
        <ShortcutIconContainer>
          <ShortcutIcon src={props.shortcut.logo} onError={(e: Event) => handleErrorImage(e)}></ShortcutIcon>
        </ShortcutIconContainer>
        <LinkTitle>{props.shortcut.name}</LinkTitle>
      </LinkUrl>
      <EditOptionContainer isEditOn={isEditOn}>
        <EditOption1 isEditOn={isEditOn} onClick={() => { dispatch(setEditPanel({ name: 'ShortcutEdit', data: props.shortcut })); }}>Edit</EditOption1>
        <EditOption2 isEditOn={isEditOn} onClick={() => { dispatch(deleteShortcut(props.shortcut)); }}>Delete</EditOption2>
      </EditOptionContainer>
      <EditIcon title='More actions' onClick={() => setIsEditOn(!isEditOn)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
          <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
        </svg>
      </EditIcon>
    </Shortcut >
  );
};