import React from 'react';
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';

import { setEditPanel } from '../../features/reducers/editSlice';
import { getServiceList, loadServiceList } from '../../features/reducers/personalServiceSlice';

import { EditPanelWrapper, EditPanelTitle, EditPanelTitleText, EditPanelTitleUnderLine } from '../../../static/styleSetting';
import { PanelButton, ButtonContainer } from '../../../static/components';
import { personalServiceList } from '../../../static/optionList';
import { scheme } from '../../../static/types';

type index = { index: number; };

const Wrapper = styled(EditPanelWrapper)`
  width: 360px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ServiceContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;

const ServiceItem = styled.div`
  box-sizing: border-box;
  opacity: ${(props: index) => props.index === -1 ? 0.3 : 1};
  border: ${(props: index) => props.index === -1 ? 'solid 2px rgba(127, 255, 212,0)' : `solid 2px rgba(127, 255, 212,1) `};
  cursor: pointer;
  width: calc(25% - 16px);
  margin: 8px;
  padding: 12px 8px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  transition: 0.2s;
  :hover {
    opacity: 1;
  }
`;

const ServiceIcon = styled.img`
  width: 32px;
  height: 32px;
  object-fit: contain;
`;

const ServiceTitle = styled.div`  
  padding-top: 8px;
  font-size: 0.75rem;
`;

const IndexBox = styled.div`
  position: absolute;
  right: -10px;
  top: 1px;
  width: ${(props: index) => props.index === -1 ? '0px' : '20px'};
  height: ${(props: index) => props.index === -1 ? '0px' : '20px'};
  transform: translateY(-50%);
  border-radius: 10px;
  font-size: 8px;
  text-align: center;
  line-height: 20px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  transition: 0.02s;
  color: ${(props: scheme) => props.theme.accentText};
  background-color:  ${(props: scheme) => props.theme.accentColor};
`;

export const ServiceEditPanel: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const [tempServiceList, setTempServiceList] = useState([]);
  const serviceList = useSelector(getServiceList);

  function cancelProcess() {
    dispatch(setEditPanel({ name: '', data: '' }));
  }

  function saveServiceList() {
    chrome.storage.sync.set({ serviceList: tempServiceList }, () => {
      dispatch(loadServiceList(tempServiceList));
      dispatch(setEditPanel({ name: '', data: '' }));
    });
  }

  function toggleListItem(id: number) {
    if (tempServiceList.includes(id)) {
      setTempServiceList(tempServiceList.filter(index => index !== id));
    } else {
      setTempServiceList([...tempServiceList, id]);
    }
  }

  useEffect(() => {
    setTempServiceList([...serviceList]);
  }, []);

  return (
    <Wrapper onClick={(e: Event) => e.stopPropagation()}>
      <EditPanelTitle>
        <EditPanelTitleText>
          Personal service edit
        </EditPanelTitleText>
        <EditPanelTitleUnderLine />
      </EditPanelTitle>
      <ServiceContainer>
        {personalServiceList && personalServiceList.map((service) => {
          return (
            <ServiceItem
              key={service.name.english}
              index={tempServiceList.indexOf(service.id)}
              onClick={() => toggleListItem(service.id)}
            >
              <IndexBox index={tempServiceList.indexOf(service.id)}>{tempServiceList.indexOf(service.id) + 1}</IndexBox>
              <ServiceIcon src={service.imgUrl.color}></ServiceIcon>
              <ServiceTitle>{service.name.english}</ServiceTitle>
            </ServiceItem>
          );
        })}
      </ServiceContainer>
      <ButtonContainer>
        <PanelButton name="Done" width={80} onClick={saveServiceList}></PanelButton>
        <PanelButton name="Cancel" width={80} onClick={cancelProcess}></PanelButton>
      </ButtonContainer>
    </Wrapper>
  );
};