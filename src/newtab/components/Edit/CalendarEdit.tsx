import React from 'react';
import styled from "styled-components";
import { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';

import { getUserInfo } from '../../features/reducers/userInfoSlice';
import { setEditPanel } from '../../features/reducers/editSlice';
import { loadEvents } from '../../features/reducers/calendarSlice';

import { postNewEvent, fetchCalendarData } from '../../../utils/api';
import { EditPanelWrapper, EditPanelTitle, EditPanelTitleText, EditPanelTitleUnderLine } from '../../../static/styleSetting';
import { handleInputChange } from '../../../utils/functions';
import { calendarColorList } from '../../../static/optionList';
import { tempEvent, calendarItem, calendarColor } from '../../../static/types';
import { PanelButton, ButtonContainer } from '../../../static/components';

type width = { width: number; };
type isAllDay = { isAllDay: boolean; };
type isPublic = { isPublic: boolean; };
type eventComparison = { item: calendarItem, tempEvent: calendarItem; };
type colorItem = { item: calendarColor; };

const CalendarWrapper = styled(EditPanelWrapper)`
  width: 360px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormSet = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 36px;
  padding-bottom: 6px;
`;

const InputTitle = styled.div`
  font-size: 12px;
  width: 80px;
`;

const InputValue = styled.input`
  width: ${(props: width) => `${props.width}%`};
  font-size: 1rem;
  height: 28px;
  line-height: 28px;
  border: solid 0.5px lightgray;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: rgba(255,255,255,0);
  outline: none;
  color: rgba(80,80,80,1);
  font-size: 14px;
  ::-webkit-calendar-picker-indicator {
    filter: invert(0.4);
  }
`;

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  height: 28px;
  margin-bottom: 8px;
  line-height: 28px;
  font-size: 12px;
  padding-left: 60px;
  width: 100%;
`;

const Switch = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: 12px;
  width: 32px;
  height: 18px;
  background-color: ${(props: isAllDay) => props.isAllDay ? 'rgba(6,214,160,0.5)' : 'rgba(0,0,0,0.2)'};
  transition: 0.2s;
  border-radius: 12px;
`;

const SwitchOption = styled.div`
  position: absolute;
  left: ${(props: isAllDay) => props.isAllDay ? '16px' : '4px'};
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgb(255,255,255);
  transition: 0.2s;
`;

const ColorSet = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 28px;
`;

const ColorOption = styled.div`
  cursor: pointer;
  width: 14px;
  height: 20px;
  border: solid 2px ${(props: eventComparison) => props.item.colorId === props.tempEvent.colorId ? props.item.colorId : 'rgba(255,255,255,1)'};
  border-radius: 4px;
  background-color: ${(props: colorItem) => props.item.code};
  opacity: ${(props: eventComparison) => props.item.colorId === props.tempEvent.colorId ? 1 : 0.3};
`;

const PublicOptionSet = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 100%;
  height: 24px;
  background-color: rgba(0,0,0,0.1);
  border-radius: 12px;
`;

const PublicOption = styled.div`
  font-size: 12px;
  width: 50%;
  text-align: center;
  font-weight: ${(props: isPublic) => props.isPublic ? 'bold' : 'normal'};
  color: ${(props: isPublic) => props.isPublic ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.2)'};
  transition: 0.2s;
`;

const PublicOptionBg = styled.div`
  position: absolute;
  left: ${(props: isPublic) => props.isPublic ? '4px' : '124px'};
  transition: 0.2s;
  width: 120px;
  height: 18px;
  border-radius: 10px;
  background-color: #fff;
`;

export const CalendarEditPanel: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector(getUserInfo);
  const [tempEvent, setTempEvent] = useState<tempEvent>({
    summary: "",
    isAllDay: false,
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    visibility: "public",
    colorId: "7",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log({ ...tempEvent, [e.target.name]: e.target.value });
    setTempEvent({ ...tempEvent, [e.target.name]: e.target.value });
  }

  function postEvent() {
    postNewEvent(userInfo, tempEvent).then((res) => {
      console.log(res);
      setTempEvent({
        summary: "",
        isAllDay: false,
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        visibility: "public",
        colorId: "7",
      });
      dispatch(setEditPanel({ name: '', data: '' }));
      const cd = new Date();
      const timeStampStart = Date.parse(`${cd.getFullYear()}-${cd.getMonth() + 1}-${cd.getDate()} 00:00`);
      const dayStart = new Date(timeStampStart);
      const dayEnd = new Date(timeStampStart + 86400000);
      fetchCalendarData(userInfo.email, dayStart, dayEnd, userInfo.authToken).then((res) => dispatch(loadEvents(res.items)));
    });
  }

  return (
    <CalendarWrapper onClick={(e: Event) => { e.stopPropagation(); }}>
      <EditPanelTitle>
        <EditPanelTitleText>
          Add event
        </EditPanelTitleText>
        <EditPanelTitleUnderLine></EditPanelTitleUnderLine>
      </EditPanelTitle>
      <FormSet>
        <InputTitle>Title</InputTitle>
        <InputValue name="summary" type="text" value={tempEvent.summary} onChange={handleChange} width={100}></InputValue>
      </FormSet>
      <SwitchContainer>
        All day <Switch onClick={() => { setTempEvent({ ...tempEvent, isAllDay: !tempEvent.isAllDay }); }} isAllDay={tempEvent.isAllDay}><SwitchOption isAllDay={tempEvent.isAllDay} /></Switch>
      </SwitchContainer>
      <FormSet>
        <InputTitle>Start at</InputTitle>
        <InputValue name="startDate" value={tempEvent.startDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, tempEvent, setTempEvent)} type="Date" width={tempEvent.isAllDay ? 100 : 52}></InputValue>
        {!tempEvent.isAllDay && <InputValue name="startTime" value={tempEvent.startTime} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, tempEvent, setTempEvent)} type="Time" width={48}></InputValue>}
      </FormSet>
      <FormSet>
        <InputTitle>End at</InputTitle>
        <InputValue name="endDate" value={tempEvent.endDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, tempEvent, setTempEvent)} type="Date" width={tempEvent.isAllDay ? 100 : 52}></InputValue>
        {!tempEvent.isAllDay && <InputValue name="endTime" value={tempEvent.endTime} onChange={(e) => handleInputChange(e, tempEvent, setTempEvent)} type="Time" width={48}></InputValue>}
      </FormSet>
      <FormSet>
        <InputTitle>Color</InputTitle>
        <ColorSet>
          {calendarColorList &&
            calendarColorList.map((item) => {
              return <ColorOption
                key={item.colorId}
                item={item}
                onClick={() => setTempEvent({ ...tempEvent, colorId: item.colorId })}
                tempEvent={tempEvent}
              />;
            })}
        </ColorSet>
      </FormSet>
      <FormSet>
        <InputTitle></InputTitle>
        <PublicOptionSet onClick={() => setTempEvent({ ...tempEvent, visibility: tempEvent.visibility === 'public' ? 'private' : 'public' })}>
          <PublicOptionBg isPublic={tempEvent.visibility === 'public'}></PublicOptionBg>
          <PublicOption isPublic={tempEvent.visibility === 'public'}>Public</PublicOption>
          <PublicOption isPublic={tempEvent.visibility === 'private'}>Private</PublicOption>
        </PublicOptionSet>
      </FormSet>
      <ButtonContainer>
        <PanelButton width={120} name='Add an Event' onClick={postEvent} />
        <PanelButton width={120} name='Cancel' onClick={() => dispatch(setEditPanel({ name: '', data: '' }))} />
      </ButtonContainer>
    </CalendarWrapper>
  );
};

