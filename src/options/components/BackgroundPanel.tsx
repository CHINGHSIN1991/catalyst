import React from 'react'
import styled from 'styled-components'
import { useState, useEffect } from 'react'

import {
  background,
  backgroundSetting,
  currentComparison,
  appliedComparison,
} from '../../static/types'
import { ScrollbarContainer } from '../../static/styleSetting'
import { deepCopy } from '../../utils/functions'

type bg = { bg: string }

const Wrapper = styled.div`
  width: 100%;
  padding: 24px 0 0;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 1180px) {
    padding: 16px 0 0;
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

const BackgroundContainer = styled(ScrollbarContainer)`
  padding: 16px;
  background-color: lightgray;
  border-radius: 0px 8px 8px 8px;
  min-height: 416px;
  height: auto;
  max-height: 600px;
  width: calc(100% - 120px);
  display: flex;
  align-items: flex-start;
  justify-content: start;
  align-content: flex-start;
  flex-wrap: wrap;
  @media (max-width: 1580px) {
    min-height: 480px;
  }
  @media (max-width: 768px) {
    width: calc(100% - 100px);
  }
`

const BackgroundListPanel = styled.div`
  width: 120px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  @media (max-width: 768px) {
    width: 100px;
  }
`

const BackgroundListOption = styled.div`
  cursor: pointer;
  border-radius: 8px 0px 0px 8px;
  display: flex;
  flex-direction: column;
  margin-bottom: 3px;
  line-height: 24px;
  width: ${(props: currentComparison) =>
    props.index === props.current ? '120px' : '104px'};
  height: 60px;
  background-color: ${(props: currentComparison) =>
    props.index === props.current ? 'lightgray' : 'gray'};
  transition: 0.2s;
  :hover {
    background-color: ${(props: currentComparison) =>
      props.index === props.current ? 'lightgray' : 'darkgray'};
  }
  :last-child {
    margin-bottom: 0px;
  }

  @media (max-width: 768px) {
    width: ${(props: currentComparison) =>
      props.index === props.current ? '90px' : '80px'};
  }
`

const BackgroundListOptionTitle = styled.div`
  padding: 4px 0 0 16px;
  font-size: 0.875rem;
  font-weight: bold;
  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: 4px 0 0 8px;
  }
`

const BackgroundImage = styled.div`
  cursor: pointer;
  border: solid 1px gray;
  border-radius: 4px;
  margin: 8px;
  width: 152px;
  height: 96px;
  background-image: url(${(props: bg) => props.bg});
  background-position: center;
  background-size: cover;
  overflow: hidden;
  @media (max-width: 1180px) {
    width: 120px;
    height: 80px;
  }
`

const AddToCollectionOptionList = styled.div`
  padding-top: 8px;
  width: 100%;
  display: flex;
  justify-content: center;
  opacity: 0;
  transform: translateY(4px);
  transition: 0.1s;
  transition-delay: 0.1s;
`

const AddToCollectionOption = styled.div`
  font-size: 12px;
  width: 16px;
  height: 16px;
  margin: 0 2px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.6);
  line-height: 16px;
  text-align: center;
  :hover {
    background-color: rgba(255, 255, 255, 0.9);
  }
`

const DeleteBtn = styled.div`
  margin-top: 8px;
  font-size: 12px;
  height: 16px;
  line-height: 12px;
  border-radius: 4px;
  padding: 2px 4px;
  background-color: rgba(255, 255, 255, 0.6);
  opacity: 0;
  transform: translateY(4px);
  transition: 0.1s;
  transition-delay: 0.2s;
  :hover {
    background-color: rgba(255, 255, 255, 0.9);
  }
`

const AddToCollectionTitle = styled.div`
  width: 100%;
  color: rgba(255, 255, 255, 1);
  font-size: 12px;
  text-align: center;
  opacity: 0;
  transform: translateY(4px);
  transition: 0.1s;
