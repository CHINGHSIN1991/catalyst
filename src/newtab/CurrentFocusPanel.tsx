import React from 'react';
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";

import { fetchCalendarData } from '../utils/api';

const Wrapper = styled.div`
  /* border: solid 1px; */
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const FocusBlock = styled.div`
  font-size: 2rem;
  text-align: center;
  font-weight: bold;
  color: white;
  /* text-shadow: 0 0 20px rgba(0, 0, 0, 1),  0 0 20px rgba(0, 0, 0, 0); */
  /* text-shadow: 0 0 20px rgba(10, 175, 230, 1),  0 0 20px rgba(10, 175, 230, 0); */
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

export const CurrentFocusPanel: React.FC<{}> = () => {
  const [userInfo, setUserInfo] = useState({ email: "", id: "", });
  const [authToken, setAuthToken] = useState("");
  const [calendarItems, setCalendarItems] = useState(null);
  const [taskOnGoing, setTaskOnGoing] = useState(null);
  const [updateTime, setUpdateTime] = useState(null);


  function sortByDeadline(items: calendarItem[]) {
    let tempItems = items;
    tempItems.sort(function (a, b) {
      let aValue: string;
      let bValue: string;
      if ("dateTime" in a.end) {
        aValue = a.end.dateTime;
      } else {
        aValue = a.end.date;
      }
      if ("dateTime" in b.end) {
        bValue = b.end.dateTime;
      } else {
        bValue = b.end.date;
      }
      return Date.parse(aValue) - Date.parse(bValue);
    });
    return tempItems;
  }

  function showFocus() {
    const current = Date.now();
    let updateTime: number;
    if (calendarItems && calendarItems.length) {
      let startTime = "";
      let endTime = "";
      if ("dateTime" in calendarItems[0].start) {
        startTime = calendarItems[0].start.dateTime;
      } else {
        startTime = calendarItems[0].start.date;
      }
      if (Date.parse(startTime) < current) {
        if ("dateTime" in calendarItems[0].end) {
          endTime = calendarItems[0].end.dateTime;
        } else {
          endTime = calendarItems[0].end.date;
        }
        console.log("on going");
        setTaskOnGoing(true);
        updateTime = (Date.parse(endTime) - current);
      } else {
        console.log("show next on");
        setTaskOnGoing(false);
        updateTime = (current - Date.parse(startTime));
      }
    }
    setUpdateTime(updateTime);
  }

  function getTime(timeString: string) {
    const time = new Date(timeString);
    return `${time.getMonth() + 1}/${time.getDate()} - ${time.getHours()}:${time.getMinutes()} `;
  }

  useEffect(() => {
    chrome.identity.getProfileUserInfo(
      (res) => {
        setUserInfo({ email: res.email, id: res.id });
        chrome.identity.getAuthToken({ 'interactive': false }, function (token) {
          setAuthToken(token);
          const dayStart = new Date();
          const timeStampStart = Date.parse(`${dayStart.getFullYear()}-${dayStart.getMonth() + 1}-${dayStart.getDate()} 00:00`);
          const dayEnd = new Date(timeStampStart + 259200000);
          fetchCalendarData(res.email, dayStart, dayEnd, token).then((res) => setCalendarItems(sortByDeadline(res.items)));
        });
      }
    );
  }, []);

  useEffect(() => {
    showFocus();
  }, [calendarItems]);

  useEffect(() => {
    if (updateTime) {
      setTimeout(showFocus, updateTime + 5000);
    }
  }, [taskOnGoing]);

  console.log(calendarItems);

  return (
    <Wrapper>
      <FocusBlock>
        {taskOnGoing !== null && taskOnGoing && `Current focus: ${calendarItems[0].summary} (till ${getTime(calendarItems[0].end.dateTime)})`}
        {taskOnGoing !== null && !taskOnGoing && `Task next on: ${calendarItems[0].summary} (start at ${getTime(calendarItems[0].start.dateTime)})`}
      </FocusBlock>
    </Wrapper>
  );
};