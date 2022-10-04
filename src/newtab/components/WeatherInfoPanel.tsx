import React from 'react';
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';

import { getPersonalization } from '../features/reducers/optionsSlice';

import { fetchWeatherData } from '../../utils/api';
import { FocusPanelTitle } from '../../static/styleSetting';



const Wrapper = styled.div`
  /* border: solid 1px; */
  font-family: 'Noto Sans', 'Trebuchet MS', 'Microsoft JhengHei';
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  bottom: 104px;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 4px;
  /* border: solid 1px; */
  border: ${props => props.theme.panelBorder};
  background-color: ${props => props.theme.panelBackground};
  backdrop-filter: blur(16px);
  height: ${(props) => props.centralPanel === "Weather" ? "128px" : "0px"};
  width: ${(props) => props.centralPanel === "Weather" ? "480px" : "0px"};
  transition: 0.1s;
  overflow: hidden;
`;

const WeatherInfoContainer = styled.div`
  /* border: solid 1px; */
  display: flex;
  justify-content: flex-start;
  padding: 8px 0 16px 0;
  width: 100%;
  height: 100%;
`;

const MainInfo = styled.div`
  /* border: solid 1px; */
  border-right: solid 1px rgba(255,255,255,0.2);
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  /* width: 40px; */
  padding: 0 24px;
  height: 100%;

  :last-child {
    border: none;
    align-items: flex-start;
  }
`;

const MainDegree = styled.div`
  font-size: 2rem;
`;

const City = styled.div`
  padding-top: 8px;
  font-size: 1rem;
`;

const IconImage = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Info = styled.div`
  display: flex;
  font-size: 0.75rem;
  padding-bottom: 10px;
  :last-child{
    padding-bottom: 0;
  }
`;

const InfoTitle = styled.div`
  width: 64px;
`;

interface openWeatherData {
  coord: {
    lon: number,
    lat: number,
  };
  weather: [
    {
      id: number,
      main: string,
      description: string,
      icon: string,
    }
  ],
  base: string,
  main: {
    temp: number,
    feels_like: number,
    temp_min: number,
    temp_max: number,
    pressure: number,
    humidity: number,
    sea_level: number,
    grnd_level: number;
  },
  visibility: number,
  wind: {
    speed: number,
    deg: number,
    gust: number;
  },
  rain: {
    "1h": number;
  },
  clouds: {
    "all": number;
  },
  dt: number,
  sys: {
    type: number,
    id: number,
    country: string,
    sunrise: number,
    sunset: number;
  },
  timezone: number,
  id: number,
  name: string,
  cod: number;
}

type accuDayWeatherData = {
  HasPrecipitation: boolean,
  Icon: number,
  IconPhrase: string,
  LocalSource: {
    Id: number,
    Number: string,
    WeatherCode: string,
  };
  PrecipitationIntensity: string,
  PrecipitationType: string,
};

type accuTemperature = {
  Value: number,
  Unit: string,
  UnitType: number,
};
type accuTemperatureSet = {
  Maximum: accuTemperature,
  Minimum: accuTemperature,
};

type accuWeatherData = {
  Date: string,
  Day: accuDayWeatherData,
  EpochDate: number,
  Link: string,
  MobileLink: string,
  Night: accuDayWeatherData,
  Sources: string[],
  Temperature: accuTemperatureSet,
};

type accuWeatherHeadline = {
  Category: string,
  EffectiveDate: string,
  EffectiveEpochDate: Date,
  EndDate: string,
  EndEpochDateL: Date,
  Link: string,
  MobileLink: string,
  Severity: number,
  Text: string,
};

interface accuWeatherDataSet {
  DailyForecasts: accuWeatherData[],
  Headline: accuWeatherHeadline,
  updateTime: Date,
}

