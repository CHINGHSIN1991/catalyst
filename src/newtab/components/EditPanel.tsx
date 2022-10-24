import React from 'react';
import styled from "styled-components";
import { useSelector, useDispatch } from 'react-redux';

import { getEditPanelState, setEditPanel } from '../features/reducers/editSlice';

import { ShortcutEditPanel } from './Edit/ShortcutEdit';
import { CalendarEditPanel } from './Edit/CalendarEdit';
import { BackgroundEditPanel } from './Edit/BackGroundEdit';
import { UserInfoEditPanel } from './Edit/UserInfoEdit';
import { PronounceToolEditPanel } from './Edit/PronounceToolEdit';
import { MenuOptionPanel } from './Edit/MenuOptionPanel';
import { DisplayModePanel } from './Edit/DisplayModeEdit';
import { ServiceEditPanel } from './Edit/PersonalServiceEdit';

type editPanelState = { editPanelState: string; };

const PanelOpenBackground = styled.div`
  width: 100vw;
  height: ${(props: editPanelState) => props.editPanelState === '' ? "0vh" : "100vh"};
  opacity: ${(props: editPanelState) => props.editPanelState === '' ? '0' : '1'};
  left: 0px;
  top: 0px;
  position: fixed;
  background-color: rgba(128,128,128,0.1);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.03s;
  z-index: 100;
`;

const PanelContainer = styled.div`
  width: ${(props: editPanelState) => props.editPanelState === '' ? '0vh' : '100vw'};
  height: ${(props: editPanelState) => props.editPanelState === '' ? '0vh' : '100vh'};
  transform: ${(props: editPanelState) => props.editPanelState === '' ? 'translateY(30%)' : 'translateY(0%)'};
  opacity: ${(props: editPanelState) => props.editPanelState === '' ? '0' : '1'};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
  transition-delay: 0.1s;
`;

const EditPanel: React.FC<{}> = () => {
  const editPanelState = useSelector(getEditPanelState);
  const dispatch = useDispatch();

  return (
    <PanelOpenBackground editPanelState={editPanelState.name} onClick={() => dispatch(setEditPanel({ name: '', data: '' }))}>
      <PanelContainer editPanelState={editPanelState.name}>
        {(editPanelState.name === 'ShortcutEdit' || editPanelState.name === 'ShortcutAdd') && <ShortcutEditPanel></ShortcutEditPanel>}
        {(editPanelState.name === 'EventEdit' || editPanelState.name === 'EventAdd') && <CalendarEditPanel></CalendarEditPanel>}
        {editPanelState.name === 'BackgroundEdit' && <BackgroundEditPanel></BackgroundEditPanel>}
        {editPanelState.name === 'UserInfoEdit' && <UserInfoEditPanel></UserInfoEditPanel>}
        {editPanelState.name === 'PronounceToolEdit' && <PronounceToolEditPanel></PronounceToolEditPanel>}
        {editPanelState.name === 'MenuOptionEdit' && <MenuOptionPanel></MenuOptionPanel>}
        {editPanelState.name === 'DisplayModeEdit' && <DisplayModePanel></DisplayModePanel>}
        {editPanelState.name === 'ServiceEdit' && <ServiceEditPanel></ServiceEditPanel>}
      </PanelContainer>
    </PanelOpenBackground>
  );
};

export const MemoizedEditPanel = React.memo(EditPanel);
