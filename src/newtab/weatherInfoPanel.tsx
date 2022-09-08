import React from 'react';
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";

import { fetchWeatherData } from '../utils/api';

const Wrapper = styled.div`
  /* border: solid 1px; */
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const DateBlock = styled.div`
  font-size: 2rem;
  text-align: center;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 20px rgba(0, 0, 0, 1),  0 0 20px rgba(0, 0, 0, 0);
  /* text-shadow: 0 0 20px rgba(10, 175, 230, 1),  0 0 20px rgba(10, 175, 230, 0); */
`;

const TimeBlock = styled.div`
  font-size: 7rem;
  text-align: center;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 20px rgba(0, 0, 0, 1),  0 0 20px rgba(0, 0, 0, 0);
  /* text-shadow: 0 0 20px rgba(10, 175, 230, 1),  0 0 20px rgba(10, 175, 230, 0); */
`;

interface weatherData {
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

export const WeatherPanel: React.FC<{}> = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isDataLoad, setIsDataLoad] = useState(false);
  const [weatherData, setWeatherData] = useState<weatherData>(null);

  useEffect(() => {
    if (isPanelOpen && !isDataLoad) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherData(lat, lon).then((res) => setWeatherData(res)).catch((res) => console.log(res));
      });
    }
  }, [isPanelOpen, isDataLoad]);

  return (
    <Wrapper>
      <button onClick={() => setIsPanelOpen(!isPanelOpen)}>{isPanelOpen ? "Close weather panel" : "Open weather panel"}</button>
      {weatherData && <div>{weatherData.name}</div>}
    </Wrapper>
  );
};