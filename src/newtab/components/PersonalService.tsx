import React from 'react';
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';

import { setEditPanel } from '../features/reducers/editSlice';
import { getUserInfo, loadUserInfo } from '../features/reducers/userInfoSlice';
import { getPersonalization } from '../features/reducers/optionsSlice';
import { getServiceList, loadServiceList } from '../features/reducers/personalServiceSlice';

import { PanelBasicSetting, ScrollbarContainer } from '../../static/styleSetting';
import { personalServiceList } from '../../static/optionList';
import { handleErrorImage } from '../../utils/functions';
import { scheme } from '../../static/types';

type src = { src: string; };
type hover = { hover: string; };
type backup = { backup: string; };

const PersonalPanel = styled(PanelBasicSetting)`
  @media (max-width:1180px) {
    flex-grow:1;
  }
`;

const WelcomeMessage = styled.div`
  display: flex;
  align-items: flex-end;
  font-weight: bold;
  font-size: 1rem;
  padding: 0px 16px 16px 0px;
`;

const ServiceLinks = styled(ScrollbarContainer)`
  max-height: 104px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  @media (max-width:1580px) {
    max-height: 72px;
  }
  @media (max-width:1180px) {
    max-height: calc(100vh - 400px);
  } 
`;

const ServiceIcon = styled.div`
  width: 28px;
  height: 28px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-image: ${(props: src) => `url(${props.src})`};  
  /* object-fit: contain; */
  transition: 0.2s;
  :hover {
    background-image: ${(props: hover & backup) => `url(${props.hover}), url(${props.backup})`};
  }
`;

const ServiceOnError = styled.img`
  width: 28px;
  height: 28px;
  object-fit: contain;
`;

const ServiceLink = styled.a`
  color: ${(props: scheme) => props.theme.primary};
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
    ${ServiceIcon} {
      background-image: ${(props: hover) => `url(${props.hover})`};
    }
  }
  @media (max-width:1580px) {
    width: 64px;
  }
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
  color: ${(props: scheme) => props.theme.primary};
  display: flex;
  flex-shrink: 1;
  align-items: center;
  cursor: pointer;
  padding-left: 8px;
  font-weight: bold;
  font-size: 1.2rem;
  line-height: 2rem;
  transition: 0.2s;
  transform: translateY(0.4rem);
  margin: 0;
  overflow: hidden;  
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const MoreServiceButton = styled.a`
  display: block;
  color: ${(props: scheme) => props.theme.primary};
  margin: 8px 16px;
  width: 100%;
  height: 24px;
  font-size: 12px;
  line-height: 24px;
  cursor: pointer;
  border: solid 1px rgba(255,255,255,0.2);
  background-color: rgba(255,255,255,0.1);
  border-radius: 4px;
  text-align: center;
  transition: 0.2s;
  :hover {
    border: solid 1px rgba(255,255,255,0.8);
    background-color: rgba(255,255,255,0.2);
  }
`;

const CreateButton = styled.div`
position: absolute;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  right: 8px;
  top: 8px;
  font-size: 1.5rem;
  line-height: 20px;
  width: 24px;
  height: 24px;
  background-color: rgba(200,200,200,0.1);
  border-radius: 50%;
  transition: 0.2s;
  :hover{
    background-color: rgba(200,200,200,0.5);
  }
`;

const PersonalServicePanel: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector(getUserInfo);
  const serviceList = useSelector(getServiceList);
  const personalization = useSelector(getPersonalization);
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

  function takeServiceList() {
    chrome.storage.sync.get(['serviceList'], function (res) {
      if ('serviceList' in res) {
        dispatch(loadServiceList(res.serviceList));
      }
    });
  }

  useEffect(() => {
    const current = (new Date()).getHours();
    setWelcomeMsg(current);

    chrome.storage.sync.get(['userName'], function (res) {
      if ('userName' in res) {
        dispatch(loadUserInfo({ ...userInfo, name: res.userName }));
      }
    });
    takeServiceList();
    chrome.storage.onChanged.addListener(function (changes) {
      if (changes.serviceList) {
        takeServiceList();
      }
    });

  }, []);

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
          return <ServiceLink key={personalServiceList[item].imgUrl.light} href={personalServiceList[item].link} hover={personalServiceList[item].imgUrl.color} target="_blank">
            <ServiceIcon src={personalization.isDarkMode ? personalServiceList[item].imgUrl.light : personalServiceList[item].imgUrl.dark} onError={(e: React.ChangeEvent<HTMLImageElement>) => handleErrorImage(e)}>
              <ServiceOnError src='https://firebasestorage.googleapis.com/v0/b/catalyst-aws17.appspot.com/o/onError.png?alt=media&token=3a641010-249b-4fbb-a1bd-256adfb460ea' onError={(e: React.ChangeEvent<HTMLImageElement>) => handleErrorImage(e)}></ServiceOnError>
            </ServiceIcon>
            <ServiceTitle>{personalServiceList[item].name.english}</ServiceTitle>
          </ServiceLink>;
        })}
        <MoreServiceButton href="https://about.google/products/" target="_blank">
          See more services
        </MoreServiceButton>
      </ServiceLinks>
      <CreateButton onClick={() => dispatch(setEditPanel({ name: 'ServiceEdit' }))}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
          <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
        </svg>
      </CreateButton>
    </PersonalPanel >
  );
};

export const MemoizedPersonalServicePanel = React.memo(PersonalServicePanel);