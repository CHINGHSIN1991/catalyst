import React from 'react';
import ReactDOM from 'react-dom/client'
import styled from "styled-components";

const Img = styled.img`
  width: 400px;
  height: 400px;
`

// const test = <img src="tempLogo.png" alt="" />

const rootElement = document.createElement('div');
document.body.appendChild(rootElement);
const root = ReactDOM.createRoot(rootElement);

root.render(<Img src={"tempLogo.png"}></Img>)