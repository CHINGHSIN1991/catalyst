import React from 'react';
import styled from "styled-components";
import { useState, useEffect } from "react";

import { background, backgroundSetting, currentComparison, appliedComparison } from '../../static/types';
import { ScrollbarContainer } from '../../static/styleSetting';

const Wrapper = styled.div`
  width: 100%;
  padding: 24px 0 0;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width:1180px) {
    padding: 16px 0 0;
  }
`;

const EditPanelTitle = styled.div`
  color: rgba(255,255,255,1);
  width: 100%;
  padding: 16px 0;
`;

const EditPanelTitleText = styled.div`
  font-weight: bold;
`;

const EditPanelTitleUnderLine = styled.div`
  width: 100%;
  height: 1px;
  margin-top: 8px;
  background-color: grey;
`;

const BackgroundContainer = styled(ScrollbarContainer)`
  padding: 16px;
  background-color: lightgray;
  border-radius: 0px 8px 8px 8px; 
  min-height: 416px;
  height: auto;
  max-height: 600px;
  width: calc(100% - 120px);
  display: flex;
  align-items: flex-start;
  justify-content: start;
  align-content: flex-start;
  flex-wrap: wrap;
  @media (max-width:1580px) {
    min-height: 480px;
  } 
  @media (max-width:768px) {
    width: calc(100% - 100px);
  }
`;

const BackgroundListPanel = styled.div`
  width: 120px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  @media (max-width:768px) {
    width: 100px;
  }
`;

const BackgroundListOption = styled.div`
  cursor: pointer;
  border-radius: 8px 0px 0px 8px ; 
  display: flex;
  flex-direction: column;
  margin-bottom: 3px;
  line-height: 24px;  
  width: ${(props: currentComparison) => props.index === props.current ? '120px' : '104px'};
  height: 60px;
  background-color: ${(props: currentComparison) => props.index === props.current ? 'lightgray' : 'gray'};
  transition: 0.2s;
  :hover{
    background-color: ${(props: currentComparison) => props.index === props.current ? 'lightgray' : 'darkgray'};
  }
  :last-child{
    margin-bottom: 0px;
  }

  @media (max-width:768px) {
    width: ${(props: currentComparison) => props.index === props.current ? '100px' : '80px'};
  } 
`;

const BackgroundListOptionTitle = styled.div`
  padding: 4px 0 0 16px;
  font-size: 0.875rem;
  font-weight: bold;
  @media (max-width:768px) {
    font-size: 0.75rem;
    padding: 4px 0 0 8px;
  } 
`;

const BackgroundImage = styled.div`
  cursor: pointer;
  border: solid 1px gray;
  border-radius: 4px;
  margin: 8px;
  width: 152px;
  height: 96px;
  background-image: url(${(props: { bg: string; }) => { return props.bg; }});
  background-position: center;
  background-size: cover;
  overflow: hidden;
  @media (max-width:1180px) {
    width: 120px;
    height: 80px;
  } 
`;

const AddToCollectionOptionList = styled.div`
  padding-top: 8px;
  width: 100%;
  display: flex;
  justify-content: center;
  opacity: 0;
  transform: translateY(4px);
  transition: 0.1s;
  transition-delay: 0.1s;
`;

const AddToCollectionOption = styled.div`
  font-size: 12px;
  width: 16px;
  height: 16px;
  margin: 0 2px;
  border-radius: 4px;
  background-color: rgba(255,255,255,0.6);
  line-height: 16px;
  text-align: center;
  :hover {
    background-color: rgba(255,255,255,0.9);
  }
`;

const DeleteBtn = styled.div`
  margin-top: 8px;
  font-size: 12px;
  height: 16px;
  line-height: 12px;
  border-radius: 4px;
  padding: 2px 4px;
  background-color: rgba(255,255,255,0.6);
  opacity: 0;
  transform: translateY(4px);
  transition: 0.1s;
  transition-delay: 0.2s;
  :hover {
    background-color: rgba(255,255,255,0.9);
  }
`;

