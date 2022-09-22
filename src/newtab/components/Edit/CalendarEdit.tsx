import React from 'react';
import styled from "styled-components";
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';

import { PanelBasicSetting } from '../../styleSetting';
import { getEditPanelState, setEditPanel } from '../../features/reducers/editSlice';
import { editShortcut } from '../../features/reducers/shortcutsSlice';
import { EditPanelWrapper } from '../../styleSetting';
import { InputComponent, PanelButton } from '../../../static/components';
import { handleInputChange } from '../../../utils/inputHandler';


const CalendarWrapper = styled.div`
  width: 480px;
  height: 480px;
  padding: 24px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
`;

const CalendarContainer = styled.div`
  /* border: solid 1px; */
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
// export const CalendarEditPanel: React.FC<{ userInfo: { email: string, id: string; }; authToken: string; }> = (props) => {
export const CalendarEditPanel: React.FC<{}> = (props) => {
  const [tempEvent, setTempEvent] = useState({
    summary: "",
    date: "",
    startTime: "",
    endTime: "",
    timeZone: "",
    iCalUID: "",
    visibility: "public",
    colorId: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log({ ...tempEvent, [e.target.name]: e.target.value });
    setTempEvent({ ...tempEvent, [e.target.name]: e.target.value });
  }

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    console.log({ ...tempEvent, [e.target.name]: e.target.value });
    setTempEvent({ ...tempEvent, [e.target.name]: e.target.value });
  }

  function postEvent() {
    const current = new Date(`${tempEvent.date} ${tempEvent.startTime}`);
    console.log({
      iCalUID: uuidv4(),
      start: {
        // date: '2022-09-22'
        dateTime: `${tempEvent.date} ${tempEvent.startTime}`,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        // date: '2022-09-23'
        dateTime: `${tempEvent.date} ${tempEvent.endTime}`,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      summary: tempEvent.summary
    });
    // fetch(`https://www.googleapis.com/calendar/v3/calendars/${props.userInfo.email}/events/import`, {
    //   headers: new Headers({
    //     'Authorization': 'Bearer ' + props.authToken,
    //     'Content-Type': 'application/json'
    //   }),
    //   method: "POST",
    //   body: JSON.stringify({
    //     iCalUID: uuidv4(),
    //     start: {
    //       // date: '2022-09-22'
    //       dateTime: (new Date(`${tempEvent.date} ${tempEvent.startTime}`)).toISOString(),
    //       timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    //     },
    //     end: {
    //       // date: '2022-09-23'
    //       dateTime: (new Date(`${tempEvent.date} ${tempEvent.endTime}`)).toISOString(),
    //       timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    //     },
    //     summary: tempEvent.summary
    //   })
    // }).then((res) => { return res.json(); }).then((res) => { console.log(res); }).catch((err) => { console.log(err.message); });
  }

  return (
    <CalendarWrapper onClick={(e) => { e.stopPropagation(); }}>
      <label htmlFor="">
        標題
        <input name="summary" type="text" value={tempEvent.summary} onChange={handleChange} />
      </label>
      <label htmlFor="">
        日期
        <input type="date" name="date" value={tempEvent.date} onChange={handleChange} />
      </label>
      <label htmlFor="">
        開始時間
        <input name="startTime" type="time" value={tempEvent.startTime} onChange={handleChange} />
      </label>
      <label htmlFor="">
        結束時間
        <input name="endTime" type="time" value={tempEvent.endTime} onChange={handleChange} />
      </label>
      <label htmlFor="">顏色
        <select name="colorId" id="" value={tempEvent.colorId} onChange={handleSelectChange} >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
        </select>
      </label>
      <fieldset name="visibility">
        <legend>公開</legend>
        <div>
          <label htmlFor="public">Public
            <input type="radio" id="public" name="visibility" value="public" checked={"public" === tempEvent.visibility} onChange={handleChange} />
          </label>
        </div>

        <div>
          <label htmlFor="privacy">Privacy
            <input type="radio" id="dewey" name="visibility" value="privacy" checked={"privacy" === tempEvent.visibility} onChange={handleChange} />
          </label>
        </div>
      </fieldset>

      <button onClick={postEvent}>Confirm</button>
      {/* <button onClick={() => props.setIsCreateOn(false)}>Cancel</button> */}
    </CalendarWrapper>
  );
};

const CalendarEditModule: React.FC<{ editItem: calendarItem; setIsEditOn: (boo: boolean) => void; }> = (props) => {
  return (
    <CalendarWrapper>{JSON.stringify(props.editItem)}<button onClick={() => props.setIsEditOn(false)}>Cancel</button></CalendarWrapper>
  );
};