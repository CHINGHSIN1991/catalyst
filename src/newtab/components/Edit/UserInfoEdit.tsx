import React from 'react';
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';

import { getEditPanelState, setEditPanel } from '../../features/reducers/editSlice';
import { editShortcut } from '../../features/reducers/shortcutsSlice';
import { getUserInfo, loadUserInfo } from '../../features/reducers/userInfoSlice';
import { EditPanelWrapper, EditPanelTitle, EditPanelTitleText, EditPanelTitleUnderLine } from '../../../static/styleSetting';
import { StyledInput, PanelButton, ButtonContainer } from '../../../static/components';
import { handleInputChange } from '../../../utils/functions';

const Wrapper = styled(EditPanelWrapper)`
  width: 360px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InfoContainer = styled.div`
  padding: 8px 0;
  width: 100%;
  display: flex;
  align-items: flex-start;
  height: 48px;
`;

const Title = styled.div`
  width: 56px;
  color: rgb(96,96,96);
  font-size: 0.875rem;
  line-height: 28px;
`;

const Content = styled.div`
  padding-left: 8px;
  display: flex;
  flex-shrink: 1;
  line-height: 28px;
  word-break: break-all;
`;

const Input = styled.input`
  font-size: 1rem;
  width: calc(100% - 56px);
  height: 28px;
  line-height: 20px;
  border: solid 1px lightgrey;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: rgba(255,255,255,0);
  transition: 0.2s;
  :focus {
    background-color: rgba(255,255,255,0.8);
    border: solid 1px grey;
  }
`;

export const UserInfoEditPanel: React.FC<{}> = () => {
  const userInfo = useSelector(getUserInfo);
  const dispatch = useDispatch();
  const [userName, setUserName] = useState({ name: '' });

  function editUserNameProcess(state: { name: string; }) {
    if (state.name) {
      chrome.storage.sync.set({ userName: state.name }, function () {
        dispatch(loadUserInfo({ ...userInfo, name: userName.name }));
      });
      dispatch(setEditPanel({ name: '' }));
    }
  }

  function cancelProcess() {
    dispatch(setEditPanel({ name: '' }));
  }

  useEffect(() => {
    chrome.storage.sync.get(['userName'], function (res) {
      if ('userName' in res) {
        dispatch(loadUserInfo({ ...userInfo, name: res.userName }));
        setUserName({ name: res.userName });
      } else {
        dispatch(loadUserInfo({ ...userInfo, name: 'New User' }));
        setUserName({ name: 'New User' });
      }
    });
  }, []);

  return (
    <Wrapper onClick={(e: Event) => e.stopPropagation()}>
      <EditPanelTitle>
        <EditPanelTitleText>
          User information
        </EditPanelTitleText>
        <EditPanelTitleUnderLine></EditPanelTitleUnderLine>
      </EditPanelTitle>
      <InfoContainer>
        <Title>Name</Title>
        <Input name="name" title="Name" value={userName.name} onChange={(e) => handleInputChange(e, userName, setUserName)} type="text"></Input>
      </InfoContainer>
      <InfoContainer>
        <Title>Email</Title>
        <Content>{userInfo.email}</Content>
      </InfoContainer>
      <InfoContainer>
        <Title>User id</Title>
        <Content>{userInfo.id}</Content>
      </InfoContainer>
      {/* <InputComponent name="name" title="Name" value={userName.name} onChange={(e) => handleInputChange(e, userName, setUserName)}></InputComponent> */}
      <ButtonContainer>
        <PanelButton name="Save" width={80} disabled={!userName.name} onClick={() => editUserNameProcess(userName)}></PanelButton>
        <PanelButton name="Cancel" width={80} onClick={cancelProcess}></PanelButton>
      </ButtonContainer>
    </Wrapper>
  );
};