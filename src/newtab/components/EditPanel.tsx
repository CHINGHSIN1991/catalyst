import React from 'react';
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';

import { getEditPanelState, setEditPanel } from '../features/reducers/editSlice';

import { ShortcutEditPanel } from './Edit/ShortcutEdit';
import { CalendarEditPanel } from './Edit/CalendarEdit';

const PanelOpenBackground = styled.div`
  width: 100vw;
  height: ${(props: { editPanelState: string; }) => { return props.editPanelState === '' ? "0vh" : "100vh"; }};
  opacity: ${(props: { editPanelState: string; }) => { return props.editPanelState === '' ? '0' : '1'; }};
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
  /* border: solid 1px; */
  width: ${(props: { editPanelState: string; }) => { return props.editPanelState === '' ? '0vh' : '100vw'; }};
  height: ${(props: { editPanelState: string; }) => { return props.editPanelState === '' ? '0vh' : '100vh'; }};
  transform: ${(props: { editPanelState: string; }) => { return props.editPanelState === '' ? 'translateY(30%)' : 'translateY(0%)'; }};;
  opacity: ${(props: { editPanelState: string; }) => { return props.editPanelState === '' ? '0' : '1'; }};;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
  transition-delay: 0.1s;
`;

export const EditPanel: React.FC<{}> = () => {
  const editPanelState = useSelector(getEditPanelState);
  const dispatch = useDispatch();
  return (
    <PanelOpenBackground editPanelState={editPanelState.name} onClick={() => dispatch(setEditPanel({ name: '', data: '' }))}>
      <PanelContainer editPanelState={editPanelState.name}>
        {(editPanelState.name === 'ShortcutEdit' || editPanelState.name === 'ShortcutAdd') && <ShortcutEditPanel></ShortcutEditPanel>}
        {(editPanelState.name === 'EventEdit') && <CalendarEditPanel></CalendarEditPanel>}
      </PanelContainer>
    </PanelOpenBackground>
  );
};

