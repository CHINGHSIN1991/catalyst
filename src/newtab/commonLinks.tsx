import React from 'react';
import styled from "styled-components";
import { useState, useEffect } from "react";

import { PanelBasicSetting } from './styleSetting';
import { handleInputChange } from '../utils/inputHandler';

const OrgFunctionPanel = styled(PanelBasicSetting)`
  /* border: solid 1px;   */
`;
const CommonLinksList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  /* border: solid 1px; */
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
  padding: ${(props) => { return props.isOptionOn ? '8px' : '0px'; }};
  width: 100%;
  height: ${(props) => { return props.isOptionOn ? '100%' : '0%'; }};
  transition-delay: opacity 0.3s;
  transition: 0.3s;
  background-color: rgba(48,48,48,0.75);
  backdrop-filter: blur(8px);
  overflow: hidden;
`;

const EditOption = styled.div`
  padding: ${(props) => { return props.isOptionOn ? '4px' : '0px'; }};
  margin: ${(props) => { return props.isOptionOn ? '3px' : '0px'; }};
  opacity: ${(props) => { return props.isOptionOn ? 1 : 0; }};
  transform: ${(props) => { return props.isOptionOn ? 'translateY(30%)' : 'translateY(80%)'; }};  
  transition: 0.2s;
  font-size: 0.75rem;
  color: black;
  text-align: center;
  width: 100%;
  border-radius: 4px;
  background-color: rgba(255,255,255,0.6);
  :hover{
    background-color: rgba(255,255,255,0.9);
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
  /* border: solid 1px; */
  right: 2px;
  top: 2px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  transition: 0.1s;
  transition-delay: 0.9s;
  background: rgba(255,255,255,0);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
`;

const CommonLink = styled.li`
  /* border:solid 1px; */
  position: relative;
  margin: 2px;
  border-radius: 4px;
  padding: 16px 24px;
  width: 98px;
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
      background-color: rgba(255,255,255,0.3);
    }
  }
`;

const LinkUrl = styled.a`
  color: white;
  /* border: solid 1px; */
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 64px;
  /* height: 80px; */
`;

const LinkTitle = styled.p`
  font-size: 0.75rem;
  line-height: 1rem;
  padding-top: 8px;
  width: 80px;
  text-align: center;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const CommonLinkIconContainer = styled.div`
  width: 40px;
  height: 40px;
  background-color: rgba(255,255,255,0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CommonLinkIcon = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  object-fit: cover;
`;

type commonLink = {
  id: number,
  logo: string,
  name: string,
  url: string,
};

