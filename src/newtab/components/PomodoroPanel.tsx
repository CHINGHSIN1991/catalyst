import React, { useState, useEffect, useRef, useContext } from 'react'
import styled from 'styled-components'

import AlertContext from '../features/alertContext'

import { triggerTimer, clearTimer, updateTime } from '../../utils/functions'
import { FocusPanelTitle } from '../../static/styleSetting'
import { scheme, centralPanel } from '../../static/types'

const Wrapper = styled.div<scheme & centralPanel>`
  font-family: 'Noto Sans', 'Trebuchet MS', 'Microsoft JhengHei';
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  bottom: 104px;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 4px;
  border: ${(props) => props.theme.panelBorder};
  background-color: ${(props) => props.theme.panelBackground};
  backdrop-filter: blur(16px);
  height: ${(props) => (props.centralPanel === 'Pomodoro' ? '128px' : '0px')};
  width: ${(props) => (props.centralPanel === 'Pomodoro' ? '400px' : '0px')};
  transition: 0.1s;
  overflow: hidden;
  @media (max-width: 1180px) {
    width: ${(props) =>
      props.centralPanel === 'Pomodoro' ? 'calc(100% - 48px)' : '0px'};
    min-width: ${(props) =>
      props.centralPanel === 'Pomodoro' ? '280px' : '0px'};
  }
`

const PomodoroContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  width: 100%;
`

const TimerInput = styled.input<scheme>`
  font-family: 'Noto Sans', 'Trebuchet MS', 'Microsoft JhengHei';
  background-color: rgba(255, 255, 255, 0);
  border: none;
  border-bottom: solid 2px ${(props) => props.theme.secondary};
  outline: none;
  color: ${(props) => props.theme.primary};
  text-align: end;
  font-size: 2.5rem;
  width: 48px;
`

const Timer = styled.div`
  display: flex;
  align-items: center;
  font-size: 2.5rem;
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
  width: 28px;
  height: 28px;
  background-color: rgba(0, 0, 0, 0.1);
  cursor: pointer;
`

export const PomodoroPanel: React.FC<centralPanel> = (props) => {
  const [alertState, setAlertState] = useContext(AlertContext)
  const [pomoTimer, setPomoTimer] = useState({ minutes: '00', seconds: '00' })
  const [pomoStoredTime, setPomoStoredTime] = useState(0)
  const [pomoStartTime, setPomoStartTime] = useState(0)
  const [pomoAlertTime, setPomoAlertTime] = useState({ value: 25 })
  const pomoTimeId = useRef(null)

  function checkInputTime(e: React.ChangeEvent<HTMLInputElement>) {
    let tempNumber = parseInt(e.target.value, 10) % 100
    if (tempNumber > 60) {
      tempNumber = 60
      setAlertState({
        title: 'Pomodoro has a time limit of 60 minutes',
        message: 'Please enter an integer less than 60',
      })
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
    <Wrapper centralPanel={props.centralPanel}>
      <FocusPanelTitle>Pomodoro Timer</FocusPanelTitle>
      <PomodoroContainer>
        <Timer>
          {!pomoStartTime && pomoStoredTime === 0 && (
            <TimerInput
              type="number"
              name="value"
              max={60}
              min={1}
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
    </Wrapper>
  )
}
