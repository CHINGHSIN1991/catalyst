import React from 'react';
import styled from "styled-components";
import { useState, useEffect } from "react";

import { PanelBasicSetting, PanelTitle, CreateButton } from '../../static/styleSetting';
import { fetchCalendarData } from '../../utils/api';

import { calendarColorList } from '../../static/optionList';
import { getEvents, loadEvents } from '../features/reducers/calendarSlice';
import { loadUserInfo, getUserInfo } from '../features/reducers/userInfoSlice';
import { getPersonalization } from '../features/reducers/optionsSlice';
import { setEditPanel } from '../features/reducers/editSlice';
import { useSelector, useDispatch } from 'react-redux';

import { calendarItem } from '../../static/types';

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

const CalendarBarsContainer = styled.div`  
  position: absolute;
  display: flex;
  flex-wrap: nowrap;
  left: 40px;
  top: 0px;
  width: calc(100% - 40px);
  height: 800px;
  overflow: hidden;
`;

const BarColumn = styled.div`
  /* display: flex; */
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
`;
// base = { props.dateStart / 3600000 };
// start = { props.getTimeStamp(item.start, 'start') / 3600000 };
// end = { props.getTimeStamp(item.end, 'end') / 3600000 };
// color;
const EventItem = styled.div`
  border: solid 0.5px rgba(120,120,120,0.4);
  border-radius: 4px;
  position: absolute;
  width: calc(100% - 8px);
  top: ${(props) => { return `${(props.start - props.base) * 32 + 16}px`; }};
  height: ${(props) => { return `${(props.end - props.start) * 32}px`; }};
  background-color: ${(props) => { return props.color; }};
  opacity: 0.8;
`;

const EventContent = styled.div`
  font-size: 8px;
  line-height: 12px;
  padding: 4px;
  width: 100%;
  height: 100%;
  background-color: rgba(40,40,40,0.3);
  border-radius: 4px;
  overflow: hidden;
`;

const EventValue = styled.div`
  /* border: solid 1px; */
  padding-bottom: 4px;
  width: 100%;
`;