`

const AddToCollectionPanel = styled.div`
  position: absolute;
  left: 0px;
  top: 0px;
  background-color: rgba(0, 0, 0, 0);
  transition: 0.2s;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 8px;
  :hover {
    background-color: rgba(0, 0, 0, 0.7);
    ${AddToCollectionTitle} {
      opacity: 1;
      transform: translateY(0px);
    }
    ${AddToCollectionOptionList} {
      opacity: 1;
      transform: translateY(0px);
    }
    ${DeleteBtn} {
      opacity: 1;
      transform: translateY(0px);
    }
  }
`
const Title = styled.div`
  width: 100%;
  padding-top: 8px;
  padding-left: 120px;
  color: rgb(160, 160, 160);
  font-size: 0.875rem;
  line-height: 20px;
  @media (max-width: 768px) {
    padding-left: 100px;
  }
`

const BackgroundPanel = styled.div`
  margin-top: 0px;
  display: flex;
  width: 100%;
  height: auto;
`

const ApplyButton = styled.div`
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  line-height: 20px;
  width: ${(props: appliedComparison) =>
    props.applied === props.index ? '72px' : '56px'};
  margin: 2px 0 8px 16px;
  text-align: center;
  color: ${(props: appliedComparison) =>
    props.applied === props.index ? 'rgb(80,80,80)' : 'rgb(80,80,80)'};
  background-color: ${(props: appliedComparison) =>
    props.applied === props.index ? 'rgb(173, 255, 218)' : 'rgb(184,184,184)'};
  white-space: nowrap;
  overflow: hidden;
  transition: 0.2s;
  /* padding: 4px 0 0 16px; */
  :hover {
    background-color: ${(props: appliedComparison) =>
      props.applied === props.index ? 'rgb(173, 255, 218)' : 'rgb(40,40,40)'};
    color: ${(props: appliedComparison) =>
      props.applied === props.index ? 'rgb(80,80,80)' : 'rgb(240,240,240)'};
  }
  @media (max-width: 768px) {
    margin: 2px 0 8px 8px;
  }
