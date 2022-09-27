import React from 'react';
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";

const Wrapper = styled.div`
  color: white;
  position: absolute;
  bottom: 40px;
  font-family: 'Noto Sans', 'Trebuchet MS', 'Microsoft JhengHei';
  /* border: solid 1px; */
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ToggleTitle = styled.div`
  /* border: solid 1px; */
  opacity: 0;
  transform: translateY(30px);
  position: absolute;
  text-align: center;
  text-shadow: 0 0 5px rgba(0, 0, 0, 1),  0 0 20px rgba(0, 0, 0, 0.5);
  width: 180px;
  transition: 0.2s;
`;

const ToggleButton = styled.div`
  width: 48px;
  height: 48px;
  margin: 0 24px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* border: solid 1px; */
  cursor: pointer;
  box-shadow: 0px 5px 5px rgba(0,0,0,0.4);
  border: solid 0.5px rgba(120,120,120,0.4);
  background-color: rgba(0,0,0,0.4);
  backdrop-filter: blur(16px);
  :hover{
    ${ToggleTitle} {
      opacity: 1;
      transform: translateY(40px);
    }
  }
`;



export const BulletinTogglePanel: React.FC<{
  setIsBoardOn: (boo: boolean) => void;
  sortByCreateTime: () => void;
  sortByColor: () => void;
  clearAll: () => void;
}> = (props) => {

  return (
    <Wrapper>
      <ToggleButton onClick={props.sortByColor}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-palette" viewBox="0 0 16 16">
          <path d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
          <path d="M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8zm-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.148.904.083.991.024C14.717 9.38 15 9.161 15 8a7 7 0 1 0-7 7z" />
        </svg>
        <ToggleTitle>Sort by color</ToggleTitle>
      </ToggleButton>
      <ToggleButton onClick={props.sortByCreateTime}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-clock" viewBox="0 0 16 16">
          <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
        </svg>
        <ToggleTitle>Sort by created time</ToggleTitle>
      </ToggleButton>
      <ToggleButton onClick={props.clearAll}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
          <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
        </svg>
        <ToggleTitle>Clear all</ToggleTitle>
      </ToggleButton>
      <ToggleButton onClick={() => props.setIsBoardOn(false)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-layout-three-columns" viewBox="0 0 16 16">
          <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0h13A1.5 1.5 0 0 1 16 1.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13zM1.5 1a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 .5.5H5V1H1.5zM10 15V1H6v14h4zm1 0h3.5a.5.5 0 0 0 .5-.5v-13a.5.5 0 0 0-.5-.5H11v14z" />
        </svg>
        <ToggleTitle>Back to main board</ToggleTitle>
      </ToggleButton>
    </Wrapper>
  );
};