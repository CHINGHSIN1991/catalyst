import React, { useContext, useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import ReactDOM from 'react-dom/client';
import styled, { ThemeProvider } from "styled-components";

import { store } from './features/store';
import { loadPersonalization, getPersonalization } from './features/reducers/optionsSlice';
import AlertContext from './features/alertContext';

import { ResetStyle, GlobalStyle } from "../static/globalStyle";
import { colorScheme } from '../static/optionList';
import { scheme, alertState } from '../static/types';

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
import { BackgroundComponent, PhotographerInfo } from './components/BackgroundPanel';
import { TogglePanel } from './components/TogglePanel';
import { AlertWindow } from './components/AlertWindow';

type isBoardOn = { isBoardOn: boolean; };
type isMenuOn = { isMenuOn: boolean; };

const Wrapper = styled.div`
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

const HeightLimiter = styled.div`
  /* border: solid 1px black; */
  display: inline-flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 96px);
  margin-bottom: -8px;
`;

const Container = styled.div`
  left: ${(props: isBoardOn) => props.isBoardOn ? "-100vw" : "0"};
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
  color: ${(props: scheme) => props.theme.primary};
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: 0.4s;
  @media (max-width:1580px) {
    width: 320px
  }
  @media (max-width:1180px) {
    display: none;
  }
`;

const MenuContainerLeft = styled(MenuContainer)`
  left: ${(props: isMenuOn) => props.isMenuOn ? "0px" : "-400px"};
  top: 0px;
`;

const MenuContainerRight = styled(MenuContainer)`
  right: ${(props: isMenuOn) => props.isMenuOn ? "0px" : "-400px"};
  top: 0px;
`;

const FocusPanel = styled.div`
  color: ${(props: scheme) => props.theme.primary};
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: calc(100% - 720px);
  @media (max-width:1580px) {
    width: calc(100% - 640px);
  }
  @media (max-width:1180px) {
    left: 0px;
    width: 100%;
  }
`;

const MainBoard = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const MobileMenuList = styled.div`
  position: absolute;
  display: flex;
  overflow: hidden;
  top: 40px;
  width: calc(100vw - 720px);
  height: calc(100vh - 272px);
  @media (max-width:1580px) {
    width: calc(100vw - 640px);
  }
  @media (max-width:1180px) {
    left: 0px;
    width: 100%;
  }
`;

const MobileMenuContainer = styled.div`
  position: absolute;
  width: calc(100vw - 720px);
  height: 100%;
  display: flex;
  flex-wrap: nowrap;
  overflow: hidden;
  top: 0px;
  left: 0px;
  transition: 0.2s;
  @media (max-width:1580px) {
    width: calc(100vw - 640px);
  }
  @media (max-width:1180px) {
    width: 600vw;
    left: ${props => { return `-${props.mobileToggle * 100}vw`; }};
  }
`;

const MobileMenuItem = styled.div`
  flex-shrink:0;
  width: calc(100vw - 720px);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media (max-width:1580px) {
    width: calc(100vw - 640px);
  }
  @media (max-width:1180px) {
    width: 100vw;
  }
`;

const App: React.FC<{}> = () => {
  const [alertState, setAlertState] = useState<alertState>({ title: '' });

  return (
    <Provider store={store}>
      <AlertContext.Provider value={[alertState, setAlertState]}>
        <ResetStyle />
        <GlobalStyle />
        <NewTab></NewTab>
      </AlertContext.Provider>
    </Provider >
  );
};

const NewTab: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const personalization = useSelector(getPersonalization);
  const [isMenuOn, setIsMenuOn] = useState(false);
  const [isBoardOn, setIsBoardOn] = useState(false);
  const [centralPanel, setCentralPanel] = useState("");
  const [theme, setTheme] = useState(colorScheme.dark);
  const [mobileToggle, setMobileToggle] = useState(0);

  console.log(mobileToggle);

  function changeMobileMenu() {
    if (mobileToggle < 5) {
      setMobileToggle(mobileToggle + 1);
    } else {
      setMobileToggle(0);
    }
  }

  useEffect(() => {
    chrome.storage.sync.get(['personalization'], (res) => {
      if (res.personalization) {
        dispatch(loadPersonalization(res.personalization));
        setIsMenuOn(res.personalization.isMenuShow);
      } else {
        const tempPersonalization = {
          isMilitary: true,
          isCelsius: true,
          isMenuShow: true,
          idCalendarColorful: true,
          isPrivateShow: true,
          isDarkMode: true,
          pronounce: 'zh-TW',
        };
        chrome.storage.sync.set({ personalization: tempPersonalization }, () => {
          dispatch(loadPersonalization(tempPersonalization));
        });
      }
    });
  }, []);

  useEffect(() => {
    const tempTheme = personalization.isDarkMode ? colorScheme.dark : colorScheme.light;
    setTheme(tempTheme);
  }, [personalization]);

  return (
    <ThemeProvider theme={theme}>
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
              <MobileMenuList>
                <MobileMenuContainer mobileToggle={mobileToggle}>
                  <MobileMenuItem>
                    <TimePanel></TimePanel>
                    <CurrentFocusPanel></CurrentFocusPanel>
                  </MobileMenuItem>
                  {mobileToggle !== 0 && <MobileMenuItem>
                    <PersonalServicePanel></PersonalServicePanel>
                    <SettingPanel></SettingPanel>
                  </MobileMenuItem>}
                  {mobileToggle !== 0 && <MobileMenuItem>
                    <ShortcutsPanel></ShortcutsPanel>
                  </MobileMenuItem>}
                  {mobileToggle !== 0 && <MobileMenuItem>
                    <CalendarPanel></CalendarPanel>
                  </MobileMenuItem>}
                  {mobileToggle !== 0 && <MobileMenuItem>
                    <InspirationNotePanel></InspirationNotePanel>
                  </MobileMenuItem>}
                  {mobileToggle !== 0 && <MobileMenuItem>
                    <ToDoListPanel></ToDoListPanel>
                  </MobileMenuItem>}
                </MobileMenuContainer>
              </MobileMenuList>
              <PomodoroPanel centralPanel={centralPanel}></PomodoroPanel>
              <WeatherPanel centralPanel={centralPanel}></WeatherPanel>
              <TogglePanel
                setIsBoardOn={setIsBoardOn}
                isMenuOn={isMenuOn}
                setIsMenuOn={setIsMenuOn}
                centralPanel={centralPanel}
                setCentralPanel={setCentralPanel}
                changeMobileMenu={changeMobileMenu}
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
    </ThemeProvider>
  );
};


const rootElement = document.createElement('div');
document.body.appendChild(rootElement);
const root = ReactDOM.createRoot(rootElement);

root.render(<App />);;;