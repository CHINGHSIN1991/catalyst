import React from 'react'
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { setEditPanel } from '../../features/reducers/editSlice'
import {
  getPersonalization,
  loadPersonalization,
} from '../../features/reducers/optionsSlice'

import {
  EditPanelWrapper,
  EditPanelTitle,
  EditPanelTitleText,
  EditPanelTitleUnderLine,
} from '../../../static/styleSetting'
import { PanelButton, ButtonContainer } from '../../../static/components'

type bol = { bol: boolean }

const Wrapper = styled(EditPanelWrapper)`
  width: 320px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Title = styled.div`
  width: 100%;
  padding-left: 4px;
  color: rgb(160, 160, 160);
  font-size: 0.875rem;
  line-height: 20px;
`

const PublicOptionSet = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 100%;
  height: 28px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 14px;
`

const PublicOption = styled.div<bol>`
  font-size: 14px;
  line-height: 20px;
  width: 50%;
  text-align: center;
  font-weight: ${(props) => (props.bol ? 'bold' : 'normal')};
  color: ${(props) => (props.bol ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.3)')};
  transition: 0.2s;
`

const PublicOptionBg = styled.div<bol>`
  position: absolute;
  left: ${(props) => (props.bol ? '4px' : 'calc(50% + 4px)')};
  transition: 0.2s;
  width: calc(50% - 8px);
  height: 20px;
  border-radius: 10px;
  background-color: #fff;
`

const InfoContainer = styled.div`
  padding: 8px 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  height: 64px;
`

export const MenuOptionPanel: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const personalization = useSelector(getPersonalization)
  const [tempPersonalization, setTempPersonalization] = useState({
    isMilitary: true,
    isCelsius: true,
    isMenuShow: true,
    idCalendarColorful: true,
    isPrivateShow: true,
    isDarkMode: true,
    pronounce: 'en-US',
  })

  function handleSettingChanged(key: string) {
    setTempPersonalization({
      ...tempPersonalization,
      [key]: !tempPersonalization[key],
    })
  }

  function saveOption() {
    chrome.storage.sync.set({ personalization: tempPersonalization }, () => {
      dispatch(loadPersonalization(tempPersonalization))
      dispatch(setEditPanel({ name: '', data: '' }))
    })
  }

  useEffect(() => {
    setTempPersonalization(personalization)
  }, [])

  return (
    <Wrapper onClick={(e) => e.stopPropagation()}>
      <EditPanelTitle>
        <EditPanelTitleText>Menu setting</EditPanelTitleText>
        <EditPanelTitleUnderLine></EditPanelTitleUnderLine>
      </EditPanelTitle>
      <OptionElement
        title="Clock display"
        truthy="24-hour"
        falsy="12-hour"
        keyName="isMilitary"
        bol={tempPersonalization.isMilitary}
        handleSettingChanged={handleSettingChanged}
      ></OptionElement>
      <OptionElement
        title="Temperature"
        truthy="Celsius"
        falsy="Fahrenheit"
        keyName="isCelsius"
        bol={tempPersonalization.isCelsius}
        handleSettingChanged={handleSettingChanged}
      ></OptionElement>
      <OptionElement
        title="Side menu default"
        truthy="Show"
        falsy="Hidden"
        keyName="isMenuShow"
        bol={tempPersonalization.isMenuShow}
        handleSettingChanged={handleSettingChanged}
      ></OptionElement>
      <OptionElement
        title="Calendar color"
        truthy="Multicolor"
        falsy="Monochrome"
        keyName="idCalendarColorful"
        bol={tempPersonalization.idCalendarColorful}
        handleSettingChanged={handleSettingChanged}
      ></OptionElement>
      <OptionElement
        title="Private schedule"
        truthy="Show"
        falsy="Hidden"
        keyName="isPrivateShow"
        bol={tempPersonalization.isPrivateShow}
        handleSettingChanged={handleSettingChanged}
      ></OptionElement>
      <ButtonContainer>
        <PanelButton name="Save" width={80} onClick={saveOption}></PanelButton>
        <PanelButton
          name="Cancel"
          width={80}
          onClick={() => {
            dispatch(setEditPanel({ name: '' }))
          }}
        ></PanelButton>
      </ButtonContainer>
    </Wrapper>
  )
}

const OptionElement: React.FC<{
  title: string
  truthy: string
  falsy: string
  bol: boolean
  keyName: string
  handleSettingChanged: (key: string) => void
}> = (props) => {
  return (
    <InfoContainer onClick={() => props.handleSettingChanged(props.keyName)}>
      <Title>{props.title}</Title>
      <PublicOptionSet>
        <PublicOptionBg bol={props.bol}></PublicOptionBg>
        <PublicOption bol={props.bol}>{props.truthy}</PublicOption>
        <PublicOption bol={!props.bol}>{props.falsy}</PublicOption>
      </PublicOptionSet>
    </InfoContainer>
  )
}
