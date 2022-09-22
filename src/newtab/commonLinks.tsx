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
const CommonLink = styled.li`
  border:solid 1px;
  padding: 8px;
  display: flex;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
`;
const CommonLinkIcon = styled.img`
  width: 40px;
  height: 40px;
  padding: 8px;
  /* border-radius: 50%; */
  border: solid 1px;
  object-fit: cover;
`;
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
          return <CommonLink key={commonLink.id}>
            <button onClick={() => { openTab(commonLink); }}>edit</button>
            <button onClick={() => { delCommonLink(commonLink.id); }}>x</button>
            <a href={commonLink.url} target="_blank">
              <CommonLinkIcon src={commonLink.logo}></CommonLinkIcon>
              <p>{commonLink.name}</p>
            </a>
          </CommonLink>;
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