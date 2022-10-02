import React, { useRef } from 'react';
import ReactDOM from 'react-dom/client';
import styled from "styled-components";
import { Provider } from 'react-redux';
import { store } from './features/store';
import { ResetStyle, GlobalStyle } from "../static/globalStyle";
import { useState, useEffect } from "react";

import { ShortcutsPanel } from './components/ShortcutsPanel';
import { InspirationNotePanel } from './components/InspirationNotes';
import { TimePanel } from './components/TimePanel';
import { ToDoListPanel } from './components/ToDoList';
import { PersonalServicePanel } from './components/PersonalService';
import { CalendarPanel } from './components/CalendarPanel';
import { WeatherPanel } from './components/WeatherInfoPanel';
import { SettingPanel } from './components/SettingPanel';
import { PomodoroPanel } from './components/PomodoroPanel';
import { BulletinBoard } from './components/BulletinBoard';
import { CurrentFocusPanel } from './components/CurrentFocusPanel';
import { EditPanel } from './components/EditPanel';
import { TogglePanel } from './components/TogglePanel';
import { AlertWindow } from './components/AlertWindow';

import { getBackgroundImg } from '../utils/api';

import { loadBackgrounds, getBackgrounds, changeBackgroundRandomly } from './features/reducers/backgroundSlice';
import { useDispatch, useSelector } from 'react-redux';

const Wrapper = styled.div`
  /* border: solid 5px; */
  font-family: 'Noto Sans';
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  background-image: url(${(props) => { return props.currentBackground; }});
  background-position: center;
  background-size: cover;
  transition: 0.5s;
  overflow: hidden;
`;

const BackgroundContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const BackgroundImage = styled.div`
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  background-image: url(${(props) => { return props.url; }});
  opacity: ${(props) => { return props.current === props.index ? 1 : 0; }};
  transition: 1.5s;
  background-position: center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const BackgroundInfo = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-top: 8px;
  top: 0px;
  width: 100%;
  height: 32px;
  z-index: 5;
  text-shadow: 0 0 10px rgba(0, 0, 0, 1),  0 0 20px rgba(0, 0, 0, 0);
`;

const Photographer = styled.a`
  padding: 0 8px;
  color: white;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
`;


const DownloadIcon = styled.a`
  display: flex;
  color: white;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const HeightLimiter = styled.div`
  /* border: solid 1px black; */
  display: inline-flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 96px);
  margin-bottom: -8px;
`;

const Container = styled.div`
  left: ${(props: { isBoardOn: boolean; }) => { return props.isBoardOn ? "-100vw" : "0"; }};
  top: 0;
  display: flex;
  width: 200vw;
  height: 100vh;
  position: absolute;
  transition: 0.5s;
  z-index: 2;
`;

const MenuContainer = styled.div`
  /* border: solid 1px; */
  position: absolute;
  font-family: 'Noto Sans', 'Microsoft JhengHei';
  width: 360px;
  color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: 0.4s;
`;

const MenuContainerLeft = styled(MenuContainer)`
  left: ${(props) => { return props.isMenuOn ? "0px" : "-400px"; }};
  top: 0px;
`;

const MenuContainerRight = styled(MenuContainer)`
  right: ${(props) => { return props.isMenuOn ? "0px" : "-400px"; }};
  top: 0px;
