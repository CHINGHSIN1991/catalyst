import React from 'react';
import styled from "styled-components";
import { useState, useEffect } from "react";

import { PanelBasicSetting } from './styleSetting';

const PersonalPanel = styled(PanelBasicSetting)`
  /* border: solid 1px;   */
`;

const ServiceLinks = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const ServiceLink = styled.div`
  border: solid 1px;
  padding: 4px;
  margin: 0 8px;
  width: 56px;
  height:80px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ServiceIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: gray;
`;

export const PersonalServicePanel: React.FC<{}> = () => {

  useEffect(() => {
    // console.log(chrome.identity.getRedirectURL("https://source.unsplash.com/random"));
    // chrome.identity.getProfileUserInfo(
    //   (userInfo) => {
    //     console.log(userInfo);
    //   }
    // );
    // chrome.identity.getAuthToken({ 'interactive': true }, function (token) {
    //   console.log(token);
    // });
  }, []);

  return (
    <PersonalPanel>
      Have a nice day!
      <ServiceLinks>
        <a href="https://www.google.com/maps" target="_blank">
          <ServiceLink>
            <ServiceIcon></ServiceIcon>
            <p>地圖</p>
          </ServiceLink>
        </a>
        <a href="https://mail.google.com/mail" target="_blank">
          <ServiceLink>
            <ServiceIcon></ServiceIcon>
            <p>G-mail</p>
          </ServiceLink>
        </a>
        <a href="https://calendar.google.com/calendar" target="_blank">
          <ServiceLink>
            <ServiceIcon></ServiceIcon>
            <p>日歷</p>
          </ServiceLink>
        </a>
        <a href="https://drive.google.com/drive" target="_blank">
          <ServiceLink>
            <ServiceIcon></ServiceIcon>
            <p>雲端</p>
          </ServiceLink>
        </a>
        <a href="https://meet.google.com/" target="_blank">
          <ServiceLink>
            <ServiceIcon></ServiceIcon>
            <p>Meet</p>
          </ServiceLink>
        </a>
        <a href="https://news.google.com" target="_blank">
          <ServiceLink>
            <ServiceIcon></ServiceIcon>
            <p>News</p>
          </ServiceLink>
        </a>
        <a href="https://translate.google.com/" target="_blank">
          <ServiceLink>
            <ServiceIcon></ServiceIcon>
            <p>翻譯</p>
          </ServiceLink>
        </a>
        <a href="https://photos.google.com" target="_blank">
          <ServiceLink>
            <ServiceIcon></ServiceIcon>
            <p>相片</p>
          </ServiceLink>
        </a>
      </ServiceLinks>

    </PersonalPanel>
  );
}

