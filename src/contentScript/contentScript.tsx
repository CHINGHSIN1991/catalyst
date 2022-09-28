console.log("contentScript running!");
console.log(window.location.href);

import React from 'react';
import ReactDOM from 'react-dom/client';
import styled from "styled-components";
import { useState, useEffect } from "react";

import { NotesPanel } from './components/NotesPanel';
import { MemoPanel } from './components/MemoPanel';


const Wrapper = styled.div`
  font-family: 'Noto Sans', 'Trebuchet MS', 'Microsoft JhengHei';
  box-sizing: border-box;
  position: fixed;
  right: 24px;
  bottom: 16px;
  width: ${(props) => { return props.isOpen ? "248px" : "56px"; }};
  height: ${(props) => { return props.isOpen ? "320px" : "56px"; }};
  border-radius: ${(props) => { return props.isOpen ? "12px 12px 4px 12px" : "50% 50% 2px 50%"; }};
  overflow: hidden;
  background-color: rgb(240,240,240);
  border: solid 1px rgb(232,232,232);
  box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.2);;
  color: black;
  z-index: 99999;
  padding: ${(props) => { return props.isOpen ? "24px" : "8px"; }};;
  cursor: pointer;
  transition: 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.img`
  width: 32px;
  height: 32px;
  object-fit: cover;
`;

const CtrlPanel = styled.div`
  display: flex;
  align-items: center;
  background-color: rgb(200,200,200);
  width: 200px;
  border-radius: 18px;
  height: 40px;
  margin-bottom: 24px;
`;

const Panel = styled.div`
  position: relative;
  /* border: solid 1px; */
  overflow: hidden;
  width: 200px;
  height: 240px;
`;

const Container = styled.div`
  position: absolute;
  display: flex;
  /* border: solid 1px; */
  width: 496px;
  height: 232px;
  transition: 0.2s;
  left: ${(props) => { return props.isMemo ? '-200px' : '0px'; }};
  top: 0px;  
`;

const PositionPanel = styled.div`
  border: solid 1px;
  width: 48px;
  height: 48px;
`;

const TogglePanel = styled.div`
  box-sizing: border-box;
  position: relative;
  width: 200px;
  height: 32px;
  display: flex;
  justify-content: space-between;
  padding: 4px;
  align-items: center;
`;

const OptionContainer = styled.div`
  width: ${(props) => { return props.isMemo ? '160px' : '28px'; }};
  display: flex;
  align-items: center;
  overflow: hidden;
  height: 28px;
  background-color: ${(props) => { return props.isMemo ? 'rgb(80,80,80)' : 'rgb(120,120,120)'; }};
  border-radius: 14px;
  transition: 0.4s;
`;

const OptionIconContainer = styled.div`
  color: ${(props) => { return props.isMemo ? 'rgb(255,255,255)' : 'rgb(160,160,160)'; }};
  width: 28px;
  height: 28px;
  display: flex;
  transition: 0.4s;
  justify-content: center;
  align-items: center;
`;

const OptionTitle = styled.div`
  color: ${(props) => { return props.isMemo ? 'rgba(255,255,255,1)' : 'rgba(160,160,160,0)'; }};
  width: ${(props) => { return props.isMemo ? '132px' : '0px'; }};
  transition: 0.4s;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
`;

// interface todo {
//   workContent: string;
//   isDone: boolean;
//   id: number;
//   isSetAlert: boolean;
//   alertDate?: string;
//   alertTime?: string;
//   alertSend?: boolean;
// }

const App: React.FC<{}> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMemo, setIsMemo] = useState(false);

  return (
    <Wrapper isOpen={isOpen} onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}>
      {isOpen &&
        <CtrlPanel onClick={(e) => { e.stopPropagation(); setIsMemo(!isMemo); }}>
          <TogglePanel>
            <OptionContainer isMemo={!isMemo}>
              <OptionIconContainer isMemo={!isMemo}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-link-45deg" viewBox="0 0 16 16">
                  <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                  <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                </svg>
              </OptionIconContainer>
              <OptionTitle isMemo={!isMemo}>Create a Link</OptionTitle>
            </OptionContainer>
            <OptionContainer isMemo={isMemo}>
              <OptionTitle isMemo={isMemo}>Add a Memo</OptionTitle>
              <OptionIconContainer isMemo={isMemo}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-stickies" viewBox="0 0 16 16">
                  <path d="M1.5 0A1.5 1.5 0 0 0 0 1.5V13a1 1 0 0 0 1 1V1.5a.5.5 0 0 1 .5-.5H14a1 1 0 0 0-1-1H1.5z" />
                  <path d="M3.5 2A1.5 1.5 0 0 0 2 3.5v11A1.5 1.5 0 0 0 3.5 16h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 16 9.586V3.5A1.5 1.5 0 0 0 14.5 2h-11zM3 3.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5V9h-4.5A1.5 1.5 0 0 0 9 10.5V15H3.5a.5.5 0 0 1-.5-.5v-11zm7 11.293V10.5a.5.5 0 0 1 .5-.5h4.293L10 14.793z" />
                </svg>
              </OptionIconContainer>
            </OptionContainer>
          </TogglePanel>
        </CtrlPanel>}
      {isOpen &&
        <Panel>
          <Container isMemo={isMemo}>
            <NotesPanel />
            <MemoPanel />
          </Container>
        </Panel>
      }
      {!isOpen && <Logo src="https://firebasestorage.googleapis.com/v0/b/catalyst-aws17.appspot.com/o/CatalystLogo.png?alt=media&token=578673e6-464a-446b-9202-8517c14beb84"></Logo>}
    </Wrapper>
  );
};

const rootElement = document.createElement('div');
document.body.appendChild(rootElement);
const root = ReactDOM.createRoot(rootElement);

root.render(<App />);