`;

const FocusPanel = styled.div`
  /* border: solid 1px; */
  width: calc(100% - 720px);
  color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const MainBoard = styled.div`
  width: 100vw;
  height: 100vh;
  /* border: solid 5px; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

type bgOption = {
  current: number;
  previousFetch: Date;
};

const App: React.FC<{}> = () => {
  const [isMenuOn, setIsMenuOn] = useState(false);
  const [isBoardOn, setIsBoardOn] = useState(false);
  const [centralPanel, setCentralPanel] = useState("");

  return (
    <Provider store={store}>
      <ResetStyle />
      <GlobalStyle />
      <Wrapper>
        <BackgroundComponent></BackgroundComponent>
        <Container isBoardOn={isBoardOn}>
          <MainBoard>
            <MenuContainerLeft isMenuOn={isMenuOn}>
              <HeightLimiter>
                <ShortcutsPanel></ShortcutsPanel>
                <InspirationNotePanel></InspirationNotePanel>
              </HeightLimiter>
              <SettingPanel></SettingPanel>
            </MenuContainerLeft>
            <FocusPanel>
              <PhotographerInfo></PhotographerInfo>
              <TimePanel></TimePanel>
              <CurrentFocusPanel></CurrentFocusPanel>
              <PomodoroPanel centralPanel={centralPanel}></PomodoroPanel>
              <WeatherPanel centralPanel={centralPanel}></WeatherPanel>
              <TogglePanel
                setIsBoardOn={setIsBoardOn}
                isMenuOn={isMenuOn}
                setIsMenuOn={setIsMenuOn}
                centralPanel={centralPanel}
                setCentralPanel={setCentralPanel}
              ></TogglePanel>
            </FocusPanel>
            <MenuContainerRight isMenuOn={isMenuOn}>
              <PersonalServicePanel></PersonalServicePanel>
              <CalendarPanel></CalendarPanel>
              <ToDoListPanel></ToDoListPanel>
            </MenuContainerRight>
          </MainBoard>
          <BulletinBoard setIsBoardOn={setIsBoardOn}></BulletinBoard>
        </Container>
      </Wrapper>
      <EditPanel></EditPanel>
      <AlertWindow></AlertWindow>
    </Provider>
  );
};

const BackgroundComponent: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const backgroundSetting = useSelector(getBackgrounds);
  const timeIntervalId = useRef(null);

  function processBackgroundData(data) {
    let tempBackgrounds = [];
    data.forEach((item) => {
      tempBackgrounds.push(
        {
          id: item.id,
          url: item.urls.full,
          smallUrl: item.urls.small_s3,
          user: item.user.name,
          profile: item.user.links.html,
          downloadLink: item.links.download,
        });
    });
    return tempBackgrounds;
  }

  useEffect(() => {
    const ct = new Date();
    const today = `${ct.getFullYear()}-${ct.getMonth() + 1}-${ct.getDate()}`;

    chrome.storage.local.get(['backgroundSetting'], (res) => {
      if (res.backgroundSetting) {
        if (res.backgroundSetting.lastUpdate !== today) {
          getBackgroundImg("nature").then((images) => {
            let newBackgroundList = [...res.backgroundSetting.backgroundList];
            newBackgroundList[0] = processBackgroundData(images);
            const tempBackgrounds = {
              ...res.backgroundSetting,
              lastUpdate: today,
              backgroundList: newBackgroundList
            };
            dispatch(loadBackgrounds(tempBackgrounds));
          });
        } else {
          dispatch(loadBackgrounds(res.backgroundSetting));
        }
      } else {
        getBackgroundImg("nature").then((res) => {
          const tempBackgrounds = {
            lastUpdate: today,
            current: {
              setting: 0,
              slice: 0,
            },
            backgroundList: [processBackgroundData(res), [], [], [], [], []]
          };
          dispatch(loadBackgrounds(tempBackgrounds));
        });
      }
    });

    timeIntervalId.current = setInterval(() => {
      dispatch(changeBackgroundRandomly());
    }, 10000);
  }, []);

  useEffect(() => {
    chrome.storage.local.set({ backgroundSetting: backgroundSetting });
  }, [backgroundSetting]);

  return (
    <BackgroundContainer>
      {backgroundSetting.backgroundList[backgroundSetting.current.setting].map((item, index) => {
        return (<BackgroundImage key={item.id + index} url={item.url} index={index} current={backgroundSetting.current.slice}></BackgroundImage>);
      })}
    </BackgroundContainer>
  );
};

const PhotographerInfo: React.FC<{}> = () => {
  const backgroundSetting = useSelector(getBackgrounds);

  return (
    <BackgroundInfo>
      Photo by
      <Photographer href={backgroundSetting.backgroundList[backgroundSetting.current.setting][backgroundSetting.current.slice].profile} target="_blank">
        {backgroundSetting.backgroundList[backgroundSetting.current.setting][backgroundSetting.current.slice].user}
      </Photographer>
      on
      <Photographer href='https://unsplash.com/' target="_blank">{' Unsplash '}</Photographer>
      <DownloadIcon href={backgroundSetting.backgroundList[backgroundSetting.current.setting][backgroundSetting.current.slice].downloadLink} target="_blank">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-link" viewBox="0 0 16 16">
          <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z" />
          <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z" />
        </svg>
      </DownloadIcon>
    </BackgroundInfo>
  );
};


const rootElement = document.createElement('div');
document.body.appendChild(rootElement);
const root = ReactDOM.createRoot(rootElement);

root.render(<App />);