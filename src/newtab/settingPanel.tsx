import React from 'react';
import styled from "styled-components";
import { useState, useEffect } from "react";

import { PanelBasicSetting } from './styleSetting';

const SettingPanelWrapper = styled(PanelBasicSetting)`
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const ButtonArea = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const PanelWrapper = styled.div`
left: 0;
top: 0;
position: absolute;
width: 100vw;
height: 100vh;
background-color: rgba(0,0,0,0.8);
display: flex;
justify-content: center;
align-items: center;
`;

const BackgroundWrapper = styled.div`
  width: 600px;
  height: 400px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  background-color: grey;
`;

const BackgroundContainer = styled.div`
  border: solid 1px;
  width: 100%;
  display: flex;
`;

const BackgroundImage = styled.div`
  border: solid 1px;
  width: 120px;
  height: 80px;
  background-image: url(${(props: { bg: string; }) => { return props.bg; }});
  background-position: center;
  background-size: cover;
`;

export const SettingPanel: React.FC<{ currentBackground: string; customBackgrounds: string[]; setCustomBackgrounds: (bgs: string[]) => void; }> = (props) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  function addCustomBackgrounds() {
    if (!props.customBackgrounds.find((img) => img === props.currentBackground)) {
      const tempBackgrounds = [...props.customBackgrounds, props.currentBackground];
      chrome.storage.sync.set({ customBackgrounds: JSON.stringify(tempBackgrounds) }, function () {
        props.setCustomBackgrounds(tempBackgrounds);
      });
    }
  }

  function delCustomBackground(id: string) {
    const tempBackgrounds = props.customBackgrounds.filter((bg) => bg !== id);
    chrome.storage.sync.set({ customBackgrounds: JSON.stringify(tempBackgrounds) }, function () {
      props.setCustomBackgrounds(tempBackgrounds);
    });

  }

  return (
    <SettingPanelWrapper>
      {isPanelOpen &&
        <PanelWrapper>
          <BackgroundWrapper>
            <button onClick={() => setIsPanelOpen(false)}>close</button>
            <button onClick={addCustomBackgrounds}>Add</button>
            <BackgroundContainer>
              <BackgroundImage bg={props.currentBackground}></BackgroundImage>
              {!!props.customBackgrounds.length && props.customBackgrounds.map((bg) => {
                return <BackgroundImage key={bg} bg={bg}><button onClick={() => { delCustomBackground(bg); }}>x</button></BackgroundImage>;
              })}
            </BackgroundContainer>
          </BackgroundWrapper>
        </PanelWrapper>
      }

      Setting Panel
      <ButtonContainer>
        <ButtonArea onClick={() => setIsPanelOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-card-image" viewBox="0 0 16 16">
            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
            <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z" />
          </svg>
        </ButtonArea>
      </ButtonContainer>
    </SettingPanelWrapper>
  );
};