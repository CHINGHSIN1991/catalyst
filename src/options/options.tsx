import React from 'react';
import ReactDOM from 'react-dom/client';
import styled from "styled-components";

import { ResetStyle, GlobalStyle } from "../static/globalStyle";

import { UserInfoPanel } from './components/UserInfoPanel';
import { OptionPanel } from './components/OptionPanel';
import { BackgroundEditPanel } from './components/BackgroundPanel';

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  height: auto;
  background-color: rgb(80,80,80);
  overflow-y: hidden;
  @media (max-width:1180px) {
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    height: auto;
  }  
`;

const SidePanel = styled.div`
  position: fixed;
  left: 0px;
  top: 0px;
  width: 400px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: 100%;
  padding: 16px;
  background-color: rgb(200,200,200);
  @media (max-width:1180px) {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: start;
    width: 100%;
    min-height: auto;
    height: auto;
  } 
  @media (max-width:768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  } 
`;

const SelectOptionPanel = styled.div`
  width: 360px;
  height: 100vh;
  padding: 104px 16px;
  @media (max-width:1180px) {
    width: 360px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: auto;
  }
`;

const BackgroundPanel = styled.div`
  width: 100%;
  height: 100%;
  padding: 104px 48px 24px 24px;
  @media (max-width:1180px) {
    padding: 0px 36px 24px 0;
  }
  @media (max-width:768px) {
    padding: 0px 36px 24px 16px;
  } 
`;

const BrandContainer = styled.div`
  padding: 24px 24px 0px;
  display: flex;
  width: 100%;
  @media (max-width:1180px) {
    width: 400px;
    align-items: flex-start;
    justify-content: start;
    padding: 36px 24px 0px;
  } 
`;

const OptionPanelContainer = styled.div`  
  margin-left: 400px;
  height: auto;
  min-height: 100vh;
  width: 100%;
  display: flex;
  @media (max-width:1180px) {
    margin-left: 0;
  }
  @media (max-width:768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  } 
`;

const Logo = styled.img`
  width: 64px;
  height: 64px;
`;

const BrandInfo = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding-left: 16px;
`;

const BrandTitle = styled.div`
  letter-spacing: 2px;
  font-size: 2rem;
  font-weight: bold;
`;

const BrandSlogan = styled.div`
  padding-top: 4px;
`;

const App: React.FC<{}> = () => {
  return (
    <Wrapper>
      <ResetStyle />
      <GlobalStyle />
      <SidePanel>
        <BrandContainer>
          <Logo src={"CatalystLogo_128.png"}></Logo>
          <BrandInfo>
            <BrandTitle>CATALYST</BrandTitle>
            <BrandSlogan>Sparks extraordinary results</BrandSlogan>
          </BrandInfo>
        </BrandContainer>
        <UserInfoPanel></UserInfoPanel>
      </SidePanel>
      <OptionPanelContainer>
        <SelectOptionPanel>
          <OptionPanel></OptionPanel>
        </SelectOptionPanel>
        <BackgroundPanel>
          <BackgroundEditPanel></BackgroundEditPanel>
        </BackgroundPanel>
      </OptionPanelContainer>
    </Wrapper>
  );
};


const rootElement = document.createElement('div');
document.body.appendChild(rootElement);
const root = ReactDOM.createRoot(rootElement);

root.render(<App />);
