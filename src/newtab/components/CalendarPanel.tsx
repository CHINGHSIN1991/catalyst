import React, { useContext } from 'react'
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { getEvents, loadEvents } from '../features/reducers/calendarSlice'
import { loadUserInfo, getUserInfo } from '../features/reducers/userInfoSlice'
import { getPersonalization } from '../features/reducers/optionsSlice'
import { setEditPanel } from '../features/reducers/editSlice'
import AlertContext from '../features/alertContext'

import {
  PanelBasicSetting,
  PanelTitle,
  CreateButton,
  ScrollbarContainer,
} from '../../static/styleSetting'
import { fetchCalendarData } from '../../utils/api'
import { calendarColorList } from '../../static/optionList'
import { calendarItem, scheme, timeData, timeKey } from '../../static/types'
import { getTimeString, getTimeStamp } from '../../utils/functions'

type period = {
  base: number
  start: number
  end: number
  color: string
}

type timeLineInfo = {
  timeLineInfo: {
    current: number
    startTime: number
  }
}

const CalendarWrapper = styled(PanelBasicSetting)`
  display: flex;
  flex-grow: 0;
  @media (max-width: 1180px) {
    flex-grow: 1;
  }
`

const CalendarContainer = styled(ScrollbarContainer)`
  position: relative;
  max-height: 480px;
  @media (max-width: 1580px) {
    max-height: 240px;
  }
  @media (max-width: 1180px) {
    max-height: calc(100vh - 344px);
  }
`

const CalendarBackgroundContainer = styled.div`
  position: relative;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 432px;
`

const CalendarBarsContainer = styled.div`
  position: absolute;
  display: flex;
  flex-wrap: nowrap;
  left: 40px;
  top: 0px;
  width: calc(100% - 40px);
  height: 800px;
  overflow: hidden;
`

const BarColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
`

const EventItem = styled.div<period>`
  border: solid 0.5px rgba(120, 120, 120, 0.4);
  color: rgba(255, 255, 255, 1);
  border-radius: 4px;
  position: absolute;
  width: calc(100% - 8px);
  top: ${(props) => `${(props.start - props.base) * 32 + 16}px`};
  height: ${(props) => `${(props.end - props.start) * 32}px`};
  background-color: ${(props) => props.color};
  opacity: 0.8;
`

const EventContent = styled.div`
  font-size: 8px;
  line-height: 12px;
  padding: 4px;
  width: 100%;
  height: 100%;
  background-color: rgba(40, 40, 40, 0.3);
  border-radius: 4px;
  overflow: hidden;
`

const EventValue = styled.div`
  padding-bottom: 4px;
  width: 100%;
`

const TimeLine = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  height: 32px;
`

const TimeValue = styled.div<scheme>`
  font-size: 0.75rem;
  padding-right: 8px;
  color: ${(props) => props.theme.secondary};
`

const TimeHr = styled.div<scheme>`
  width: 100%;
  height: 1px;
  background-color: ${(props) => props.theme.fourthly};
`

const TimeLineDisplay = styled.div<timeLineInfo>`
  position: absolute;
  margin-left: 39px;
  width: calc(100% - 39px);
  top: ${(props) =>
    `calc(${
      ((props.timeLineInfo.current - props.timeLineInfo.startTime) / 86400000) *
      768
    }px + 15px)`};
  height: 2px;
  box-shadow: 0px 0px 5px 2px rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.7);
`

const DelBtn = styled.div`
  cursor: pointer;
  color: rgba(255, 255, 255, 0.4);
  font-weight: normal;
  font-size: 16px;
  text-align: center;
  line-height: 12px;
  width: 12px;
  height: 12px;
  position: absolute;
  right: 2px;
  top: 2px;
  z-index: 3;
  transition: 0.2s;
  :hover {
    color: rgba(255, 255, 255, 1);
    font-weight: bold;
  }
`

