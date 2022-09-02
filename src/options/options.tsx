import React from 'react';
import ReactDOM from 'react-dom/client'
import styled from "styled-components";
import { ResetStyle, GlobalStyle } from "../static/globalStyle"

const Wrapper = styled.div`
  width: 400px;
  height: 300px;
  border: solid 1px;
`

const Img = styled.img`
  width: 200px;
  height: 200px;
`

const App: React.FC<{}> = () => {
  return (
    <Wrapper>
      <ResetStyle />
      <GlobalStyle />
      <Img src={"tempLogo.png"}></Img>
    </Wrapper>
  )
}

const rootElement = document.createElement('div');
document.body.appendChild(rootElement);
const root = ReactDOM.createRoot(rootElement);

root.render(<App />)
