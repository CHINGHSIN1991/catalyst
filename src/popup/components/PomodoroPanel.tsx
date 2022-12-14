import React from 'react'
import styled from 'styled-components'
import { useState, useEffect, useRef } from 'react'

import {
  triggerTimer,
  updateTime,
  clearTimer,
  getPassedSeconds,
} from '../../utils/functions'

const PomodoroContainer = styled.div`
  font-family: 'Noto Sans', 'Trebuchet MS', 'Microsoft JhengHei';
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding-bottom: 16px;
  width: 100%;
`

const Title = styled.div`
  width: 100%;
  padding: 12px 8px;
  color: rgb(100, 100, 100);
  font-weight: bold;
`

const TimerInput = styled.input`
  font-family: 'Noto Sans', 'Trebuchet MS', 'Microsoft JhengHei';
  background-color: rgba(255, 255, 255, 0);
  border: none;
  border-bottom: solid 2px rgb(160, 160, 160);
  outline: none;
  text-align: end;
  font-size: 2rem;
  width: 40px;
  height: 32px;
`

const Timer = styled.div`
  display: flex;
  align-items: center;
  font-size: 2rem;
`

const ButtonContainer = styled.div`
  display: flex;
`

const Btn = styled.div`
  margin-left: 24px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  background-color: rgba(0, 0, 0, 0);
  cursor: pointer;
  transition: 0.2s;
  :hover {
    background-color: rgba(255, 255, 255, 0.5);
  }
`

export const PomodoroPanel: React.FC<{}> = () => {
  const [pomoTimer, setPomoTimer] = useState({ minutes: '00', seconds: '00' })
  const [pomoStoredTime, setPomoStoredTime] = useState(0)
  const [pomoStartTime, setPomoStartTime] = useState(0)
  const [pomoAlertTime, setPomoAlertTime] = useState({ value: 25 })
  const pomoTimeId = useRef(null)

  function checkInputTime(e: React.ChangeEvent<HTMLInputElement>) {
    let tempNumber = parseInt(e.target.value, 10) % 100
    if (tempNumber > 60) {
      tempNumber = 60
    } else if (tempNumber < 0) {
      tempNumber = 1
    }
    setPomoAlertTime({ value: tempNumber })
  }

  useEffect(() => {
    chrome.storage.local.get(
      ['pomoStartTime', 'pomoAlertTime', 'pomoStoredTime'],
      (res) => {
        if (res.pomoStartTime) {
          setPomoStartTime(res.pomoStartTime)
        } else {
          setPomoStartTime(0)
        }
        if (res.pomoAlertTime) {
          setPomoAlertTime({ value: res.pomoAlertTime })
        } else {
          setPomoAlertTime({ value: 25 })
        }
      }
    )
    updateTime(
      setPomoStartTime,
      setPomoStoredTime,
      setPomoTimer,
      setPomoAlertTime
    )
    pomoTimeId.current = setInterval(
      () =>
        updateTime(
          setPomoStartTime,
          setPomoStoredTime,
          setPomoTimer,
          setPomoAlertTime
        ),
      1000
    )
  }, [])

  useEffect(() => {
    chrome.storage.local.set({ pomoAlertTime: pomoAlertTime.value })
  }, [pomoAlertTime])

  return (
    <PomodoroContainer>
      <Title>Pomodoro timer</Title>
      <Timer>
        {pomoStartTime === 0 && pomoStoredTime === 0 && (
          <TimerInput
            type="number"
            name="value"
            max="60"
            min="1"
            value={pomoAlertTime.value}
            onChange={(e) => checkInputTime(e)}
          ></TimerInput>
        )}
        {(pomoStartTime || pomoStoredTime !== 0) && pomoTimer.minutes}:
        {pomoTimer.seconds}
      </Timer>
      <ButtonContainer>
        <Btn
          onClick={() =>
            triggerTimer(
              pomoStartTime,
              setPomoStartTime,
              pomoStoredTime,
              setPomoStoredTime
            )
          }
        >
          {pomoStartTime ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="currentColor"
              className="bi bi-pause-circle"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M5 6.25a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5zm3.5 0a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="currentColor"
              className="bi bi-play-circle"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z" />
            </svg>
          )}
        </Btn>
        <Btn
          onClick={() =>
            clearTimer(
              setPomoStartTime,
              setPomoStoredTime,
              setPomoTimer,
              setPomoAlertTime
            )
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            fill="currentColor"
            className="bi bi-stop-circle"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="M5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3z" />
          </svg>
        </Btn>
      </ButtonContainer>
    </PomodoroContainer>
  )
}
