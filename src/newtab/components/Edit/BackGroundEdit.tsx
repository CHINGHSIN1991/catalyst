import React from 'react';
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';

import { getEditPanelState, setEditPanel } from '../../features/reducers/editSlice';
import { loadBackgrounds } from '../../features/reducers/backgroundSlice';
import { editShortcut } from '../../features/reducers/shortcutsSlice';
import { EditPanelWrapper, EditPanelTitle, EditPanelTitleText, EditPanelTitleUnderLine } from '../../styleSetting';
import { handleInputChange } from '../../../utils/inputHandler';
import { getBackgrounds } from '../../features/reducers/backgroundSlice';
import { background, backgroundSetting } from '../../../static/types';
import { PanelButton, ButtonContainer } from '../../../static/components';

const Wrapper = styled(EditPanelWrapper)`
  width: 738px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BackgroundContainer = styled.div`
  /* border: solid 1px; */
  padding: 8px 0;
  background-color: lightgray;
  border-radius: 0px 0px 4px 4px; 
  height: 240px;
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: start;
  align-content: flex-start;
  flex-wrap: wrap;
  overflow-y: scroll;
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

const BackgroundStatusPanel = styled.div`
  display: flex;
  align-items: flex-end;
  width: 100%;
`;

const StatusPanel = styled.div`
  flex-shrink:1;
  flex-direction: column;
  margin: 16px 0 24px;
  padding: 8px 24px;
`;

const CurrentStatusPanel = styled(StatusPanel)`
  width: 240px;
  /* border: solid 2px gray; */
  border-radius: 4px;
  background-color: lightgray;
`;

const StatusTitle = styled.div`
  font-size: 12px;
  color: rgb(80,80,80);
  padding-bottom: 8px;
`;

const StatusContent = styled.div`
  font-size: 32px;
  font-weight: bold;
`;

const ApplyCollectionBtn = styled.div`
  position: absolute;
  right: 0px;
  bottom: 32px;
  cursor: pointer;
  box-sizing: border-box;
  text-align: center;
  font-size: 14px;
  line-height: 24px;
  height: 28px;
  width: 128px;
  border-radius: 4px;
  color: ${(props: { disabled: boolean; }) => { return props.disabled ? "rgba(184,184,184,1)" : "rgb(80,80,80,1)"; }};
  background-color: ${(props: { disabled: boolean; }) => { return props.disabled ? "rgba(240,240,240,1)" : "rgba(80,80,80,0)"; }};
  border: solid 2px ${(props: { disabled: boolean; }) => { return props.disabled ? "rgba(184,184,184,1)" : "rgba(80,80,80,1)"; }};;
  transition: 0.1s;
  :hover{
    color: ${(props: { disabled: boolean; }) => { return props.disabled ? "rgba(184,184,184,1)" : "rgb(255,255,255,1)"; }};
    background-color: ${(props: { disabled: boolean; }) => { return props.disabled ? "rgba(240,240,240,1)" : "rgba(80,80,80,1)"; }};
  }
`;

const BackgroundListPanel = styled.div`
  width: 100%;
  height: 24px;
  display: flex;
`;

const BackgroundListOption = styled.div`
  cursor: pointer;
  border-radius: 4px 4px 0px 0px ; 
  font-size: 12px;
  margin-right: 2px;
  line-height: 24px;
  width: 120px;
  height: 24px;
  background-color: ${(props) => { return props.index === props.currentSet ? 'lightgray' : 'gray'; }};
  text-align: center;
  transition: 0.2s;
  :hover{
    background-color: ${(props) => { return props.index === props.currentSet ? 'lightgray' : 'darkgray'; }};
  }
  :last-child{
    margin-right: 0px;
  }
`;

