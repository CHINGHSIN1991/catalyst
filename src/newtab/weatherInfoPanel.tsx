import React from 'react';
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";

import { fetchWeatherData, getLocationKey, fetchAccuWeatherData } from '../utils/api';

const Wrapper = styled.div`
  /* border: solid 1px; */
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
}

export const WeatherPanel: React.FC<{}> = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isDataLoad, setIsDataLoad] = useState(false);
  const [weatherData, setWeatherData] = useState<accuWeatherDataSet>(null);

  useEffect(() => {
    if (isPanelOpen && !isDataLoad) {
      // navigator.geolocation.getCurrentPosition((position) => {
      //   const lat = position.coords.latitude;
      //   const lon = position.coords.longitude;
      //   console.log(lat, lon);
      //   fetchWeatherData(lat, lon).then((res) => setWeatherData(res)).catch((res) => console.log(res));
      // });
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getLocationKey(lat, lon)
          .then((res) => fetchAccuWeatherData(res.Key).then((res) => { setWeatherData(res); setIsDataLoad(true); }))
          .catch((res) => console.log(res));
      });
    }
  }, [isPanelOpen, isDataLoad]);

  return (
    <Wrapper>
      <button onClick={() => setIsPanelOpen(!isPanelOpen)}>{isPanelOpen ? "Close weather panel" : "Open weather panel"}</button>
      {isPanelOpen && weatherData && weatherData.DailyForecasts.map((item) => {
        return (<div key={item.Date} style={{ color: "white" }}><div>{item.Date}</div><div>{JSON.stringify(item.Temperature)}</div></div>);
      })}
    </Wrapper>
  );
};