export const WeatherPanel: React.FC<{ centralPanel: string; }> = (props) => {
  const personalization = useSelector(getPersonalization);
  const [weatherData, setWeatherData] = useState<openWeatherData>(null);

  function getWeatherData(currentTime: number) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      fetchWeatherData(lat, lon).then((res) => {
        const weatherData = { ...res, updateTime: currentTime };
        chrome.storage.local.set({ weatherData }, function () {
          setWeatherData(weatherData);
        });
      }).catch((res) => console.log(res));
    });
  }

  function standerToMetric(stander: number) {
    return (stander - 273.15).toFixed(1);
  }

  function standerToFahrenheit(stander: number) {
    return (((stander - 273.15) * 9 / 5) + 32).toFixed(1);
  }

  useEffect(() => {
    chrome.storage.local.get(['weatherData'], (res) => {
      const currentTime = Date.now();
      if (res.weatherData) {
        if ((currentTime - res.weatherData.updateTime) < 7200000) {
          setWeatherData(res.weatherData);
        } else {
          getWeatherData(currentTime);
        }
      } else {
        getWeatherData(currentTime);
      }
    });
  }, []);

  return (
    <Wrapper centralPanel={props.centralPanel}>
      <FocusPanelTitle>Current Weather</FocusPanelTitle>
      {weatherData && <WeatherInfoContainer>
        <MainInfo>
          <WeatherIcon icon={weatherData.weather[0].icon}></WeatherIcon>
          <City>{weatherData.weather[0].main}</City>
        </MainInfo>
        <MainInfo>
          {!personalization.isCelsius && <MainDegree>{`${standerToFahrenheit(weatherData.main.temp)} ℉`}</MainDegree>}
          {personalization.isCelsius && <MainDegree>{`${standerToMetric(weatherData.main.temp)} ℃`}</MainDegree>}
          <City>{weatherData.name}</City>
        </MainInfo>
        <MainInfo>
          <Info><InfoTitle>Humidity</InfoTitle>{`${weatherData.main.humidity} %`}</Info>
          <Info>
            <InfoTitle>Feel like</InfoTitle>
            {!personalization.isCelsius && `${standerToFahrenheit(weatherData.main.feels_like)} ℉`}
            {personalization.isCelsius && `${standerToMetric(weatherData.main.feels_like)} ℃`}
          </Info>
          <Info>
            <InfoTitle>Range</InfoTitle>
            {!personalization.isCelsius && `${standerToFahrenheit(weatherData.main.temp_min)} - ${standerToFahrenheit(weatherData.main.temp_max)} ℉`}
            {personalization.isCelsius && `${standerToMetric(weatherData.main.temp_min)} - ${standerToMetric(weatherData.main.temp_max)} ℃`}
          </Info>
        </MainInfo>
      </WeatherInfoContainer>}
    </Wrapper>
  );
};

