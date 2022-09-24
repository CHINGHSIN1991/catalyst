import React from 'react';
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';

import { getEditPanelState, setEditPanel } from '../../features/reducers/editSlice';
import { editShortcut } from '../../features/reducers/shortcutsSlice';
import { EditPanelWrapper, EditPanelTitle, EditPanelTitleText, EditPanelTitleUnderLine } from '../../styleSetting';
import { InputComponent, PanelButton } from '../../../static/components';
import { handleInputChange } from '../../../utils/inputHandler';

const Wrapper = styled(EditPanelWrapper)`
  width: 480px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ButtonContainer = styled.div`
  width: 100%;
  padding-top: 16px;
  display: flex;
  justify-content: center;
`;

type shortcut = {
  id?: Date,
  name: string,
  url: string,
  logo?: string,
};

export const ShortcutEditPanel: React.FC<{}> = () => {
  const editPanelState = useSelector(getEditPanelState);
  const dispatch = useDispatch();
  const [shortcut, setShortcut] = useState({ name: '', url: '' });

  function editShortcutProcess(state: shortcut) {
    console.log(state);
    if (state.name && state.url) {
      dispatch(editShortcut(state));
      setShortcut({ name: '', url: '' });
      dispatch(setEditPanel({ name: '', data: { name: '', url: '' } }));
    }
  }

  function cancelProcess() {
    dispatch(setEditPanel({ name: '', data: { name: '', url: '' } }));
    setShortcut({ name: '', url: '' });
  }

  useEffect(() => {
    if ('data' in editPanelState) {
      setShortcut(editPanelState.data);
    }
  }, [editPanelState]);

  return (
    <Wrapper onClick={(e: Event) => e.stopPropagation()}>
      <EditPanelTitle>
        <EditPanelTitleText>
          {editPanelState.name === 'ShortcutEdit' && 'Edit shortcut'}
          {editPanelState.name === 'ShortcutAdd' && 'Add shortcut'}
        </EditPanelTitleText>
        <EditPanelTitleUnderLine></EditPanelTitleUnderLine>
      </EditPanelTitle>
      <InputComponent name="name" title="Name" value={shortcut.name} onChange={(e) => handleInputChange(e, shortcut, setShortcut)}></InputComponent>
      <InputComponent name="url" title="URL" value={shortcut.url} onChange={(e) => handleInputChange(e, shortcut, setShortcut)}></InputComponent>
      <ButtonContainer>
        <PanelButton name="Done" disabled={!(shortcut.name && shortcut.url)} onClick={() => editShortcutProcess(shortcut)}></PanelButton>
        <PanelButton name="Cancel" onClick={cancelProcess}></PanelButton>
      </ButtonContainer>
    </Wrapper>
  );
};