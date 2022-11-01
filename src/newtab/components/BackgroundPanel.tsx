import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'

import {
  loadBackgrounds,
  getBackgrounds,
  changeBackgroundRandomly,
} from './../features/reducers/backgroundSlice'

import { getBackgroundImg } from '../../utils/api'
import { scheme, unsplashData, currentComparison } from '../../static/types'

type url = { url: string }

const BackgroundContainer = styled.div`
  width: 100%;
  height: 100%;
`

const BackgroundImage = styled.div<url & currentComparison>`
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.url});
  opacity: ${(props) => (props.current === props.index ? 1 : 0)};
  transition: 1.5s;
  background-position: center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`

const BackgroundInfo = styled.div<scheme>`
  position: absolute;
  display: flex;
  font-weight: bold;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-top: 8px;
  top: 0px;
  width: 100%;
  height: 32px;
  z-index: 5;
  text-shadow: 0 0 8px ${(props) => props.theme.inversePrimary},
    0 0 8px ${(props) => props.theme.primaryOpacity};
`

const Photographer = styled.a<scheme>`
  padding: 0 8px;
  color: ${(props) => props.theme.primary};
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
`

const DownloadIcon = styled.a<scheme>`
  display: flex;
  color: ${(props) => props.theme.primary};
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  cursor: pointer;
`

const BackgroundComponent: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const backgroundSetting = useSelector(getBackgrounds)
  const timeIntervalId = useRef(null)

  function processBackgroundData(data: unsplashData[]) {
    let tempBackgrounds = []
    data.forEach((item: unsplashData) => {
      tempBackgrounds.push({
        id: item.id,
        url: item.urls.full,
        smallUrl: item.urls.small_s3,
        user: item.user.name,
        profile: item.user.links.html,
        downloadLink: item.links.download_location,
      })
    })
    console.log(tempBackgrounds)
    return tempBackgrounds
  }

  useEffect(() => {
    const ct = new Date()
    const today = `${ct.getFullYear()}-${ct.getMonth() + 1}-${ct.getDate()}`

    chrome.storage.sync.get(
      ['bgSetting', 'bgSet0', 'bgSet1', 'bgSet2', 'bgSet3', 'bgSet4', 'bgSet5'],
      (res) => {
        if (
          res.bgSetting &&
          res.bgSet0 &&
          res.bgSet1 &&
          res.bgSet2 &&
          res.bgSet3 &&
          res.bgSet4 &&
          res.bgSet5
        ) {
          if (res.bgSetting.lastUpdate !== today) {
            getBackgroundImg('nature').then((images) => {
              const tempBgSetting = {
                bgSetting: { ...res.bgSetting, lastUpdate: today },
                backgroundList: [
                  processBackgroundData(images),
                  res.bgSet1,
                  res.bgSet2,
                  res.bgSet3,
                  res.bgSet4,
                  res.bgSet5,
                ],
              }
              dispatch(loadBackgrounds(tempBgSetting))
            })
          } else {
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
            dispatch(loadBackgrounds(tempBgSetting))
          }
        } else {
          getBackgroundImg('nature').then((images) => {
            const tempBgSetting = {
              bgSetting: {
                lastUpdate: today,
                current: {
                  setting: 0,
                  slice: 0,
                },
              },
              backgroundList: [
                processBackgroundData(images),
                [],
                [],
                [],
                [],
                [],
              ],
            }
            dispatch(loadBackgrounds(tempBgSetting))
          })
        }
      }
    )

    timeIntervalId.current = setInterval(() => {
      dispatch(changeBackgroundRandomly())
    }, 30000)
  }, [])

  useEffect(() => {
    chrome.storage.sync.set({
      bgSetting: backgroundSetting.bgSetting,
      bgSet0: backgroundSetting.backgroundList[0],
      bgSet1: backgroundSetting.backgroundList[1],
      bgSet2: backgroundSetting.backgroundList[2],
      bgSet3: backgroundSetting.backgroundList[3],
      bgSet4: backgroundSetting.backgroundList[4],
      bgSet5: backgroundSetting.backgroundList[5],
    })
  }, [backgroundSetting])

  return (
    <BackgroundContainer>
      {backgroundSetting.backgroundList[
        backgroundSetting.bgSetting.current.setting
      ].map((item, index) => {
        return (
          <BackgroundImage
            key={item.id + index}
            url={item.url}
            index={index}
            current={backgroundSetting.bgSetting.current.slice}
          ></BackgroundImage>
        )
      })}
    </BackgroundContainer>
  )
}

const PhotographerInfo: React.FC<{}> = () => {
  const backgroundSetting = useSelector(getBackgrounds)

  return (
    <BackgroundInfo>
      Photo by
      <Photographer
        href={
          backgroundSetting.backgroundList[
            backgroundSetting.bgSetting.current.setting
          ][backgroundSetting.bgSetting.current.slice].profile
        }
        target="_blank"
      >
        {
          backgroundSetting.backgroundList[
            backgroundSetting.bgSetting.current.setting
          ][backgroundSetting.bgSetting.current.slice].user
        }
      </Photographer>
      on
      <Photographer href="https://unsplash.com/" target="_blank">
        Unsplash
      </Photographer>
      <DownloadIcon
        href={
          backgroundSetting.backgroundList[
            backgroundSetting.bgSetting.current.setting
          ][backgroundSetting.bgSetting.current.slice].downloadLink
        }
        target="_blank"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-link"
          viewBox="0 0 16 16"
        >
          <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z" />
          <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z" />
        </svg>
      </DownloadIcon>
    </BackgroundInfo>
  )
}

export const MemoizedBackgroundComponent = React.memo(BackgroundComponent)
export const MemoizedPhotographerInfo = React.memo(PhotographerInfo)
