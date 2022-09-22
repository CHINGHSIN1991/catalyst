import React from 'react';
import styled from "styled-components";

const InputLabel = styled.label`
  font-family: 'Noto Sans', 'Microsoft JhengHei';
  /* border: solid 1px; */
  color: rgb(96,96,96);
  font-size: 0.875rem;
  line-height: 28px;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 76px;
`;

const StyledInput = styled.input`
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
    ${InputLabel} {
      color: black;
      font-weight: bold;
    }
  }
`;

export const InputComponent: React.FC<{ name: string; value: string, title: string; onChange: (e) => void; }> = (props) => {
  return (
    <InputLabel htmlFor={props.name}>{props.title}
      <StyledInput id={props.name} name={props.name} value={props.value} onChange={props.onChange} type="text" />
    </InputLabel>
  );
};

const ButtonContainer = styled.div`
  font-family: 'Noto Sans', 'Microsoft JhengHei';
  font-size: 0.875rem;
  text-align: center;
  border-radius: 4px;
  line-height: 24px;
  background-color: ${(props: { disabled: boolean; }) => { return props.disabled ? "rgb(240,240,240)" : "rgb(224,224,224)"; }};
  color: ${(props: { disabled: boolean; }) => { return props.disabled ? "rgb(184,184,184)" : "rgb(0,0,0)"; }};
  height: 32px;
  margin: 8px;
  width: 80px;
  padding: 4px 16px;
  cursor: pointer;
  transition: 0.2s;

  :hover {
    background-color: ${(props: { disabled: boolean; }) => { return props.disabled ? "rgb(240,240,240)" : "rgb(120,120,120)"; }};
    color: ${(props: { disabled: boolean; }) => { return props.disabled ? "rgb(184,184,184)" : "rgb(255,255,255)"; }};
  }
`;

export const PanelButton: React.FC<{ name: string; disabled?: boolean; onClick?: () => void; }> = (props) => {
  return (
    <ButtonContainer disabled={props.disabled} onClick={props.onClick}>
      {props.name}
    </ButtonContainer>
  );
};