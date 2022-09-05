import React from 'react';
import styled from "styled-components";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

import { useScript } from '../hooks/useScript';
import { PanelBasicSetting } from './styleSetting';

const CalendarWrapper = styled(PanelBasicSetting)`
  /* border: solid 1px;   */
`
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
`
const CalendarEditPanel = styled.div`
  width: 480px;
  height: 480px;
  padding: 24px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
`


type role = {
  email: string, displayName: string, self: boolean
}

type timeNode = { dateTime: string, timeZone: string }

interface calendarItem {
  colorId: string;
  created: string;
  creator: role;
  end: timeNode;
  etag: string;
  evenType: string;
  htmlLink: string;
  iCalUID: string;
  id: string;
  kind: string;
  organizer: role;
  reminders: { useDefault: boolean };
  sequence: 0;
  start: timeNode;
  status: string;
  summary: string;
  update: string;
}

// interface calendarItemGoogle {
//   "kind": "calendar#event",
//   "etag": etag,
//   "id": string,
//   "status": string,
//   "htmlLink": string,
//   "created": datetime,
//   "updated": datetime,
//   "summary": string,
//   "description": string,
//   "location": string,
//   "colorId": string,
//   "creator": {
//     "id": string,
//     "email": string,
//     "displayName": string,
//     "self": boolean
//   },
//   "organizer": {
//     "id": string,
//     "email": string,
//     "displayName": string,
//     "self": boolean
//   },
//   "start": {
//     "date": date,
//     "dateTime": datetime,
//     "timeZone": string
//   },
//   "end": {
//     "date": date,
//     "dateTime": datetime,
//     "timeZone": string
//   },
//   "endTimeUnspecified": boolean,
//   "recurrence": [
//     string
//   ],
//   "recurringEventId": string,
//   "originalStartTime": {
//     "date": date,
//     "dateTime": datetime,
//     "timeZone": string
//   },
//   "transparency": string,
//   "visibility": string,
//   "iCalUID": string,
//   "sequence": integer,
//   "attendees": [
//     {
//       "id": string,
//       "email": string,
//       "displayName": string,
//       "organizer": boolean,
//       "self": boolean,
//       "resource": boolean,
//       "optional": boolean,
//       "responseStatus": string,
//       "comment": string,
//       "additionalGuests": integer
//     }
//   ],
//   "attendeesOmitted": boolean,
//   "extendedProperties": {
//     "private": {
//       (key): string
//     },
//     "shared": {
//       (key): string
//     }
//   },
//   "hangoutLink": string,
//   "conferenceData": {
//     "createRequest": {
//       "requestId": string,
//       "conferenceSolutionKey": {
//         "type": string
//       },
//       "status": {
//         "statusCode": string
//       }
//     },
//     "entryPoints": [
//       {
//         "entryPointType": string,
//         "uri": string,
//         "label": string,
//         "pin": string,
//         "accessCode": string,
//         "meetingCode": string,
//         "passcode": string,
//         "password": string
//       }
//     ],
//     "conferenceSolution": {
//       "key": {
//         "type": string
//       },
//       "name": string,
//       "iconUri": string
//     },
//     "conferenceId": string,
//     "signature": string,
//     "notes": string,
//   },
//   "gadget": {
//     "type": string,
//     "title": string,
//     "link": string,
//     "iconLink": string,
//     "width": integer,
//     "height": integer,
//     "display": string,
//     "preferences": {
//       (key): string
//     }
//   },
//   "anyoneCanAddSelf": boolean,
//   "guestsCanInviteOthers": boolean,
//   "guestsCanModify": boolean,
//   "guestsCanSeeOtherGuests": boolean,
//   "privateCopy": boolean,
//   "locked": boolean,
//   "reminders": {
//     "useDefault": boolean,
//     "overrides": [
//       {
//         "method": string,
//         "minutes": integer
//       }
//     ]
//   },
//   "source": {
//     "url": string,
//     "title": string
//   },
//   "attachments": [
//     {
//       "fileUrl": string,
//       "title": string,
//       "mimeType": string,
//       "iconLink": string,
//       "fileId": string
//     }
//   ],
//   "eventType": string
// }

export const CalendarPanel: React.FC<{}> = () => {
  const [calendarItems, setCalendarItems] = useState([])
  const [isCreateOn, setIsCreateOn] = useState(false)
  const [userInfo, setUserInfo] = useState({ email: "", id: "", })
  const [authToken, setAuthToken] = useState("")
  const [isEditOn, setIsEditOn] = useState(false)
  const [editItem, setEditItem] = useState({} as calendarItem)

  function delEvent(item: calendarItem) {
    console.log(item);
  }

  function editEvent(item: calendarItem) {
    console.log(item);
    setIsEditOn(true);
    setEditItem(item);
  }

  useEffect(() => {
    console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
    chrome.identity.getAuthToken({ 'interactive': false }, function (token) {
      setAuthToken(token);
      const headers = new Headers({
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      })

      const queryParams = { headers };

      fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=10&timeMin=${(new Date()).toISOString()}`, queryParams)
        .then((response) => response.json()) // Transform the data into json
        .then(function (data) {
          console.log(data);
          setCalendarItems(data.items);
        })
    })
    chrome.identity.getProfileUserInfo(
      (userInfo) => {
        setUserInfo(userInfo);
      }
    );
  }, [])

  return (
    <CalendarWrapper>
      {isCreateOn && <CalendarModule setIsCreateOn={setIsCreateOn} userInfo={userInfo} authToken={authToken}></CalendarModule>}
      {isEditOn && <CalendarEditModule editItem={editItem} setIsEditOn={setIsEditOn}></CalendarEditModule>}
      <button onClick={() => setIsCreateOn(true)}>Create</button>
      {calendarItems && !!calendarItems.length && calendarItems.map((item) => {
        return <div key={item.id}>{item.summary}<button onClick={() => { editEvent(item) }}>edit</button><button onClick={() => { delEvent(item) }}>x</button></div>
      })}
    </CalendarWrapper >
  );
}