const WeatherIcon: React.FC<{ icon: string; }> = (props) => {
  return (
    <IconImage>
      {props.icon === '01d' &&
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-brightness-high" viewBox="0 0 16 16">
          <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
        </svg>
      }
      {props.icon === '01n' &&
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-moon-stars" viewBox="0 0 16 16">
          <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z" />
          <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z" />
        </svg>
      }
      {props.icon === '02d' &&
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-cloud-sun" viewBox="0 0 16 16">
          <path d="M7 8a3.5 3.5 0 0 1 3.5 3.555.5.5 0 0 0 .624.492A1.503 1.503 0 0 1 13 13.5a1.5 1.5 0 0 1-1.5 1.5H3a2 2 0 1 1 .1-3.998.5.5 0 0 0 .51-.375A3.502 3.502 0 0 1 7 8zm4.473 3a4.5 4.5 0 0 0-8.72-.99A3 3 0 0 0 3 16h8.5a2.5 2.5 0 0 0 0-5h-.027z" />
          <path d="M10.5 1.5a.5.5 0 0 0-1 0v1a.5.5 0 0 0 1 0v-1zm3.743 1.964a.5.5 0 1 0-.707-.707l-.708.707a.5.5 0 0 0 .708.708l.707-.708zm-7.779-.707a.5.5 0 0 0-.707.707l.707.708a.5.5 0 1 0 .708-.708l-.708-.707zm1.734 3.374a2 2 0 1 1 3.296 2.198c.199.281.372.582.516.898a3 3 0 1 0-4.84-3.225c.352.011.696.055 1.028.129zm4.484 4.074c.6.215 1.125.59 1.522 1.072a.5.5 0 0 0 .039-.742l-.707-.707a.5.5 0 0 0-.854.377zM14.5 6.5a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z" />
        </svg>
      }
      {props.icon === '02n' &&
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-cloud-moon" viewBox="0 0 16 16">
          <path d="M7 8a3.5 3.5 0 0 1 3.5 3.555.5.5 0 0 0 .625.492A1.503 1.503 0 0 1 13 13.5a1.5 1.5 0 0 1-1.5 1.5H3a2 2 0 1 1 .1-3.998.5.5 0 0 0 .509-.375A3.502 3.502 0 0 1 7 8zm4.473 3a4.5 4.5 0 0 0-8.72-.99A3 3 0 0 0 3 16h8.5a2.5 2.5 0 0 0 0-5h-.027z" />
          <path d="M11.286 1.778a.5.5 0 0 0-.565-.755 4.595 4.595 0 0 0-3.18 5.003 5.46 5.46 0 0 1 1.055.209A3.603 3.603 0 0 1 9.83 2.617a4.593 4.593 0 0 0 4.31 5.744 3.576 3.576 0 0 1-2.241.634c.162.317.295.652.394 1a4.59 4.59 0 0 0 3.624-2.04.5.5 0 0 0-.565-.755 3.593 3.593 0 0 1-4.065-5.422z" />
        </svg>
      }
      {(props.icon === '03d' || props.icon === '03n') &&
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-cloud" viewBox="0 0 16 16">
          <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />
        </svg>
      }
      {(props.icon === '04d' || props.icon === '04n') &&
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-clouds" viewBox="0 0 16 16">
          <path d="M16 7.5a2.5 2.5 0 0 1-1.456 2.272 3.513 3.513 0 0 0-.65-.824 1.5 1.5 0 0 0-.789-2.896.5.5 0 0 1-.627-.421 3 3 0 0 0-5.22-1.625 5.587 5.587 0 0 0-1.276.088 4.002 4.002 0 0 1 7.392.91A2.5 2.5 0 0 1 16 7.5z" />
          <path d="M7 5a4.5 4.5 0 0 1 4.473 4h.027a2.5 2.5 0 0 1 0 5H3a3 3 0 0 1-.247-5.99A4.502 4.502 0 0 1 7 5zm3.5 4.5a3.5 3.5 0 0 0-6.89-.873.5.5 0 0 1-.51.375A2 2 0 1 0 3 13h8.5a1.5 1.5 0 1 0-.376-2.953.5.5 0 0 1-.624-.492V9.5z" />
        </svg>
      }
      {(props.icon === '09d' || props.icon === '09n') &&
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-cloud-rain-heavy" viewBox="0 0 16 16">
          <path d="M4.176 11.032a.5.5 0 0 1 .292.643l-1.5 4a.5.5 0 1 1-.936-.35l1.5-4a.5.5 0 0 1 .644-.293zm3 0a.5.5 0 0 1 .292.643l-1.5 4a.5.5 0 1 1-.936-.35l1.5-4a.5.5 0 0 1 .644-.293zm3 0a.5.5 0 0 1 .292.643l-1.5 4a.5.5 0 1 1-.936-.35l1.5-4a.5.5 0 0 1 .644-.293zm3 0a.5.5 0 0 1 .292.643l-1.5 4a.5.5 0 0 1-.936-.35l1.5-4a.5.5 0 0 1 .644-.293zm.229-7.005a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 10H13a3 3 0 0 0 .405-5.973zM8.5 1a4 4 0 0 1 3.976 3.555.5.5 0 0 0 .5.445H13a2 2 0 0 1 0 4H3.5a2.5 2.5 0 1 1 .605-4.926.5.5 0 0 0 .596-.329A4.002 4.002 0 0 1 8.5 1z" />
        </svg>
      }
      {(props.icon === '10d' || props.icon === '10n') &&
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-cloud-drizzle" viewBox="0 0 16 16">
          <path d="M4.158 12.025a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317zm6 0a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317zm-3.5 1.5a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317zm6 0a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 1 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317zm.747-8.498a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 11H13a3 3 0 0 0 .405-5.973zM8.5 2a4 4 0 0 1 3.976 3.555.5.5 0 0 0 .5.445H13a2 2 0 0 1 0 4H3.5a2.5 2.5 0 1 1 .605-4.926.5.5 0 0 0 .596-.329A4.002 4.002 0 0 1 8.5 2z" />
        </svg>
      }
      {(props.icon === '11d' || props.icon === '11n') &&
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-cloud-lightning-rain" viewBox="0 0 16 16">
          <path d="M2.658 11.026a.5.5 0 0 1 .316.632l-.5 1.5a.5.5 0 1 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.316zm9.5 0a.5.5 0 0 1 .316.632l-.5 1.5a.5.5 0 1 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.316zm-7.5 1.5a.5.5 0 0 1 .316.632l-.5 1.5a.5.5 0 1 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.316zm9.5 0a.5.5 0 0 1 .316.632l-.5 1.5a.5.5 0 1 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.316zm-.753-8.499a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 10H13a3 3 0 0 0 .405-5.973zM8.5 1a4 4 0 0 1 3.976 3.555.5.5 0 0 0 .5.445H13a2 2 0 0 1 0 4H3.5a2.5 2.5 0 1 1 .605-4.926.5.5 0 0 0 .596-.329A4.002 4.002 0 0 1 8.5 1zM7.053 11.276A.5.5 0 0 1 7.5 11h1a.5.5 0 0 1 .474.658l-.28.842H9.5a.5.5 0 0 1 .39.812l-2 2.5a.5.5 0 0 1-.875-.433L7.36 14H6.5a.5.5 0 0 1-.447-.724l1-2z" />
        </svg>
      }
      {(props.icon === '13d' || props.icon === '13n') &&
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-cloud-snow" viewBox="0 0 16 16">
          <path d="M13.405 4.277a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 10.25H13a3 3 0 0 0 .405-5.973zM8.5 1.25a4 4 0 0 1 3.976 3.555.5.5 0 0 0 .5.445H13a2 2 0 0 1-.001 4H3.5a2.5 2.5 0 1 1 .605-4.926.5.5 0 0 0 .596-.329A4.002 4.002 0 0 1 8.5 1.25zM2.625 11.5a.25.25 0 0 1 .25.25v.57l.501-.287a.25.25 0 0 1 .248.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 1 1-.5 0v-.57l-.501.287a.25.25 0 0 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25zm2.75 2a.25.25 0 0 1 .25.25v.57l.501-.287a.25.25 0 0 1 .248.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 1 1-.5 0v-.57l-.501.287a.25.25 0 0 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25zm5.5 0a.25.25 0 0 1 .25.25v.57l.501-.287a.25.25 0 0 1 .248.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 1 1-.5 0v-.57l-.501.287a.25.25 0 0 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25zm-2.75-2a.25.25 0 0 1 .25.25v.57l.501-.287a.25.25 0 0 1 .248.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 1 1-.5 0v-.57l-.501.287a.25.25 0 0 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25zm5.5 0a.25.25 0 0 1 .25.25v.57l.501-.287a.25.25 0 0 1 .248.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 1 1-.5 0v-.57l-.501.287a.25.25 0 0 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25z" />
        </svg>
      }
      {(props.icon === '50d' || props.icon === '50n') &&
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-cloud-haze2" viewBox="0 0 16 16">
          <path d="M8.5 3a4.002 4.002 0 0 0-3.8 2.745.5.5 0 1 1-.949-.313 5.002 5.002 0 0 1 9.654.595A3 3 0 0 1 13 12H4.5a.5.5 0 0 1 0-1H13a2 2 0 0 0 .001-4h-.026a.5.5 0 0 1-.5-.445A4 4 0 0 0 8.5 3zM0 7.5A.5.5 0 0 1 .5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm2 2a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-2 4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z" />
        </svg>
      }
    </IconImage>
  );
};