const InfoCard = styled.div`
  position: fixed;
  left: ${(props) => { return `-${props.position.x / 10}px`; }};
  top: ${(props) => { return `-${props.position.y / 10}px`; }};
  width: 120px;
  height: 40px;
  background-color: #fff;
  border: solid 1px;
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

export const CalendarPanel: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector(getUserInfo);
  const events = useSelector(getEvents);
  const [dateStart, setDateStart] = useState(0);
  const [timeLineInfo, setTimeLineInfo] = useState({ current: 0, startTime: 0 });
  const [calendarItems, setCalendarItems] = useState([]);

  // function delEvent(item: calendarItem) {
  //   console.log(item);
  //   fetch(`https://www.googleapis.com/calendar/v3/calendars/${userInfo.email}/events/${item.id}`, {
  //     headers: new Headers({
  //       'Authorization': 'Bearer ' + authToken,
  //       'Content-Type': 'application/json'
  //     }),
  //     method: "DELETE",
  //   }).then((res) => { console.log(res); }).catch((err) => { console.log(err.message); });
  // }

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

  function getTimeStamp(data, key) {
    let timeStamp = 0;
    if ('date' in data) {
      if (key === 'start') {
        timeStamp = Date.parse(`${data.date}T00:00:00`);
      } else {
        timeStamp = Date.parse(`${data.date}T23:59:59`);
      }
    } else {
      timeStamp = Date.parse(data.dateTime);
    }
    return timeStamp;
  }

  function checkOauthData() {
    console.log(userInfo);
    if (!userInfo.email || !userInfo.authToken) {
      // @ts-ignore
      chrome.identity.getProfileUserInfo({ 'accountStatus': 'ANY' },
        (res) => {
          console.log(res);
          chrome.identity.getAuthToken({ 'interactive': true }, function (token) {
            console.log(token);
            dispatch(loadUserInfo({ ...userInfo, email: res.email, id: res.id, authToken: token }));
            const cd = new Date();
            const timeStampStart = Date.parse(`${cd.getFullYear()}-${cd.getMonth() + 1}-${cd.getDate()} 00:00`);
            setDateStart(timeStampStart);
            const dayStart = new Date(timeStampStart);
            const dayEnd = new Date(timeStampStart + 86400000);
            fetchCalendarData(res.email, dayStart, dayEnd, token).then((res) => dispatch(loadEvents(res.items)));
          });
        }
      );
    } else {
      dispatch(setEditPanel({ name: 'EventAdd' }));
    }
  }

  useEffect(() => {
    chrome.identity.getProfileUserInfo(
      (userInfo) => {
        chrome.storage.sync.get(['userName'], function (userName) {
          const tempName = 'userName' in userName ? userName.userName : 'New User';
          chrome.identity.getAuthToken({ 'interactive': true }, function (token) {
            dispatch(loadUserInfo({ name: tempName, email: userInfo.email, id: userInfo.id, authToken: token }));
            const cd = new Date();
            const timeStampStart = Date.parse(`${cd.getFullYear()}-${cd.getMonth() + 1}-${cd.getDate()} 00:00`);
            setDateStart(timeStampStart);
            const dayStart = new Date(timeStampStart);
            const dayEnd = new Date(timeStampStart + 86400000);
            fetchCalendarData(userInfo.email, dayStart, dayEnd, token).then((res) => dispatch(loadEvents(res.items)));
          });
        });
      }
    );
    setTimeLine();
    setInterval(() => setTimeLine(), 30000);
  }, []);

  useEffect(() => {
    let sortedEvents = [...events];
    let tempDisplayEvent = [] as calendarItem[][];
    sortedEvents.sort((a, b) => getTimeStamp(a.start, 'start') - getTimeStamp(b.start, 'start'));
    for (let i = 0; i < sortedEvents.length; i++) {
      if (i === 0) {
        tempDisplayEvent.push([sortedEvents[i]]);
      } else {
        const temp = tempDisplayEvent.find(elem => getTimeStamp(sortedEvents[i].start, 'start') - getTimeStamp(elem[elem.length - 1].end, 'end') >= 0);
        if (temp) {
          temp.push(sortedEvents[i]);
        } else {
          tempDisplayEvent.push([sortedEvents[i]]);
        }
      }
    }
    setCalendarItems(tempDisplayEvent);
  }, [events]);

  return (
    <CalendarWrapper>
      <PanelTitle>Calendar</PanelTitle>
      <CalendarContainer>
        <CalendarBackground></CalendarBackground>
        <CalendarBars calendarItems={calendarItems} getTimeStamp={getTimeStamp} dateStart={dateStart}></CalendarBars>
        <TimeLineDisplay timeLineInfo={timeLineInfo}></TimeLineDisplay>
      </CalendarContainer>
      <CreateButton onClick={checkOauthData}>+</CreateButton>
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

const CalendarBars: React.FC<{
  calendarItems: calendarItem[][];
  dateStart: number;
  getTimeStamp: (data: {}, key: string) => number;
}> = (props) => {
  const personalization = useSelector(getPersonalization);

  function getTimeString(data, key) {
    if ('date' in data) {
      if (key === 'start') {
        const time = new Date(`${data.date} 00:00`);
        return `${time.getMonth() + 1}/${time.getDate()} 00:00`;
      } else {
        const time = new Date(`${data.date} 23:59`);
        return ` ${time.getMonth() + 1}/${time.getDate()} 23:59`;
      }
    } else {
      const time = new Date(data.dateTime);
      return `${time.getMonth() + 1}/${time.getDate()} ${`${time.getHours()}`.padStart(2, "0")}:${`${time.getMinutes()}`.padStart(2, "0")}`;
    }
  }

  function getTime(data, key) {
    if ('date' in data) {
      if (key === 'start') {
        return '00:00';
      } else {
        return '23:59';
      }
    } else {
      const time = new Date(data.dateTime);
      return `${`${time.getHours()}`.padStart(2, "0")}:${`${time.getMinutes()}`.padStart(2, "0")}`;
    }
  }

  return (
    <CalendarBarsContainer>
      {props.calendarItems.map((bars) => {
        return <BarColumn key={bars[0].iCalUID}>{bars.map((item) => {
          return (
            (item.visibility === 'public' || personalization.isPrivateShow) &&
            <EventItem
              title={`${item.summary} ( ${getTimeString(item.start, 'start')} to ${getTimeString(item.end, 'end')} )`}
              key={item.iCalUID}
              base={props.dateStart / 3600000}
              start={props.getTimeStamp(item.start, 'start') / 3600000}
              end={props.getTimeStamp(item.end, 'end') / 3600000}
              color={personalization.idCalendarColorful ? ((calendarColorList.find((color) => color.colorId === item.colorId) || { name: 'Peacock', code: '#30A7E3', colorId: '7' }).code) : 'rgba(120,120,120,0.9)'}
            ><EventContent>
                <EventValue>{item.summary}</EventValue>
                <EventValue>{getTime(item.start, 'start')} - {getTime(item.end, 'end')}</EventValue>
              </EventContent>
            </EventItem>);
        })
        }</BarColumn>;
      })}
    </CalendarBarsContainer>
  );
};