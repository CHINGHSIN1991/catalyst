import React from 'react';
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';

import { getEditPanelState, setEditPanel } from '../../features/reducers/editSlice';
import { editShortcut } from '../../features/reducers/shortcutsSlice';
import { EditPanelWrapper, EditPanelTitle, EditPanelTitleText, EditPanelTitleUnderLine } from '../../../static/styleSetting';
import { InputComponent, PanelButton, ButtonContainer } from '../../../static/components';
import { handleInputChange } from '../../../utils/inputHandler';
import { getPersonalization, loadPersonalization } from '../../features/reducers/optionsSlice';
import { languageList } from '../../../static/optionList';

const Wrapper = styled(EditPanelWrapper)`
  width: 360px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SelectInput = styled.select`
  margin-top: 8px;
  width: 100%;
  font-size: 1rem;
  height: 32px;
  line-height: 32px;
  border: solid 0.5px grey;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: rgba(255,255,255,0);
  transition: 0.2s;
  :focus {
    background-color: rgba(255,255,255,0.8);
    border: solid 0.5px grey;
  }
`;

const SelectOption = styled.option`
  padding: 0 8px;
`;

export const PronounceToolEditPanel: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const personalization = useSelector(getPersonalization);
  const [language, setLanguage] = useState(null);

  function saveLanguageSetting() {
    const tempPersonalization = { ...personalization, pronounce: language };
    chrome.storage.sync.set({ personalization: tempPersonalization }, () => {
      dispatch(loadPersonalization(tempPersonalization));
      dispatch(setEditPanel({ name: '', data: '' }));
    });
  }

  useEffect(() => {
    setLanguage(personalization.pronounce);
  }, []);

  return (
    <Wrapper onClick={(e: Event) => e.stopPropagation()}>
      <EditPanelTitle>
        <EditPanelTitleText>
          Pronounce tool setting
        </EditPanelTitleText>
        <EditPanelTitleUnderLine></EditPanelTitleUnderLine>
      </EditPanelTitle>
      <SelectInput value={language} onChange={(e) => setLanguage(e.target.value)}>
        {languageList.map((item) => { return <SelectOption value={item.LangCultureName}>{item.DisplayEN}</SelectOption>; })}
      </SelectInput>
      <ButtonContainer>
        <PanelButton width={80} name='Save' onClick={saveLanguageSetting} />
        <PanelButton width={80} name='Cancel' onClick={() => dispatch(setEditPanel({ name: '', data: '' }))} />
      </ButtonContainer>
    </Wrapper>
  );
};