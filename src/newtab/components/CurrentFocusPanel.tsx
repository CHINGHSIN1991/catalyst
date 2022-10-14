import React, { useRef } from 'react';
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';

import { getEvents } from '../features/reducers/calendarSlice';

import { fetchCalendarData } from '../../utils/api';
import { calendarItem, scheme, timeKey } from '../../static/types';
import { getTimeString, getTimeStamp } from '../../utils/functions';
import { Subtitle } from '../../static/styleSetting';

const Wrapper = styled.div`
  width: 100%;
  height: 64px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const FocusBlock = styled(Subtitle)`
`;

export const CurrentFocusPanel: React.FC<{}> = () => {
  const events = useSelector(getEvents);
  const [calendarItem, setCalendarItem] = useState(null);
  const [taskOnGoing, setTaskOnGoing] = useState(null);
  const currentTask = useRef(null);

  function getCalendarEvents() {
    chrome.identity.getProfileUserInfo(
      (res) => {
        chrome.identity.getAuthToken({ 'interactive': false }, function (token) {
          const current = new Date();
          const timeStampStart = Date.parse(`${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()} 00:00`);
          const dayStart = new Date(timeStampStart - 1000);
          const dayEnd = new Date(timeStampStart + 259200000);
          fetchCalendarData(res.email, dayStart, dayEnd, token).then((res) => {
            const task = checkIsCurrent(res.items);
            currentTask.current = task;
            setCalendarItem(task);
          });
        });
      }
    );
  }

  function sortByTimeStamp(items: calendarItem[], key: timeKey) {
    let tempItems = items;
    tempItems.sort(function (a, b) {
      return getTimeStamp(a[key], key) - getTimeStamp(b[key], key);
    });
    return tempItems;
  }

  function checkIsCurrent(items: calendarItem[]) {
    const current = Date.now();
    console.log(items);
    let tempItems = sortByTimeStamp(items.filter(item => getTimeStamp(item.end, 'end') > current), 'start');
    const onGoing = [];
    const upComing = [];
    tempItems.forEach(item => {
      if (getTimeStamp(item.start, 'start') > current) {
        upComing.push(item);
      } else {
        onGoing.push(item);
      }
    });
    if (onGoing.length) {
      setTaskOnGoing(true);
      return sortByTimeStamp(onGoing, 'end')[0];
    } else {
      setTaskOnGoing(false);
      return upComing[0];
    }
  }

  function checkUpdate() {
    const current = Date.now();
    if (currentTask.current && taskOnGoing && getTimeStamp(currentTask.current.end, 'end') < current) {
      getCalendarEvents();
    } else if (currentTask.current && !taskOnGoing && getTimeStamp(currentTask.current.start, 'start') < current) {
      getCalendarEvents();
    }
  }

  useEffect(() => {
    setInterval(checkUpdate, 1000);
  }, []);

  useEffect(() => {
    getCalendarEvents();
  }, [events]);

  return (
    <Wrapper>
      <FocusBlock>
        {calendarItem && taskOnGoing !== null && taskOnGoing && `Current focus: ${calendarItem.summary}（till ${getTimeString(calendarItem.end, 'end')}）`}
        {calendarItem && taskOnGoing !== null && !taskOnGoing && `Upcoming: ${calendarItem.summary}（start at ${getTimeString(calendarItem.start, 'start')}）`}
      </FocusBlock>
    </Wrapper>
  );
};