export const CalendarPanel: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const userInfo = useSelector(getUserInfo)
  const events = useSelector(getEvents)
  const [dateStart, setDateStart] = useState(0)
  const [timeLineInfo, setTimeLineInfo] = useState({ current: 0, startTime: 0 })
  const [calendarItems, setCalendarItems] = useState([])

  function setTimeLine() {
    const current = Date.now()
    const cd = new Date()
    const startTime = Date.parse(
      `${cd.getFullYear()}-${cd.getMonth() + 1}-${cd.getDate()} 00:00`
    )
    setTimeLineInfo({ current, startTime })
  }

  function checkOauthData() {
    if (!userInfo.email || !userInfo.authToken) {
      chrome.identity.getProfileUserInfo((res) => {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
          dispatch(
            loadUserInfo({
              ...userInfo,
              email: res.email,
              id: res.id,
              authToken: token,
            })
          )
          const cd = new Date()
          const timeStampStart = Date.parse(
            `${cd.getFullYear()}-${cd.getMonth() + 1}-${cd.getDate()} 00:00`
          )
          setDateStart(timeStampStart)
          const dayStart = new Date(timeStampStart)
          const dayEnd = new Date(timeStampStart + 86400000)
          fetchCalendarData(res.email, dayStart, dayEnd, token).then((res) =>
            dispatch(loadEvents(res.items))
          )
        })
      })
    } else {
      dispatch(setEditPanel({ name: 'EventAdd' }))
    }
  }

  function loadCalendarEvents() {
    chrome.identity.getProfileUserInfo((userInfo) => {
      chrome.storage.sync.get(['userName'], function (userName) {
        const tempName = 'userName' in userName ? userName.userName : 'New User'
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
          dispatch(
            loadUserInfo({
              name: tempName,
              email: userInfo.email,
              id: userInfo.id,
              authToken: token,
            })
          )
          const cd = new Date()
          const timeStampStart = Date.parse(
            `${cd.getFullYear()}-${cd.getMonth() + 1}-${cd.getDate()} 00:00`
          )
          setDateStart(timeStampStart)
          const dayStart = new Date(timeStampStart)
          const dayEnd = new Date(timeStampStart + 86400000)
          fetchCalendarData(userInfo.email, dayStart, dayEnd, token).then(
            (res) => dispatch(loadEvents(res.items))
          )
        })
      })
    })
  }

  useEffect(() => {
    loadCalendarEvents()
    setTimeLine()
    const timeLineId = setInterval(() => setTimeLine(), 30000)
    return () => {
      clearInterval(timeLineId)
    }
  }, [])

  useEffect(() => {
    let sortedEvents = [...events]
    let tempDisplayEvent = [] as calendarItem[][]
    sortedEvents.sort(
      (a, b) => getTimeStamp(a.start, 'start') - getTimeStamp(b.start, 'start')
    )
    for (let i = 0; i < sortedEvents.length; i++) {
      if (i === 0) {
        tempDisplayEvent.push([sortedEvents[i]])
      } else {
        const temp = tempDisplayEvent.find(
          (elem) =>
            getTimeStamp(sortedEvents[i].start, 'start') -
              getTimeStamp(elem[elem.length - 1].end, 'end') >=
            0
        )
        if (temp) {
          temp.push(sortedEvents[i])
        } else {
          tempDisplayEvent.push([sortedEvents[i]])
        }
      }
    }
    setCalendarItems(tempDisplayEvent)
  }, [events])

  return (
    <CalendarWrapper>
      <PanelTitle>Calendar</PanelTitle>
      <CalendarContainer>
        <CalendarBackground></CalendarBackground>
        <CalendarBars
          calendarItems={calendarItems}
          getTimeStamp={getTimeStamp}
          dateStart={dateStart}
          loadCalendarEvents={loadCalendarEvents}
        ></CalendarBars>
        <TimeLineDisplay timeLineInfo={timeLineInfo}></TimeLineDisplay>
      </CalendarContainer>
      <CreateButton onClick={checkOauthData}>+</CreateButton>
    </CalendarWrapper>
  )
}

const CalendarBackground: React.FC<{}> = () => {
  const timeList = [
    '00',
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
  ]
  return (
    <CalendarBackgroundContainer>
      {timeList.map((time) => {
        return (
          <TimeLine key={time}>
            <TimeValue>{`${time}:00`}</TimeValue>
            <TimeHr />
          </TimeLine>
        )
      })}
    </CalendarBackgroundContainer>
  )
}

const CalendarBars: React.FC<{
  calendarItems: calendarItem[][]
  dateStart: number
  getTimeStamp: (data: timeData, key: timeKey) => number
  loadCalendarEvents: () => void
}> = (props) => {
  const [alertState, setAlertState] = useContext(AlertContext)
  const userInfo = useSelector(getUserInfo)
  const personalization = useSelector(getPersonalization)

  function delEvent(item: calendarItem) {
    fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${userInfo.email}/events/${item.id}`,
      {
        headers: new Headers({
          Authorization: 'Bearer ' + userInfo.authToken,
          'Content-Type': 'application/json',
        }),
        method: 'DELETE',
      }
    )
      .then(() => props.loadCalendarEvents())
      .catch((err) => {
        console.log(err.message)
      })
  }

  function deleteAlert(item: calendarItem) {
    setAlertState({
      title: 'Data cannot be recovered after deletion',
      message: `Are you sure you want to delete event "${item.summary}" ?`,
      function: () => delEvent(item),
    })
  }

  return (
    <CalendarBarsContainer>
      {props.calendarItems.map((bars) => {
        return (
          <BarColumn key={bars[0].iCalUID}>
            {bars.map((item) => {
              return (
                (item.visibility === 'public' ||
                  personalization.isPrivateShow) && (
                  <EventItem
                    title={`${item.summary} ( ${getTimeString(
                      item.start,
                      'start'
                    )} to ${getTimeString(item.end, 'end')} )`}
                    key={item.iCalUID}
                    base={props.dateStart / 3600000}
                    start={props.getTimeStamp(item.start, 'start') / 3600000}
                    end={props.getTimeStamp(item.end, 'end') / 3600000}
                    color={
                      personalization.idCalendarColorful
                        ? (
                            calendarColorList.find(
                              (color) => color.colorId === item.colorId
                            ) || {
                              name: 'Peacock',
                              code: '#30A7E3',
                              monoCode: '#434343',
                              colorId: '7',
                            }
                          ).code
                        : (
                            calendarColorList.find(
                              (color) => color.colorId === item.colorId
                            ) || {
                              name: 'Peacock',
                              code: '#30A7E3',
                              monoCode: '#434343',
                              colorId: '7',
                            }
                          ).monoCode
                    }
                  >
                    <EventContent>
                      <DelBtn onClick={() => deleteAlert(item)}>×</DelBtn>
                      <EventValue>{item.summary}</EventValue>
                      <EventValue>
                        {getTimeString(item.start, 'start')} -{' '}
                        {getTimeString(item.end, 'end')}
                      </EventValue>
                    </EventContent>
                  </EventItem>
                )
              )
            })}
          </BarColumn>
        )
      })}
    </CalendarBarsContainer>
  )
}
