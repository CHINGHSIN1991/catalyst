import React from 'react';
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";

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


export const WeatherPanel: React.FC<{}> = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isDataLoad, setIsDataLoad] = useState(false);
  const [weatherData, setWeatherData] = useState({});

  useEffect(() => {
    if (isPanelOpen && !isDataLoad) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetch(`https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_API_KEY}`).then((res) => { console.log(res); }).catch((err) => (console.log(err.message)));
        // console.log(position.coords.latitude)
        // console.log(position.coords.longitude)
      });
    }
  }, [isPanelOpen, isDataLoad]);

  return (
    <Wrapper>
      <button onClick={() => setIsPanelOpen(true)}>Open weather panel</button>
    </Wrapper>
  );
};