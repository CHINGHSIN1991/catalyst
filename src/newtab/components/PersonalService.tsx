import React from 'react';
import styled from "styled-components";
import { useState, useEffect } from "react";

import { PanelBasicSetting } from '../../static/styleSetting';
import { serviceList } from '../../static/optionList';
import { getUserInfo, loadUserInfo } from '../features/reducers/userInfoSlice';
import { useSelector, useDispatch } from 'react-redux';

const PersonalPanel = styled(PanelBasicSetting)`
  /* border: solid 1px;   */
`;

const WelcomeMessage = styled.div`
  display: flex;
  align-items: flex-end;
  font-weight: bold;
  font-size: 1rem;
  padding: 0px 16px 16px 0px;
`;

const ServiceLinks = styled.div`
  max-height: 104px;
  overflow-y: scroll;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;

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
  @media (max-width:1580px) {
  /* 銀幕寬度小於1200套用此區塊 */
    max-height: 72px;
  }
`;

const ServiceLink = styled.a`
  color: white;
  padding: 8px;
  border-radius: 4px;
  margin: 0 8px;
  width: 58px;
  margin: 4px 2px;
  height: 64px;
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
  width: 28px;
  height: 28px;
  object-fit: contain;
`;

const ServiceTitle = styled.div`  
  padding-top: 8px;
  font-size: 0.75rem;
`;
const WelcomeSentence = styled.div`
  font-weight: bold;
  display: flex;
  flex-shrink: 0;
`;

const UserName = styled.a`
  color: white;
  display: flex;
  flex-shrink: 1;
  align-items: center;
  cursor: pointer;
  padding-left: 8px;
  font-weight: bold;
  font-size: 1.2rem;
  line-height: 1.2rem;
  transition: 0.2s;
  margin: 0;
  overflow: hidden;  
  white-space: nowrap;
  text-overflow: ellipsis;
  /* :hover{
    color: lightgray
  } */
`;

export const PersonalServicePanel: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector(getUserInfo);
  const [welcomeMessage, setWelcomeMessage] = useState("Have a nice day !");

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

    chrome.storage.sync.get(['userName'], function (res) {
      if ('userName' in res) {
        dispatch(loadUserInfo({ ...userInfo, name: res.userName }));
      }
    });
  }, []);

  console.log(userInfo);

  return (
    <PersonalPanel>
      <WelcomeMessage>
        <WelcomeSentence>{welcomeMessage}</WelcomeSentence>
        <UserName href="https://myaccount.google.com/" target="_blank">
          {userInfo.name}
        </UserName>
      </WelcomeMessage>
      <ServiceLinks>
        {serviceList.map((item) => {
          return <ServiceLink key={item.imgUrl.light} href={item.link} target="_blank">
            <ServiceIcon src={item.imgUrl.light} />
            <ServiceTitle>{item.name.english}</ServiceTitle>
          </ServiceLink>;
        })}
      </ServiceLinks>
    </PersonalPanel>
  );
}

