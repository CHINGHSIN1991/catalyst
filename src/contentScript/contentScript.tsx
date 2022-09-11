console.log("contentScript running!");
console.log(window.location.href);

import React from 'react';
import ReactDOM from 'react-dom/client';
import styled from "styled-components";
import { ResetStyle, GlobalStyle } from "../static/globalStyle";
import { useState, useEffect } from "react";

import logo from '../static/CatalystLogo_128.png';

const Wrapper = styled.div`
  position: fixed;
  right: 28px;
  bottom: 16px;
  width: ${(props) => { return props.isOpen ? "240px" : "32px"; }};
  height: ${(props) => { return props.isOpen ? "240px" : "32px"; }};
  border-radius: ${(props) => { return props.isOpen ? "8px 8px 0px 8px" : "50% 50% 0px 50%"; }};
  overflow: hidden;
  background-color: #f5f5f5;  
  color: black;
  z-index: 99999;
  padding: 24px;
  cursor: pointer;
  transition: 0.4s;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Logo = styled.img`
  width: 24px;
  height: 24px;
  object-fit: cover;
`;

const App: React.FC<{}> = () => {
  const [isOpen, setIsOpen] = useState(false);


  return (
    <Wrapper isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
      <ResetStyle />
      <GlobalStyle />
      {!isOpen && <Logo src={logo}></Logo>}
      {isOpen && <button onClick={() => setIsOpen(false)}>x</button>}
      {isOpen && "Hello worldHello worldHello worldHello worldHello worldHello worldHello worldHello world"}
    </Wrapper>
  );
};

const rootElement = document.createElement('div');
document.body.appendChild(rootElement);
const root = ReactDOM.createRoot(rootElement);

root.render(<App />);