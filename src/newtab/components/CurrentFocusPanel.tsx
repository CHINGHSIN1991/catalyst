import React from 'react';
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";

import { fetchCalendarData } from '../../utils/api';

const Wrapper = styled.div`
  /* border: solid 1px; */
  font-family: 'Noto Sans', 'Trebuchet MS', 'Microsoft JhengHei';
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const FocusBlock = styled.div`
  font-size: 1.75rem;
  text-align: center;
  font-weight: bold;
  color: ${props => props.theme.primary};
  text-shadow: 0 0 10px ${props => props.theme.inversePrimary},  0 0 20px ${props => props.theme.primaryOpacity};
  transform: translateY(-80px);
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
  const [calendarItem, setCalendarItem] = useState(null);
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
        aValue = `${a.end.date} 00:00:00`;
      }
      if ("dateTime" in b.end) {
        bValue = b.end.dateTime;
      } else {
        bValue = `${b.end.date} 23:59:59`;
      }
      return Date.parse(aValue) - Date.parse(bValue);
    });
    return tempItems;
  }

  function checkIsCurrent(items: calendarItem[]) {
    let tempItems = [...items];
    let focusItem: calendarItem;
    const current = Date.now();
    focusItem = tempItems.find((item) => {
      let startTime: string;
      if ("dateTime" in item.start) {
        startTime = item.start.dateTime;
      } else {
        startTime = item.start.date;
      }
      return Date.parse(startTime) < current;
    });
    if (focusItem) {
      return focusItem;
    } else {
      return items[0];
    }
  }

  function showFocus() {
    const current = Date.now();
    let updateTime: number;
    if (calendarItem) {
      let startTime = "";
      let endTime = "";
      if ("dateTime" in calendarItem.start) {
        startTime = calendarItem.start.dateTime;
      } else {
        startTime = `${calendarItem.start.date} 00:00`;
      }
      if (Date.parse(startTime) < current) {
        if ("dateTime" in calendarItem.end) {
          endTime = calendarItem.end.dateTime;
        } else {
          endTime = `${calendarItem.end.date} 23:59`;
        }
        // console.log("on going");
        setTaskOnGoing(true);
        updateTime = (Date.parse(endTime) - current);
      } else {
        // console.log("show next on");
        setTaskOnGoing(false);
        updateTime = (current - Date.parse(startTime));
      }
    }
    setUpdateTime(updateTime);
  }

  function getTime(timeString: string) {
    const time = new Date(timeString);
    return `${time.getMonth() + 1}/${time.getDate()} - ${`${time.getHours()}`.padStart(2, "0")}:${`${time.getMinutes()}`.padStart(2, "0")}`;
  }

  useEffect(() => {
    chrome.identity.getProfileUserInfo(
      (res) => {
        chrome.identity.getAuthToken({ 'interactive': false }, function (token) {
          const dayStart = new Date();
          const timeStampStart = Date.parse(`${dayStart.getFullYear()}-${dayStart.getMonth() + 1}-${dayStart.getDate()} 00:00`);
          const dayEnd = new Date(timeStampStart + 259200000);
          fetchCalendarData(res.email, dayStart, dayEnd, token).then((res) => { setCalendarItem(checkIsCurrent(sortByDeadline(res.items))); });
        });
      }
    );
  }, []);

  useEffect(() => {
    showFocus();
  }, [calendarItem]);

  useEffect(() => {
    if (updateTime) {
      setTimeout(showFocus, updateTime + 5000);
    }
  }, [taskOnGoing]);

  return (
    <Wrapper>
      <FocusBlock>
        {taskOnGoing !== null && taskOnGoing && `Current focus: ${calendarItem.summary}（till ${getTime(calendarItem.end.dateTime)}）`}
        {taskOnGoing !== null && !taskOnGoing && `Upcoming: ${calendarItem.summary}（start at ${getTime(calendarItem.start.dateTime)}）`}
      </FocusBlock>
    </Wrapper>
  );
};