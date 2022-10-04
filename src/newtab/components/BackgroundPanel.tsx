import React, { useEffect, useRef } from 'react';
import styled from "styled-components";
import { useDispatch, useSelector } from 'react-redux';

import { loadBackgrounds, getBackgrounds, changeBackgroundRandomly } from './../features/reducers/backgroundSlice';

import { getBackgroundImg } from '../../utils/api';


const BackgroundContainer = styled.div`
width: 100%;
height: 100%;
`;

const BackgroundImage = styled.div`
position: absolute;
left: 0px;
top: 0px;
width: 100%;
height: 100%;
background-image: url(${(props) => { return props.url; }});
opacity: ${(props) => { return props.current === props.index ? 1 : 0; }};
transition: 1.5s;
background-position: center;
background-size: cover;
display: flex;
flex-direction: column;
align-items: center;
justify-content: flex-start;
`;

const BackgroundInfo = styled.div`
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
text-shadow: 0 0 8px ${props => props.theme.inversePrimary},  0 0 8px ${props => props.theme.primaryOpacity};
`;

const Photographer = styled.a`
padding: 0 8px;
color: ${props => props.theme.primary};
font-size: 12px;
font-weight: bold;
cursor: pointer;
`;


const DownloadIcon = styled.a`
display: flex;
color: ${props => props.theme.primary};
align-items: center;
justify-content: center;
width: 20px;
height: 20px;
cursor: pointer;
`;

export const BackgroundComponent: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const backgroundSetting = useSelector(getBackgrounds);
  const timeIntervalId = useRef(null);

  function processBackgroundData(data) {
    let tempBackgrounds = [];
    data.forEach((item) => {
      tempBackgrounds.push(
        {
          id: item.id,
          url: item.urls.full,
          smallUrl: item.urls.small_s3,
          user: item.user.name,
          profile: item.user.links.html,
          downloadLink: item.links.download,
        });
    });
    return tempBackgrounds;
  }

  useEffect(() => {
    const ct = new Date();
    const today = `${ct.getFullYear()}-${ct.getMonth() + 1}-${ct.getDate()}`;

    chrome.storage.local.get(['backgroundSetting'], (res) => {
      if (res.backgroundSetting) {
        if (res.backgroundSetting.lastUpdate !== today) {
          getBackgroundImg("nature").then((images) => {
            let newBackgroundList = [...res.backgroundSetting.backgroundList];
            newBackgroundList[0] = processBackgroundData(images);
            const tempBackgrounds = {
              ...res.backgroundSetting,
              lastUpdate: today,
              backgroundList: newBackgroundList
            };
            dispatch(loadBackgrounds(tempBackgrounds));
          });
        } else {
          dispatch(loadBackgrounds(res.backgroundSetting));
        }
      } else {
        getBackgroundImg("nature").then((res) => {
          const tempBackgrounds = {
            lastUpdate: today,
            current: {
              setting: 0,
              slice: 0,
            },
            backgroundList: [processBackgroundData(res), [], [], [], [], []]
          };
          dispatch(loadBackgrounds(tempBackgrounds));
        });
      }
    });

    timeIntervalId.current = setInterval(() => {
      dispatch(changeBackgroundRandomly());
    }, 30000);
  }, []);

  useEffect(() => {
    chrome.storage.local.set({ backgroundSetting: backgroundSetting });
  }, [backgroundSetting]);

  return (
    <BackgroundContainer>
      {backgroundSetting.backgroundList[backgroundSetting.current.setting].map((item, index) => {
        return (<BackgroundImage key={item.id + index} url={item.url} index={index} current={backgroundSetting.current.slice}></BackgroundImage>);
      })}
    </BackgroundContainer>
  );
};

export const PhotographerInfo: React.FC<{}> = () => {
  const backgroundSetting = useSelector(getBackgrounds);

  return (
    <BackgroundInfo>
      Photo by
      <Photographer href={backgroundSetting.backgroundList[backgroundSetting.current.setting][backgroundSetting.current.slice].profile} target="_blank">
        {backgroundSetting.backgroundList[backgroundSetting.current.setting][backgroundSetting.current.slice].user}
      </Photographer>
      on
      <Photographer href='https://unsplash.com/' target="_blank">{' Unsplash '}</Photographer>
      <DownloadIcon href={backgroundSetting.backgroundList[backgroundSetting.current.setting][backgroundSetting.current.slice].downloadLink} target="_blank">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-link" viewBox="0 0 16 16">
          <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z" />
          <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z" />
        </svg>
      </DownloadIcon>
    </BackgroundInfo>
  );
};