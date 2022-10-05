import React from 'react';
import styled from "styled-components";
import { useState, useEffect } from "react";

import { EditPanelTitleUnderLine } from '../../static/styleSetting';
import { handleInputChange } from '../../utils/functions';


const Wrapper = styled.div`
  width: 360px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width:1180px) {
    width: auto;
    padding: 16px;
  } 
`;

const EditPanelTitle = styled.div`
  width: 100%;
  padding: 16px 0;
  @media (max-width:1180px) {
    padding: 16px 0 8px;
  } 
`;

const EditPanelTitleText = styled.div`
  font-weight: bold;
`;

const InfoContainer = styled.div`
  padding: 8px 0;
  width: 100%;
  display: flex;
  align-items: flex-start;
  height: 48px;
  @media (max-width:1180px) {
    height: 36px;
  } 
`;

const Title = styled.div`
  width: 56px;
  color: rgb(96,96,96);
  font-size: 0.875rem;
  line-height: 28px;
`;

const Content = styled.div`
  height: 28px;
  width: 100%;
  padding-left: 8px;
  display: flex;
  flex-shrink: 1;
  line-height: 28px;
  word-break: break-all;
`;

const EditPanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Input = styled.input`
  font-size: 1rem;
  width: calc(100% - 64px);
  height: 28px;
  line-height: 20px;
  border: solid 1px grey;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: rgba(255,255,255,0.4);
  transition: 0.2s;
  :focus {
    background-color: rgba(255,255,255,0.8);
    outline: none;
    border: solid 1px grey;
  }
`;

const EditBtn = styled.div`
  margin-left: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: rgb(160,160,160);
  transition: 0.2s;
  color: rgba(255,255,255,1);
  :hover {
    background-color: rgb(104,104,104);
  }
`;

export const UserInfoPanel: React.FC<{}> = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    id: '',
  });
  const [userName, setUserName] = useState({ name: '' });
  const [idEditOn, setIsEditOn] = useState(false);

  function editUserNameProcess() {
    if (userName.name) {
      chrome.storage.sync.set({ userName: userName.name }, function () {
        setUserInfo({ ...userInfo, name: userName.name });
        setIsEditOn(false);
      });
    }
  }

  useEffect(() => {
    chrome.identity.getProfileUserInfo(
      (userInfo) => {
        chrome.storage.sync.get(['userName'], function (userName) {
          const tempName = 'userName' in userName ? userName.userName : 'New User';
          setUserInfo({ name: tempName, email: userInfo.email, id: userInfo.id });
          setUserName({ name: tempName });
        });
      }
    );
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
        {!idEditOn && <Content>
          <EditPanel>
            {userInfo.name}
            <EditBtn onClick={() => { setIsEditOn(true); setUserName({ name: userInfo.name }); }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
              </svg>
            </EditBtn>
          </EditPanel>
        </Content>}
        {idEditOn && <EditPanel>
          <Input name="name" title="Name" value={userName.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, userName, setUserName)} type="text"></Input>
          <EditBtn onClick={editUserNameProcess}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check2-square" viewBox="0 0 16 16">
              <path d="M3 14.5A1.5 1.5 0 0 1 1.5 13V3A1.5 1.5 0 0 1 3 1.5h8a.5.5 0 0 1 0 1H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V8a.5.5 0 0 1 1 0v5a1.5 1.5 0 0 1-1.5 1.5H3z" />
              <path d="m8.354 10.354 7-7a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z" />
            </svg>
          </EditBtn>
          <EditBtn onClick={() => { setIsEditOn(false); setUserName({ name: '' }); }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-bar-right" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8zm-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5z" />
            </svg>
          </EditBtn>
        </EditPanel>}
      </InfoContainer>
      <InfoContainer>
        <Title>Email</Title>
        <Content>{userInfo.email}</Content>
      </InfoContainer>
      <InfoContainer>
        <Title>User id</Title>
        <Content>{userInfo.id}</Content>
      </InfoContainer>
    </Wrapper>
  );
};