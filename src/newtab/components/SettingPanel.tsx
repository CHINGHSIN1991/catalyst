import React from 'react';
import styled from "styled-components";
import { useState, useEffect } from "react";

import { PanelBasicSetting } from '../styleSetting';

const SettingPanelWrapper = styled(PanelBasicSetting)`
  /* border: solid 1px; */
  height: 80px;
`;

const ButtonContainer = styled.div`
  /* border: solid 1px; */
  width: 100%;
  margin-top: 8px;
  height: 40px;
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
  flex-wrap: wrap;
`;

const BackgroundImage = styled.div`
  border: solid 1px;
  width: 120px;
  height: 80px;
  background-image: url(${(props: { bg: string; }) => { return props.bg; }});
  background-position: center;
  background-size: cover;
`;

type backgroundInfo = {
  url: string,
  user: string,
  profile: string,
  downloadLink: string,
};

export const SettingPanel: React.FC<
  {
    currentBackground: backgroundInfo;
    currentBgList: backgroundInfo[];
    setCurrentBgList: (bgList: backgroundInfo[]) => void;
    personalBgSet: backgroundInfo[][],
    setPersonalBgSet: (bgList: backgroundInfo[][]) => void;
    bgOption: { current: number, previousFetch: Date; };
    setBgOption: (obj: { current: number, previousFetch: Date; }) => void;
  }> = (props) => {
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    function addCustomBackgrounds() {
      if (props.bgOption.current !== 0) {
        const tempBgList = [...props.personalBgSet];
        tempBgList[props.bgOption.current].push(props.currentBackground);
        props.setPersonalBgSet(tempBgList);
      }
    }

    function delCustomBackground(index: number) {
      let tempBgList = [...props.personalBgSet];
      tempBgList[props.bgOption.current].splice(index, 1);
      props.setPersonalBgSet(tempBgList);
    }

    function addBgSet() {
      if (props.personalBgSet) {
        props.setPersonalBgSet([...props.personalBgSet, []]);
      } else {
        props.setPersonalBgSet([[]]);
      }
    }

    useEffect(() => {
      chrome.storage.sync.get(['personalBgSet', 'bgOption'], function (result) {
        props.setPersonalBgSet(result.personalBgSet);
        props.setBgOption(result.bgOption);
      });
    }, []);

    useEffect(() => {
      chrome.storage.sync.set({ personalBgSet: props.personalBgSet }, function () {
        // console.log(props.personalBgSet);
      });
    }, [props.personalBgSet]);

    useEffect(() => {
      chrome.storage.sync.set({ bgOption: props.bgOption }, function () {
        // console.log(props.bgOption);
      });
    }, [props.bgOption]);

    return (
      <SettingPanelWrapper>
        {isPanelOpen &&
          <PanelWrapper>
            <BackgroundWrapper>
              <button onClick={() => setIsPanelOpen(false)}>close</button>
              {props.bgOption.current === 0 ? "Random" : props.bgOption.current}<BackgroundImage bg={props.currentBackground.url}></BackgroundImage>
              <div>
                <button onClick={() => props.setBgOption({ ...props.bgOption, current: 0 })}>Random</button>
                {props.personalBgSet && props.personalBgSet.map((_, index: number) => { return <button key={index + 1} onClick={() => props.setBgOption({ ...props.bgOption, current: index })}>{index}</button>; })}
                <button onClick={addBgSet}>add custom set</button>
              </div>
              <button onClick={addCustomBackgrounds}>Add</button>

              <BackgroundContainer>
                {!!(props.bgOption.current + 1) && props.personalBgSet[props.bgOption.current].map((bg, index) => {
                  return <BackgroundImage key={`${bg}+${index}`} bg={bg.url}><button onClick={() => { delCustomBackground(index); }}>x</button></BackgroundImage>;
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