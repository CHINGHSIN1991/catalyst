import React from 'react';
import styled from "styled-components";
import { useState, useEffect } from "react";

import { PanelBasicSetting, PanelTitle, CreateButton } from '../styleSetting';
import { fetchCalendarData } from '../../utils/api';

import { loadEvents } from '../features/reducers/calendarSlice';
import { setEditPanel } from '../features/reducers/editSlice';
import { useDispatch } from 'react-redux';

const CalendarWrapper = styled(PanelBasicSetting)`
  display: flex;
  flex-grow:0;
`;

const CalendarModuleWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0,0,0,0.5);
  position: fixed;
  left: 0;
  top: 0;
`;

const CalendarEditPanel = styled.div`
  width: 480px;
  height: 480px;
  padding: 24px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
`;

const CalendarContainer = styled.div`
  /* border: solid 1px; */
  position: relative;
  max-height: 480px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-button {
    display: none;
    /* background: transparent;
    border-radius: 4px; */
  }
  &::-webkit-scrollbar-track-piece {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0,0,0,0.4);
    border: 1px solid slategrey
  }
  &::-webkit-scrollbar-track {
    box-shadow: transparent;
  }
  
  @media (max-width:1580px) {
  /* 銀幕寬度小於1200套用此區塊 */
    max-height: 240px;
  }
`;

const CalendarBackgroundContainer = styled.div`
  position: relative;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 432px;
`;

const TimeLine = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  height: 32px;
`;

const TimeValue = styled.div`
  font-size: 0.75rem;
  padding-right: 8px;
  color: rgba(255,255,255,0.8);
`;

const TimeHr = styled.div`
  width: 100%;
  height: 1px;
  background-color: rgba(255,255,255,0.3);
`;

const TimeLineDisplay = styled.div`
  position: absolute;
  margin-left:39px;
  width: calc(100% - 39px);
  top: ${(props) => { return `calc(${(props.timeLineInfo.current - props.timeLineInfo.startTime) / 86400000 * 768}px + 15px)`; }};
  height: 2px;
  box-shadow: 0px 0px 5px 2px rgba(255, 255, 255, 0.2);
  background-color: rgba(255,255,255,0.7);
`;

type role = {
  email: string, displayName: string, self: boolean;
};

type timeNode = { dateTime: string, timeZone: string; };
type timeDay = { date: string; };

interface calendarItem {
  colorId?: string;
  created?: string;
  creator?: role;
  end: timeNode | timeDay;
  etag?: string;
  evenType: string;
  htmlLink?: string;
  iCalUID: string;
  id?: string;
  kind?: string;
  organizer?: role;
  reminders?: { useDefault: boolean; };
  sequence?: 0;
  start: timeNode | timeDay;
  status?: string;
  summary: string;
  updated?: string;
}

export const CalendarPanel: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const [timeLineInfo, setTimeLineInfo] = useState({ current: 0, startTime: 0 });
  const [calendarItems, setCalendarItems] = useState([]);
  const [isCreateOn, setIsCreateOn] = useState(false);
  const [userInfo, setUserInfo] = useState({ email: "", id: "", });
  const [authToken, setAuthToken] = useState("");
  const [isEditOn, setIsEditOn] = useState(false);
  const [editItem, setEditItem] = useState({} as calendarItem);


  function delEvent(item: calendarItem) {
    console.log(item);
    fetch(`https://www.googleapis.com/calendar/v3/calendars/${userInfo.email}/events/${item.id}`, {
      headers: new Headers({
        'Authorization': 'Bearer ' + authToken,
        'Content-Type': 'application/json'
      }),
      method: "DELETE",
    }).then((res) => { console.log(res); }).catch((err) => { console.log(err.message); });
  }

  function editEvent(item: calendarItem) {
    console.log(item);
    setIsEditOn(true);
    setEditItem(item);
  }

  function getTime(timeString: string) {
    const time = new Date(timeString);
    return `${time.getMonth() + 1}/${time.getDate()} - ${time.getHours()}:${time.getMinutes()} `;
  }

  function setTimeLine() {
    const current = Date.now();
    const cd = new Date();
    const startTime = Date.parse(`${cd.getFullYear()}-${cd.getMonth() + 1}-${cd.getDate()} 00:00`);
    setTimeLineInfo({ current, startTime });
  }

  useEffect(() => {
    chrome.identity.getProfileUserInfo(
      (res) => {
        setUserInfo({ email: res.email, id: res.id });
        chrome.identity.getAuthToken({ 'interactive': false }, function (token) {
          setAuthToken(token);
          const cd = new Date();
          const timeStampStart = Date.parse(`${cd.getFullYear()}-${cd.getMonth() + 1}-${cd.getDate()} 00:00`);
          const dayStart = new Date(timeStampStart);
          const dayEnd = new Date(timeStampStart + 86400000);
          fetchCalendarData(res.email, dayStart, dayEnd, token).then((res) => dispatch(loadEvents(res.items)));
          // fetchCalendarData(res.email, dayStart, dayEnd, token).then((res) => console.log(res.items));
        });
      }
    );
  }, []);

  useEffect(() => {
    setTimeLine();
    setInterval(() => setTimeLine(), 30000);
  }, []);

  return (
    <CalendarWrapper>
      <PanelTitle>Calendar</PanelTitle>
      {/* {isCreateOn && <CalendarModule setIsCreateOn={setIsCreateOn} userInfo={userInfo} authToken={authToken}></CalendarModule>}
      {isEditOn && <CalendarEditModule editItem={editItem} setIsEditOn={setIsEditOn}></CalendarEditModule>} */}
      <CalendarContainer>
        <CalendarBackground></CalendarBackground>
        <TimeLineDisplay timeLineInfo={timeLineInfo}></TimeLineDisplay>
      </CalendarContainer>
      {/* <button onClick={() => setIsCreateOn(true)}>Create</button> */}
      {calendarItems && !!calendarItems.length && calendarItems.map((item) => {
        return <div key={item.id}>{getTime(item.start.dateTime)}-{getTime(item.end.dateTime)}<br />{item.summary}<button onClick={() => { editEvent(item); }}>edit</button><button onClick={() => { delEvent(item); }}>x</button></div>;
      })}
      <CreateButton onClick={() => { dispatch(setEditPanel({ name: 'EventEdit' })); }}>Create event</CreateButton>
    </CalendarWrapper >
  );
};


const CalendarBackground: React.FC<{}> = () => {
  const timeList = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];
  return (
    <CalendarBackgroundContainer>
      {timeList.map((time) => {
        return (
          <TimeLine key={time}>
            <TimeValue>{`${time}:00`}</TimeValue>
            <TimeHr />
          </TimeLine>);
      })}
    </CalendarBackgroundContainer>
  );

};

const CurrentLine: React.FC<{}> = () => {
  return (
    <TimeLineDisplay></TimeLineDisplay>
  );
};