`

export const BackgroundEditPanel: React.FC<{}> = () => {
  const [tempBackgroundSetting, setTempBackgroundSetting] =
    useState<backgroundSetting>(null)
  const [current, setCurrentSet] = useState(0)
  const [isCollectionFull, setIsCollectionFull] = useState(0)

  function addImgToCollection(image: background, collection: number) {
    let temp = deepCopy(tempBackgroundSetting)
    if (
      !temp.backgroundList[collection].find(
        (item: background) => item.id === image.id
      )
    ) {
      if (temp.backgroundList[collection].length >= 12) {
        setIsCollectionFull(collection)
      } else {
        temp.backgroundList[collection].push(image)
        setTempBackgroundSetting(temp)
        setIsCollectionFull(0)
      }
    }
  }

  function delImgInCollection(image: background, collection: number) {
    let temp = JSON.parse(JSON.stringify(tempBackgroundSetting))
    temp.backgroundList[collection] = temp.backgroundList[collection].filter(
      (item: background) => item.id !== image.id
    )
    setTempBackgroundSetting(temp)
  }

  function applyCollection(index: number) {
    if (tempBackgroundSetting.backgroundList[index].length > 0) {
      setTempBackgroundSetting({
        ...tempBackgroundSetting,
        bgSetting: {
          ...tempBackgroundSetting.bgSetting,
          current: { setting: index, slice: 0 },
        },
      })
    }
  }

  useEffect(() => {
    chrome.storage.sync.get(
      ['bgSetting', 'bgSet0', 'bgSet1', 'bgSet2', 'bgSet3', 'bgSet4', 'bgSet5'],
      (res) => {
        const tempBgSetting = {
          bgSetting: res.bgSetting,
          backgroundList: [
            res.bgSet0,
            res.bgSet1,
            res.bgSet2,
            res.bgSet3,
            res.bgSet4,
            res.bgSet5,
          ],
        }
        setTempBackgroundSetting(tempBgSetting)
      }
    )
  }, [])

  useEffect(() => {
    tempBackgroundSetting &&
      chrome.storage.sync.set({
        bgSetting: tempBackgroundSetting.bgSetting,
        bgSet0: tempBackgroundSetting.backgroundList[0],
        bgSet1: tempBackgroundSetting.backgroundList[1],
        bgSet2: tempBackgroundSetting.backgroundList[2],
        bgSet3: tempBackgroundSetting.backgroundList[3],
        bgSet4: tempBackgroundSetting.backgroundList[4],
        bgSet5: tempBackgroundSetting.backgroundList[5],
      })
  }, [tempBackgroundSetting])

  return (
    <Wrapper onClick={(e: Event) => e.stopPropagation()}>
      <EditPanelTitle>
        <EditPanelTitleText>Background setting</EditPanelTitleText>
        <EditPanelTitleUnderLine></EditPanelTitleUnderLine>
      </EditPanelTitle>
      <Title>
        {isCollectionFull === 0 &&
          (current === 0
            ? 'Get 10 random images everyday'
            : `You can add images from other collections ( max 12 images )`)}
        {isCollectionFull !== 0 && (
          <span style={{ color: 'pink' }}>
            Collection {isCollectionFull} has reached the limit
          </span>
        )}
      </Title>
      <BackgroundPanel>
        <BackgroundListPanel>
          {tempBackgroundSetting &&
            [0, 1, 2, 3, 4, 5].map((number) => {
              return (
                <BackgroundListOption
                  key={'option' + number}
                  current={current}
                  index={number}
                  onClick={() => setCurrentSet(number)}
                  currentApplied={
                    tempBackgroundSetting.bgSetting.current.setting
                  }
                >
                  <BackgroundListOptionTitle>
                    {number === 0 ? 'Random' : `Collection ${number}`}
                  </BackgroundListOptionTitle>
                  {(number ===
                    tempBackgroundSetting.bgSetting.current.setting ||
                    number === current) && (
                    <ApplyButton
                      onClick={() => applyCollection(number)}
                      applied={tempBackgroundSetting.bgSetting.current.setting}
                      index={number}
                      current={current}
                    >
                      {tempBackgroundSetting.bgSetting.current.setting ===
                        number && 'Current'}
                      {tempBackgroundSetting.bgSetting.current.setting !==
                        number &&
                        tempBackgroundSetting.backgroundList[number].length >
                          0 &&
                        'Apply'}
                    </ApplyButton>
                  )}
                </BackgroundListOption>
              )
            })}
        </BackgroundListPanel>
        <BackgroundContainer>
          {tempBackgroundSetting &&
            tempBackgroundSetting.backgroundList[current].map((bg, index) => {
              return (
                <BackgroundImage key={`${bg}+${index}`} bg={bg.smallUrl}>
                  <AddToCollectionPanel>
                    <AddToCollectionTitle>
                      Add to Collection
                    </AddToCollectionTitle>
                    <AddToCollectionOptionList>
                      {[1, 2, 3, 4, 5].map((item) => {
                        return item === current ? (
                          ''
                        ) : (
                          <AddToCollectionOption
                            key={bg.id + item}
                            onClick={() => addImgToCollection(bg, item)}
                          >
                            {item}
                          </AddToCollectionOption>
                        )
                      })}
                    </AddToCollectionOptionList>
                    {current !== 0 && (
                      <DeleteBtn
                        onClick={() => delImgInCollection(bg, current)}
                      >
                        Delete
                      </DeleteBtn>
                    )}
                  </AddToCollectionPanel>
                </BackgroundImage>
              )
            })}
        </BackgroundContainer>
      </BackgroundPanel>
    </Wrapper>
  )
}
