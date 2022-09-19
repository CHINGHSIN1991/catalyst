import React from 'react';
import styled from "styled-components";
import { useState, useEffect } from "react";

import { PanelBasicSetting } from '../styleSetting';
import { serviceList } from '../../static/optionList';

const PersonalPanel = styled(PanelBasicSetting)`
  /* border: solid 1px;   */
`;

const WelcomeMessage = styled.div`
  display: flex;
  align-items: flex-end;
  font-size: 1rem;
  padding: 4px 16px 16px 16px;
`;

const ServiceLinks = styled.div`
  max-height: 120px;
  overflow-y: scroll;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  justify-content: space-between;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-button {
    display: none;
    /* background: transparent;
    border-radius: 4px; */
  }
  &::-webkit-scrollbar-track-piece {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0,0,0,0.4);
    border: 1px solid slategrey
  }
  &::-webkit-scrollbar-track {
    box-shadow: transparent;
  }
`;

const ServiceLink = styled.a`
  color: white;
  padding: 8px;
  border-radius: 4px;
  margin: 0 8px;
  width: 64px;
  margin: 0 4px;
  height:80px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: 0.1s;

  :hover {
    background-color: rgba(255,255,255,0.1);
  }
`;

const ServiceIcon = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
`;

const ServiceTitle = styled.div`
  padding-top: 8px;
  font-size: 0.75rem;
`;

const UnderLine = styled.div`
  background-color: #fff;
  width: 0%;
  height: 2px;
`;

const UserName = styled.a`
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding-left: 8px;
  font-weight: bold;
  font-size: 1.5rem;
  transition: 0.2s;
  :hover{
    color: lightgray
    ${UnderLine} {
      width: 100%;
    }
  }
`;

export const PersonalServicePanel: React.FC<{}> = () => {
  const [welcomeMessage, setWelcomeMessage] = useState("Have a nice day !");
  const [userName, setUserName] = useState("New User");

  function setWelcomeMsg(current: number) {
    if (current < 12) {
      setWelcomeMessage("Good morning !");
    } else if (current < 17) {
      setWelcomeMessage("Good afternoon !");
    } else {
      setWelcomeMessage("Good evening !");
    }
  }
  useEffect(() => {
    const current = (new Date()).getHours();
    setWelcomeMsg(current);

    chrome.storage.sync.get();
    chrome.storage.sync.get(['userName'], function (res) {
      if ('userName' in res) {
        setUserName(res.userName);
      }
    });
  }, []);

  return (
    <PersonalPanel>
      <WelcomeMessage>{welcomeMessage}
        <UserName href="https://myaccount.google.com/" target="_blank">
          <div>{userName}</div>
          <UnderLine></UnderLine>
        </UserName>
      </WelcomeMessage>
      <ServiceLinks>
        {serviceList.map((item) => {
          return <ServiceLink href={item.link} target="_blank">
            <ServiceIcon src={item.imgUrl.light} />
            <ServiceTitle>{item.name.english}</ServiceTitle>
          </ServiceLink>;
        })}
      </ServiceLinks>
    </PersonalPanel>
  );
}

