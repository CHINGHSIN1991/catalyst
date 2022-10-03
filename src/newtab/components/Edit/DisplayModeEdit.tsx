import React from 'react';
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';

import { getEditPanelState, setEditPanel } from '../../features/reducers/editSlice';
import { editShortcut } from '../../features/reducers/shortcutsSlice';
import { EditPanelWrapper, EditPanelTitle, EditPanelTitleText, EditPanelTitleUnderLine } from '../../../static/styleSetting';
import { InputComponent, PanelButton, ButtonContainer } from '../../../static/components';
import { handleInputChange } from '../../../utils/functions';
import { getPersonalization, loadPersonalization } from '../../features/reducers/optionsSlice';

const Wrapper = styled(EditPanelWrapper)`
  width: 320px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.div`
  width: 100%;
  padding-left: 4px;
  color: rgb(160,160,160);
  font-size: 0.875rem;
  line-height: 20px;
`;

const PublicOptionSet = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 100%;
  height: 28px;
  background-color: rgba(0,0,0,0.3);
  border-radius: 14px;
`;

const PublicOption = styled.div`
  font-size: 14px;
  line-height: 20px;
  width: 50%;
  text-align: center;
  font-weight: ${(props) => { return props.boolean ? 'bold' : 'normal'; }};
  color: ${(props) => { return props.boolean ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.3)'; }};
  transition: 0.2s;
`;

const PublicOptionBg = styled.div`
  position: absolute;
  left: ${(props) => { return props.boolean ? '4px' : 'calc(50% + 4px)'; }};
  transition: 0.2s;
  width: calc(50% - 8px);
  height: 20px;
  border-radius: 10px;
  background-color: #fff;
`;

const InfoContainer = styled.div`
  padding: 8px 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  height: 64px;
`;

export const DisplayModePanel: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const personalization = useSelector(getPersonalization);
  const [tempPersonalization, setTempPersonalization] = useState({
    isMilitary: true,
    isCelsius: true,
    isMenuShow: true,
    idCalendarColorful: true,
    isPrivateShow: true,
    isDarkMode: true,
    pronounce: 'en-US',
  });

  function handleSettingChanged(key: string) {
    setTempPersonalization({ ...tempPersonalization, [key]: !tempPersonalization[key] });
  }

  function saveOption() {
    chrome.storage.sync.set({ personalization: tempPersonalization }, () => {
      dispatch(loadPersonalization(tempPersonalization));
      dispatch(setEditPanel({ name: '', data: '' }));
    });
  }

  useEffect(() => {
    setTempPersonalization(personalization);
  }, []);

  return (
    <Wrapper onClick={(e: Event) => e.stopPropagation()}>
      <EditPanelTitle>
        <EditPanelTitleText>
          Display mode
        </EditPanelTitleText>
        <EditPanelTitleUnderLine></EditPanelTitleUnderLine>
      </EditPanelTitle>
      <OptionElement
        title='Display mode'
        truthy='Dark mode'
        falsy='Light mode'
        keyName='isDarkMode'
        bol={tempPersonalization.isDarkMode}
        handleSettingChanged={handleSettingChanged}
      ></OptionElement>
      <ButtonContainer>
        <PanelButton name="Save" width={80} onClick={saveOption}></PanelButton>
        <PanelButton name="Cancel" width={80} onClick={() => { dispatch(setEditPanel({ name: '' })); }}></PanelButton>
      </ButtonContainer>
    </Wrapper>
  );
};

const OptionElement: React.FC<{ title: string, truthy: string, falsy: string; bol: boolean, keyName: string, handleSettingChanged: (key: string) => void; }> = (props) => {
  return (
    <InfoContainer onClick={() => { console.log(props.keyName); props.handleSettingChanged(props.keyName); }}>
      <Title>{props.title}</Title>
      <PublicOptionSet>
        <PublicOptionBg boolean={props.bol}></PublicOptionBg>
        <PublicOption boolean={props.bol}>{props.truthy}</PublicOption>
        <PublicOption boolean={!props.bol}>{props.falsy}</PublicOption>
      </PublicOptionSet>
    </InfoContainer>
  );
};