const CalendarModule: React.FC<{ setIsCreateOn: (boo: boolean) => void; userInfo: { email: string, id: string }; authToken: string }> = (props) => {
  const [tempEvent, setTempEvent] = useState({
    summary: "",
    date: "",
    startTime: "",
    endTime: "",
    timeZone: "",
    iCalUID: "",
    visibility: "public",
    colorId: "",
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log({ ...tempEvent, [e.target.name]: e.target.value });
    setTempEvent({ ...tempEvent, [e.target.name]: e.target.value })
  }

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    console.log({ ...tempEvent, [e.target.name]: e.target.value });
    setTempEvent({ ...tempEvent, [e.target.name]: e.target.value })
  }

  function postEvent() {
    const current = new Date(`${tempEvent.date} ${tempEvent.startTime}`);
    console.log(current.toISOString());
    const offset = new Date().getTimezoneOffset();
    console.log(offset);
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
    })
    fetch(`https://www.googleapis.com/calendar/v3/calendars/${props.userInfo.email}/events/import`, {
      headers: new Headers({
        'Authorization': 'Bearer ' + props.authToken,
        'Content-Type': 'application/json'
      }),
      method: "POST",
      body: JSON.stringify({
        iCalUID: uuidv4(),
        start: {
          // date: '2022-09-22'
          dateTime: (new Date(`${tempEvent.date} ${tempEvent.startTime}`)).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          // date: '2022-09-23'
          dateTime: (new Date(`${tempEvent.date} ${tempEvent.endTime}`)).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        summary: tempEvent.summary
      })
    }).then((res) => { return res.json() }).then((res) => { console.log(res) }).catch((err) => { console.log(err.message) })
  }

  return (
    <CalendarModuleWrapper>
      <CalendarEditPanel>
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
        <button onClick={() => props.setIsCreateOn(false)}>Cancel</button>
      </CalendarEditPanel>
    </CalendarModuleWrapper >
  );
}

const CalendarEditModule: React.FC<{ editItem: calendarItem; setIsEditOn: (boo: boolean) => void }> = (props) => {
  return (
    <CalendarModuleWrapper>
      <CalendarEditPanel>{JSON.stringify(props.editItem)}<button onClick={() => props.setIsEditOn(false)}>Cancel</button></CalendarEditPanel>

    </CalendarModuleWrapper>
  );
}