const AddToCollectionTitle = styled.div`
  width: 100%;
  color: rgba(255,255,255,1);
  font-size: 12px;
  text-align: center;
  opacity: 0;
  transform: translateY(4px);
  transition: 0.1s;
`;

const AddToCollectionPanel = styled.div`
  position: absolute;
  left: 0px;
  top: 0px;
  background-color: rgba(0,0,0,0);
  transition: 0.2s;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 8px;
  :hover{
    background-color: rgba(0,0,0,0.7);
    ${AddToCollectionTitle} {
      opacity: 1;
      transform: translateY(0px);
    }
    ${AddToCollectionOptionList}{
      opacity: 1;
      transform: translateY(0px);
    }
    ${DeleteBtn}{
      opacity: 1;
      transform: translateY(0px);
    }
  }
`;
const Title = styled.div`
  width: 100%;
  padding-top: 8px;
  padding-left: 120px;
  color: rgb(160,160,160);
  font-size: 0.875rem;
  line-height: 20px;
  @media (max-width:768px) {
    padding-left: 100px;
  } 
`;

const BackgroundPanel = styled.div`
  margin-top: 0px;
  display: flex;
  width: 100%;
  height: auto;
`;

const ApplyButton = styled.div`
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  line-height: 20px;
  width: ${(props: appliedComparison) => props.applied === props.index ? '72px' : '56px'};
  margin: 2px 0 8px 16px;
  text-align: center;
  color: ${(props: appliedComparison) => props.applied === props.index ? 'rgb(80,80,80)' : 'rgb(80,80,80)'};
  background-color: ${(props: appliedComparison) => props.applied === props.index ? 'rgb(173, 255, 218)' : 'rgb(184,184,184)'};
  white-space: nowrap;
  overflow: hidden;
  transition: 0.2s;
  /* padding: 4px 0 0 16px; */
  :hover {
    background-color: ${(props: appliedComparison) => props.applied === props.index ? 'rgb(173, 255, 218)' : 'rgb(40,40,40)'};
    color: ${(props: appliedComparison) => props.applied === props.index ? 'rgb(80,80,80)' : 'rgb(240,240,240)'};
  }
  @media (max-width:768px) {
    margin: 2px 0 8px 8px;
  } 
`;

