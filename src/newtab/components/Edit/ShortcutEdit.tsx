import React from 'react';
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';

import { getEditPanelState, setEditPanel } from '../../features/reducers/editSlice';
import { editShortcut } from '../../features/reducers/shortcutsSlice';

import { EditPanelWrapper, EditPanelTitle, EditPanelTitleText, EditPanelTitleUnderLine } from '../../../static/styleSetting';
import { InputComponent, PanelButton, ButtonContainer } from '../../../static/components';
import { handleInputChange } from '../../../utils/functions';
import { shortcut } from '../../../static/types';

const Wrapper = styled(EditPanelWrapper)`
  width: 480px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ShortcutEditPanel: React.FC<{}> = () => {
  const editPanelState = useSelector(getEditPanelState);
  const dispatch = useDispatch();
  const [shortcut, setShortcut] = useState({ name: '', url: '' });

  function editShortcutProcess(state: shortcut) {
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
    if ('data' in editPanelState && editPanelState.name === 'ShortcutEdit') {
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
      <InputComponent name="name" title="Name" value={shortcut.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, shortcut, setShortcut)}></InputComponent>
      <InputComponent name="url" title="URL" value={shortcut.url} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, shortcut, setShortcut)}></InputComponent>
      <ButtonContainer>
        <PanelButton name="Done" width={80} disabled={!(shortcut.name && shortcut.url)} onClick={() => editShortcutProcess(shortcut)}></PanelButton>
        <PanelButton name="Cancel" width={80} onClick={cancelProcess}></PanelButton>
      </ButtonContainer>
    </Wrapper>
  );
};