const BackgroundImage = styled.div`
  cursor: pointer;
  border: solid 1px gray;
  border-radius: 4px;
  margin: 8px;
  width: 120px;
  height: 80px;
  background-image: url(${(props: { bg: string; }) => { return props.bg; }});
  background-position: center;
  background-size: cover;
  overflow: hidden;
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
  color: white;
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

export const BackgroundEditPanel: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const editPanelState = useSelector(getEditPanelState);
  // const backgroundSetting = useSelector(getBackgrounds);
  const [tempBackgroundSetting, setTempBackgroundSetting] = useState<backgroundSetting>(null);
  const [currentSet, setCurrentSet] = useState(0);


  function addImgToCollection(image: background, collection: number) {
    let temp = JSON.parse(JSON.stringify(tempBackgroundSetting));
    if (!temp.backgroundList[collection].find((item: background) => item.id === image.id)) {
      temp.backgroundList[collection].push(image);
      setTempBackgroundSetting(temp);
    }
  }

  function delImgInCollection(image: background, collection: number) {
    let temp = JSON.parse(JSON.stringify(tempBackgroundSetting));
    temp.backgroundList[collection] = temp.backgroundList[collection].filter((item) => item.id !== image.id);
    setTempBackgroundSetting(temp);
  }

  function applyCollection(index: number) {
    if (tempBackgroundSetting.backgroundList[index].length > 0) {
      setTempBackgroundSetting({ ...tempBackgroundSetting, current: { setting: index, slice: 0 } });
    }
  }

  useEffect(() => {
    if ('data' in editPanelState && editPanelState.name === 'BackgroundEdit') {
      setTempBackgroundSetting(JSON.parse(JSON.stringify(editPanelState.data)));
    }
  }, [editPanelState]);

  console.log(tempBackgroundSetting);
  return (
    <Wrapper onClick={(e: Event) => e.stopPropagation()}>
      <EditPanelTitle>
        <EditPanelTitleText>
          Background setting
        </EditPanelTitleText>
        <EditPanelTitleUnderLine></EditPanelTitleUnderLine>
      </EditPanelTitle>
      <BackgroundStatusPanel>
        <CurrentStatusPanel>
          <StatusTitle>Current applied</StatusTitle>
          <StatusContent>{tempBackgroundSetting && (tempBackgroundSetting.current.setting === 0 ? 'Random' : `Collection ${tempBackgroundSetting.current.setting}`)}</StatusContent>
        </CurrentStatusPanel>
        <StatusPanel>
          <StatusTitle>Selected / {(currentSet === 0 ? 'Get 10 random images everyday' : `You can add images from other collections`)}</StatusTitle>
          <StatusContent>{(currentSet === 0 ? 'Random' : `Collection ${currentSet}`)}</StatusContent>
        </StatusPanel>
        <ApplyCollectionBtn onClick={() => applyCollection(currentSet)} disabled={tempBackgroundSetting && tempBackgroundSetting.backgroundList[currentSet].length === 0}>
          {tempBackgroundSetting && (tempBackgroundSetting.backgroundList[currentSet].length === 0 ? 'Add some images' : 'Apply this')}
        </ApplyCollectionBtn>
      </BackgroundStatusPanel>
      <BackgroundListPanel>
        {[0, 1, 2, 3, 4, 5].map((item) => {
          return <BackgroundListOption key={'option' + item} currentSet={currentSet} index={item} onClick={() => setCurrentSet(item)}>{item === 0 ? 'Random' : `Collection ${item}`}</BackgroundListOption>;
        })}
      </BackgroundListPanel>
      <BackgroundContainer>
        {tempBackgroundSetting && tempBackgroundSetting.backgroundList[currentSet].map((bg, index) => {
          return <BackgroundImage key={`${bg}+${index}`} bg={bg.smallUrl}>
            <AddToCollectionPanel>
              <AddToCollectionTitle>Add to Collection</AddToCollectionTitle>
              <AddToCollectionOptionList>
                {[1, 2, 3, 4, 5].map((item) => { return item === currentSet ? '' : <AddToCollectionOption key={bg.id + item} onClick={() => addImgToCollection(bg, item)}>{item}</AddToCollectionOption>; })}
              </AddToCollectionOptionList>
              {currentSet !== 0 && <DeleteBtn onClick={() => delImgInCollection(bg, currentSet)}>Delete</DeleteBtn>}
            </AddToCollectionPanel>
          </BackgroundImage>;
        })}
      </BackgroundContainer>
      <ButtonContainer>
        <PanelButton width={80} name='Cancel' onClick={() => dispatch(setEditPanel({ name: '', data: '' }))} />
        <PanelButton width={80} name='Save' onClick={() => { dispatch(loadBackgrounds(tempBackgroundSetting)); dispatch(setEditPanel({ name: '', data: '' })); }} />
      </ButtonContainer>
    </Wrapper>
  );
};