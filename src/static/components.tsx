import React from 'react'
import styled from 'styled-components'

type disabled = { disabled: boolean }
type width = { width: number }

const InputLabel = styled.label`
  font-family: 'Noto Sans', 'Microsoft JhengHei';
  color: rgb(96, 96, 96);
  font-size: 0.875rem;
  line-height: 28px;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 76px;
`

export const StyledInput = styled.input`
  font-size: 1rem;
  height: 32px;
  line-height: 32px;
  border: solid 0.5px grey;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0);
  transition: 0.2s;
  :focus {
    background-color: rgba(255, 255, 255, 0.8);
    border: solid 0.5px grey;
    ${InputLabel} {
      color: black;
      font-weight: bold;
    }
  }
`

export const InputComponent: React.FC<{
  name: string
  value: string
  title: string
  onChange: (e) => void
}> = (props) => {
  return (
    <InputLabel htmlFor={props.name}>
      {props.title}
      <StyledInput
        id={props.name}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        type="text"
      />
    </InputLabel>
  )
}

export const ButtonContainer = styled.div`
  width: 100%;
  padding-top: 16px;
  display: flex;
  justify-content: center;
`

const PanelBtn = styled.div<width & disabled>`
  white-space: nowrap;
  cursor: pointer;
  box-sizing: border-box;
  padding: 0 16px;
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
  line-height: 24px;
  height: 28px;
  width: ${(props) => `${props.width}px`};
  border-radius: 4px;
  margin: 8px;
  color: ${(props) =>
    props.disabled ? 'rgba(184,184,184,1)' : 'rgb(80,80,80,1)'};
  background-color: ${(props) =>
    props.disabled ? 'rgba(240,240,240,1)' : 'rgba(80,80,80,0)'};
  border: solid 2px
    ${(props) => (props.disabled ? 'rgba(184,184,184,1)' : 'rgba(80,80,80,1)')};
  transition: 0.1s;
  :hover {
    color: ${(props) =>
      props.disabled ? 'rgba(184,184,184,1)' : 'rgb(255,255,255,1)'};
    background-color: ${(props) =>
      props.disabled ? 'rgba(240,240,240,1)' : 'rgba(80,80,80,1)'};
  }
`

const AlertBtn = styled.div<width & disabled>`
  white-space: nowrap;
  cursor: pointer;
  box-sizing: border-box;
  padding: 0 16px;
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
  line-height: 24px;
  height: 28px;
  width: ${(props) => `${props.width}px`};
  border-radius: 4px;
  margin: 8px;
  color: ${(props) =>
    props.disabled ? 'rgba(180, 180, 180,1)' : 'rgb(204, 109, 102,1)'};
  background-color: ${(props) =>
    props.disabled ? 'rgba(240,240,240,1)' : 'rgba(204, 109, 102,0)'};
  border: solid 2px
    ${(props) =>
      props.disabled ? 'rgba(180, 180, 180,1)' : 'rgba(204, 109, 102,1)'};
  transition: 0.1s;
  :hover {
    color: ${(props) =>
      props.disabled ? 'rgba(180, 180, 180,1)' : 'rgb(255,255,255,1)'};
    background-color: ${(props) =>
      props.disabled ? 'rgba(240,240,240,1)' : 'rgba(204, 109, 102,1)'};
  }
`

export const PanelButton: React.FC<{
  name: string
  disabled?: boolean
  onClick?: () => void
  width: number
}> = (props) => {
  return (
    <PanelBtn
      disabled={props.disabled}
      onClick={props.onClick}
      width={props.width}
    >
      {props.name}
    </PanelBtn>
  )
}

export const AlertButton: React.FC<{
  name: string
  disabled?: boolean
  onClick?: () => void
  width: number
}> = (props) => {
  return (
    <AlertBtn
      disabled={props.disabled}
      onClick={props.onClick}
      width={props.width}
    >
      {props.name}
    </AlertBtn>
  )
}
