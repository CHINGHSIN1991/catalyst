import React from 'react'
import styled from 'styled-components'
import { useState, useEffect, useRef } from 'react'

import { optionSetting, bol } from '../../static/types'

const PageToolContainer = styled.div`
  font-family: 'Noto Sans', 'Trebuchet MS', 'Microsoft JhengHei';
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 8px;
  width: 100%;
`

const Title = styled.div`
  display: flex;
  flex-shrink: 1;
  color: rgb(100, 100, 100);
  font-weight: bold;
`

const PublicOptionSet = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 120px;
  height: 24px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
`

const PublicOption = styled.div`
  font-size: 14px;
  line-height: 18px;
  font-size: 12px;
  width: 50%;
  text-align: center;
  font-weight: ${(props: bol) => (props.bol ? 'bold' : 'normal')};
  color: ${(props: bol) => (props.bol ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.3)')};
  transition: 0.2s;
`

const PublicOptionBg = styled.div`
  position: absolute;
  left: ${(props: bol) => (props.bol ? '4px' : 'calc(50% + 4px)')};
  transition: 0.2s;
  width: calc(50% - 8px);
  height: 18px;
  border-radius: 9px;
  background-color: #fff;
`

export const PageToolPanel: React.FC<{}> = () => {
  const [personalization, setPersonalization] = useState<optionSetting>(null)

  function updateIsShow() {
    const tempPersonalization = {
      ...personalization,
      isPageToolShow: !personalization.isPageToolShow,
    }
    setPersonalization(tempPersonalization)
  }

  useEffect(() => {
    chrome.storage.sync.get(['personalization'], (res) => {
      if (res.personalization) {
        setPersonalization(res.personalization)
      } else {
        const tempPersonalization = {
          isMilitary: true,
          isCelsius: true,
          isMenuShow: true,
          idCalendarColorful: true,
          isPrivateShow: true,
          isDarkMode: true,
          isPageToolShow: true,
          pronounce: 'zh-TW',
        }
        setPersonalization(tempPersonalization)
      }
    })
  }, [])

  useEffect(() => {
    chrome.storage.sync.set({ personalization })
  }, [personalization])

  return (
    <PageToolContainer>
      <Title>Page tool</Title>
      <PublicOptionSet onClick={updateIsShow}>
        <PublicOptionBg
          bol={personalization ? personalization.isPageToolShow : true}
        ></PublicOptionBg>
        <PublicOption
          bol={personalization ? personalization.isPageToolShow : true}
        >
          Show
        </PublicOption>
        <PublicOption
          bol={!(personalization ? personalization.isPageToolShow : true)}
        >
          Hidden
        </PublicOption>
      </PublicOptionSet>
    </PageToolContainer>
  )
}
