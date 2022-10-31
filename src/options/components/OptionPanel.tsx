import React from 'react'
import styled from 'styled-components'
import { useState, useEffect } from 'react'

import { languageList } from '../../static/optionList'
import { bol } from '../../static/types'

const Wrapper = styled.div`
  width: 320px;
  padding: 24px 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 1180px) {
    padding: 0 16px;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: auto;
  }
`

const EditPanelTitle = styled.div`
  color: rgba(255, 255, 255, 1);
  width: 100%;
  padding: 16px 0;
`

const EditPanelTitleText = styled.div`
  font-weight: bold;
`

const EditPanelTitleUnderLine = styled.div`
  width: 100%;
  height: 1px;
  margin-top: 8px;
  background-color: grey;
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
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 14px;
`

const PublicOption = styled.div`
  font-size: 14px;
  line-height: 20px;
  width: 50%;
  text-align: center;
  font-weight: ${(props: bol) => {
    return props.bol ? 'bold' : 'normal'
  }};
  color: ${(props: bol) => {
    return props.bol ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.3)'
  }};
  transition: 0.2s;
`

const PublicOptionBg = styled.div`
  position: absolute;
  left: ${(props: bol) => {
    return props.bol ? '4px' : 'calc(50% + 4px)'
  }};
  transition: 0.2s;
  width: calc(50% - 8px);
  height: 20px;
  border-radius: 10px;
  background-color: #fff;
`

const SelectOption = styled.option`
  color: rgba(240, 240, 240, 1);
  height: 240px;
  padding: 4px 8px;
  background-color: rgba(0, 0, 0, 0.8);
`

const LanguageSelect = styled.select`
  appearance: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 100%;
  height: 28px;
  font-weight: bold;
  border: solid 4px rgba(0, 0, 0, 0.3);
  background-color: rgba(255, 255, 255, 1);
  border-radius: 14px;
  padding: 0 16px;
  :focus {
    background-color: rgba(255, 255, 255, 0.5);
    border: solid 4px rgba(0, 0, 0, 0);
    outline: none;
  }
`

export const OptionPanel: React.FC<{}> = () => {
  const [personalization, setPersonalization] = useState({
    isMilitary: true,
    isCelsius: true,
    isMenuShow: true,
    idCalendarColorful: true,
    isPrivateShow: true,
    isDarkMode: true,
    pronounce: 'en-US',
  })

  function handleSettingChanged(key: string) {
    setPersonalization({ ...personalization, [key]: !personalization[key] })
  }

  useEffect(() => {
    chrome.storage.sync.set({ personalization })
  }, [personalization])

  return (
    <Wrapper onClick={(e: Event) => e.stopPropagation()}>
      <EditPanelTitle>
        <EditPanelTitleText>Personalization</EditPanelTitleText>
        <EditPanelTitleUnderLine></EditPanelTitleUnderLine>
      </EditPanelTitle>
      <OptionElement
        title="Clock display"
        truthy="24-hour"
        falsy="12-hour"
        keyName="isMilitary"
        bol={personalization.isMilitary}
        handleSettingChanged={handleSettingChanged}
      ></OptionElement>
      <OptionElement
        title="Temperature"
        truthy="Celsius"
        falsy="Fahrenheit"
        keyName="isCelsius"
        bol={personalization.isCelsius}
        handleSettingChanged={handleSettingChanged}
      ></OptionElement>
      <OptionElement
        title="Side menu default"
        truthy="Show"
        falsy="Hidden"
        keyName="isMenuShow"
        bol={personalization.isMenuShow}
        handleSettingChanged={handleSettingChanged}
      ></OptionElement>
      <OptionElement
        title="Calendar color"
        truthy="Multicolor"
        falsy="Monochrome"
        keyName="idCalendarColorful"
        bol={personalization.idCalendarColorful}
        handleSettingChanged={handleSettingChanged}
      ></OptionElement>
      <OptionElement
        title="Private schedule"
        truthy="Show"
        falsy="Hidden"
        keyName="isPrivateShow"
        bol={personalization.isPrivateShow}
        handleSettingChanged={handleSettingChanged}
      ></OptionElement>
      <OptionElement
        title="Display mode"
        truthy="Dark mode"
        falsy="Light mode"
        keyName="isDarkMode"
        bol={personalization.isDarkMode}
        handleSettingChanged={handleSettingChanged}
      ></OptionElement>
      <InfoContainer>
        <Title>Pronounce tool</Title>
        <LanguageSelect
          value={personalization.pronounce}
          onChange={(e) =>
            setPersonalization({
              ...personalization,
              pronounce: e.target.value,
            })
          }
        >
          {languageList.map((item) => {
            return (
              <SelectOption
                key={item.LangCultureName}
                value={item.LangCultureName}
              >
                {item.DisplayEN}
              </SelectOption>
            )
          })}
        </LanguageSelect>
      </InfoContainer>
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
    <InfoContainer
      onClick={() => {
        props.handleSettingChanged(props.keyName)
      }}
    >
      <Title>{props.title}</Title>
      <PublicOptionSet>
        <PublicOptionBg bol={props.bol}></PublicOptionBg>
        <PublicOption bol={props.bol}>{props.truthy}</PublicOption>
        <PublicOption bol={!props.bol}>{props.falsy}</PublicOption>
      </PublicOptionSet>
    </InfoContainer>
  )
}