export const CommonLinkPanel: React.FC<{}> = () => {
  const [editLink, setEditLink] = useState({
    id: 0,
    logo: "",
    name: "",
    url: "",
  });
  const [isEditOn, setIsEditOn] = useState(false);
  const [searchQuery, setSearchQuery] = useState({ text: "" });
  const [commonLinks, setCommonLinks] = useState([]);
  const [tempCommonLink, setTempCommonLink] = useState({
    commonLinkName: "",
    commonLinkUrl: "",
  });

  function addCommonLink() {
    let tempLinks = commonLinks || [];
    const linkUrl = new URL(tempCommonLink.commonLinkUrl);
    const id = Date.now();
    const name = tempCommonLink.commonLinkName;
    const url = linkUrl.href;
    const logo = `https://icon.horse/icon/${linkUrl.hostname}`;
    tempLinks.push({ name, url, logo, id });
    setChromeSyncLinks([...tempLinks]);
    setTempCommonLink({
      commonLinkName: "",
      commonLinkUrl: "",
    });

  }

  function openTab(item: { name: string, id: number, logo: string, url: string; }) {
    setIsEditOn(true);
    setEditLink(item);
  }

  function changeCommonLink() {
    let tempLinks = [];
    commonLinks.forEach((item) => {
      if (item.id === editLink.id) {
        tempLinks.push(editLink);
      } else {
        tempLinks.push(item);
      }
    });
    setChromeSyncLinks(tempLinks);
    setEditLink({
      id: 0,
      logo: "",
      name: "",
      url: "",
    });
    setIsEditOn(false);
  }

  function setChromeSyncLinks(links: { name: string, id: number, logo: string, url: string; }[]) {
    chrome.storage.sync.set({ commonLinks: links }, function () {
      console.log(links);
      setCommonLinks(links);
    });
  }

  function delCommonLink(id: number) {
    let tempLinks = commonLinks.filter((link) => link.id !== id);
    chrome.storage.sync.set({ commonLinks: tempLinks }, function () {
      setCommonLinks([...tempLinks]);
    });
  }

  function search() {
    chrome.search.query({
      disposition: "NEW_TAB",
      text: searchQuery.text
    }, () => { });
  }

  useEffect(() => {
    chrome.storage.sync.get(['commonLinks'], function (result) {
      setCommonLinks(result.commonLinks);
    });
    // chrome.bookmarks.getRecent(
    //   5,
    //   (res) => console.log(res)
    // );
  }, []);

  return (
    <OrgFunctionPanel>
      <input type="text" name="text" onChange={(e) => handleInputChange(e, searchQuery, setSearchQuery)} /><button onClick={search}>Search</button>
      <CommonLinksList>
        {commonLinks && commonLinks.map((commonLink) => {
          return <LinkElement commonLink={commonLink} openTab={openTab} delCommonLink={delCommonLink}></LinkElement>;
        })}
      </CommonLinksList>
      <label htmlFor="">LinkTitle<input name="commonLinkName" value={tempCommonLink.commonLinkName} onChange={(e) => handleInputChange(e, tempCommonLink, setTempCommonLink)} type="text" /></label>
      <label htmlFor="">LinkUrl<input name="commonLinkUrl" value={tempCommonLink.commonLinkUrl} onChange={(e) => handleInputChange(e, tempCommonLink, setTempCommonLink)} type="text" /></label>
      <button onClick={addCommonLink}>Add</button>
      {isEditOn &&
        <div>
          <label htmlFor="">LinkTitle<input name="name" value={editLink.name} onChange={(e) => handleInputChange(e, editLink, setEditLink)} type="text" /></label>
          <label htmlFor="">LinkUrl<input name="url" value={editLink.url} onChange={(e) => handleInputChange(e, editLink, setEditLink)} type="text" /></label>
          <button onClick={changeCommonLink}>Confirm</button>
          <button onClick={() => { setIsEditOn(false); }}>Cancel</button>
        </div>}
    </OrgFunctionPanel>
  );
};

const LinkElement: React.FC<{ commonLink: commonLink; openTab: (item: commonLink) => void; delCommonLink: (id: number) => void; }> = (props) => {
  const [isOptionOn, setIsOptionOn] = useState(false);

  return (
    <CommonLink key={props.commonLink.id} onMouseLeave={() => setIsOptionOn(false)}>
      <LinkUrl href={props.commonLink.url} target="_blank">
        <CommonLinkIconContainer>
          <CommonLinkIcon src={props.commonLink.logo}></CommonLinkIcon>
        </CommonLinkIconContainer>
        <LinkTitle>{props.commonLink.name}</LinkTitle>
      </LinkUrl>
      <EditOptionContainer isOptionOn={isOptionOn}>
        <EditOption1 isOptionOn={isOptionOn} onClick={() => { props.openTab(props.commonLink); }}>Edit</EditOption1>
        <EditOption2 isOptionOn={isOptionOn} onClick={() => { props.delCommonLink(props.commonLink.id); }}>Delete</EditOption2>
      </EditOptionContainer>
      <EditIcon title='更多動作' onClick={() => setIsOptionOn(!isOptionOn)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gear" viewBox="0 0 16 16">
          <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
          <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
        </svg>
      </EditIcon>
    </CommonLink>
  );
};