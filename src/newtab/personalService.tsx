import React from 'react';
import styled from "styled-components";
import { useState, useEffect } from "react";

import { PanelBasicSetting } from './styleSetting';

const PersonalPanel = styled(PanelBasicSetting)`
  /* border: solid 1px;   */
`
export const PersonalServicePanel: React.FC<{}> = () => {

  useEffect(() => {
    // console.log(chrome.identity.getRedirectURL("https://source.unsplash.com/random"));
    chrome.identity.getProfileUserInfo(
      (userInfo) => {
        console.log(userInfo);
      }
    );
    chrome.identity.getAuthToken({ 'interactive': true }, function (token) { console.log(token) });
  }, []);

  return (
    <PersonalPanel>
      Have a nice day!
    </PersonalPanel>
  );
}