export const BackgroundEditPanel: React.FC<{}> = () => {
  const [tempBackgroundSetting, setTempBackgroundSetting] = useState<backgroundSetting>(null);
  const [current, setCurrentSet] = useState(0);


  function addImgToCollection(image: background, collection: number) {
    let temp = JSON.parse(JSON.stringify(tempBackgroundSetting));
    if (!temp.backgroundList[collection].find((item: background) => item.id === image.id)) {
      temp.backgroundList[collection].push(image);
      setTempBackgroundSetting(temp);
    }
  }

  function delImgInCollection(image: background, collection: number) {
    let temp = JSON.parse(JSON.stringify(tempBackgroundSetting));
    temp.backgroundList[collection] = temp.backgroundList[collection].filter((item: background) => item.id !== image.id);
    setTempBackgroundSetting(temp);
  }

  function applyCollection(index: number) {
    if (tempBackgroundSetting.backgroundList[index].length > 0) {
      setTempBackgroundSetting({ ...tempBackgroundSetting, bgSetting: { ...tempBackgroundSetting.bgSetting, current: { setting: index, slice: 0 } } });
    }
  }

  useEffect(() => {
    chrome.storage.sync.get(['bgSetting', 'bgSet0', 'bgSet1', 'bgSet2', 'bgSet3', 'bgSet4', 'bgSet5'], (res) => {
      const tempBgSetting = {
        bgSetting: res.bgSetting,
        backgroundList: [res.bgSet0, res.bgSet1, res.bgSet2, res.bgSet3, res.bgSet4, res.bgSet5],
      };
      console.log(tempBgSetting);
      setTempBackgroundSetting(tempBgSetting);
    });
  }, []);

  useEffect(() => {
    tempBackgroundSetting &&
      chrome.storage.sync.set({
        bgSetting: tempBackgroundSetting.bgSetting,
        bgSet0: tempBackgroundSetting.backgroundList[0],
        bgSet1: tempBackgroundSetting.backgroundList[1],
        bgSet2: tempBackgroundSetting.backgroundList[2],
        bgSet3: tempBackgroundSetting.backgroundList[3],
        bgSet4: tempBackgroundSetting.backgroundList[4],
        bgSet5: tempBackgroundSetting.backgroundList[5],
      });
  }, [tempBackgroundSetting]);

  console.log(tempBackgroundSetting);
  return (
    <Wrapper onClick={(e: Event) => e.stopPropagation()}>
      <EditPanelTitle>
        <EditPanelTitleText>
          Background setting
        </EditPanelTitleText>
        <EditPanelTitleUnderLine></EditPanelTitleUnderLine>
      </EditPanelTitle>
      <Title>{(current === 0 ? 'Get 10 random images everyday' : `You can add images from other collections`)}</Title>
      <BackgroundPanel>
        <BackgroundListPanel>
          {tempBackgroundSetting && [0, 1, 2, 3, 4, 5].map((number) => {
            return <BackgroundListOption
              key={'option' + number}
              current={current}
              index={number} onClick={() => setCurrentSet(number)}
              currentApplied={tempBackgroundSetting.bgSetting.current.setting}
            >
              <BackgroundListOptionTitle>{number === 0 ? 'Random' : `Collection ${number}`}
                {/* {tempBackgroundSetting.current.setting === item && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pin-angle" viewBox="0 0 16 16">
                  <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146zm.122 2.112v-.002.002zm0-.002v.002a.5.5 0 0 1-.122.51L6.293 6.878a.5.5 0 0 1-.511.12H5.78l-.014-.004a4.507 4.507 0 0 0-.288-.076 4.922 4.922 0 0 0-.765-.116c-.422-.028-.836.008-1.175.15l5.51 5.509c.141-.34.177-.753.149-1.175a4.924 4.924 0 0 0-.192-1.054l-.004-.013v-.001a.5.5 0 0 1 .12-.512l3.536-3.535a.5.5 0 0 1 .532-.115l.096.022c.087.017.208.034.344.034.114 0 .23-.011.343-.04L9.927 2.028c-.029.113-.04.23-.04.343a1.779 1.779 0 0 0 .062.46z" />
                </svg>} */}
              </BackgroundListOptionTitle>
              {(number === tempBackgroundSetting.bgSetting.current.setting || number === current) &&
                <ApplyButton
                  onClick={() => applyCollection(number)}
                  applied={tempBackgroundSetting.bgSetting.current.setting}
                  index={number}
                  current={current}>
                  {tempBackgroundSetting.bgSetting.current.setting === number && 'Current'}
                  {tempBackgroundSetting.bgSetting.current.setting !== number && tempBackgroundSetting.backgroundList[number].length > 0 && 'Apply'}
                </ApplyButton>}
            </BackgroundListOption>;
          })}
        </BackgroundListPanel>
        <BackgroundContainer>
          {tempBackgroundSetting && tempBackgroundSetting.backgroundList[current].map((bg, index) => {
            return <BackgroundImage key={`${bg}+${index}`} bg={bg.smallUrl}>
              <AddToCollectionPanel>
                <AddToCollectionTitle>Add to Collection</AddToCollectionTitle>
                <AddToCollectionOptionList>
                  {[1, 2, 3, 4, 5].map((item) => { return item === current ? '' : <AddToCollectionOption key={bg.id + item} onClick={() => addImgToCollection(bg, item)}>{item}</AddToCollectionOption>; })}
                </AddToCollectionOptionList>
                {current !== 0 && <DeleteBtn onClick={() => delImgInCollection(bg, current)}>Delete</DeleteBtn>}
              </AddToCollectionPanel>
            </BackgroundImage>;
          })}
        </BackgroundContainer>
      </BackgroundPanel>
    </Wrapper>
  );
};