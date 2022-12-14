import React from 'react'
import styled from 'styled-components'

import { ToggleTitle, ToggleButton } from '../../static/styleSetting'

const Wrapper = styled.div`
  position: absolute;
  bottom: 40px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const DesktopToggleButton = styled(ToggleButton)`
  display: flex;
  @media (max-width: 1180px) {
    display: none;
  }
`

const MobileToggleButton = styled(ToggleButton)`
  display: none;
  @media (max-width: 1180px) {
    display: flex;
  }
`

const TogglePanel: React.FC<{
  setIsBoardOn: (boo: boolean) => void
  isMenuOn: boolean
  setIsMenuOn: (boo: boolean) => void
  centralPanel: string
  setCentralPanel: (crp: string) => void
  changeMobileMenu: () => void
}> = (props) => {
  function toggleCentralPanel(target: string) {
    if (props.centralPanel === target) {
      props.setCentralPanel('')
    } else {
      props.setCentralPanel(target)
    }
  }

  return (
    <Wrapper>
      <DesktopToggleButton
        onClick={() => {
          props.setIsMenuOn(!props.isMenuOn)
        }}
      >
        {props.isMenuOn && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{ rotate: '90deg' }}
            width="22"
            height="22"
            fill="currentColor"
            className="bi bi-arrows-expand"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8zM7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10z"
            />
          </svg>
        )}
        {!props.isMenuOn && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{ rotate: '90deg' }}
            width="22"
            height="22"
            fill="currentColor"
            className="bi bi-arrows-collapse"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8zm7-8a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 4.293V.5A.5.5 0 0 1 8 0zm-.5 11.707-1.146 1.147a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 11.707V15.5a.5.5 0 0 1-1 0v-3.793z"
            />
          </svg>
        )}
        <ToggleTitle>Toggle menu</ToggleTitle>
      </DesktopToggleButton>
      <MobileToggleButton onClick={props.changeMobileMenu}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="currentColor"
          className="bi bi-code"
          viewBox="0 0 16 16"
        >
          <path d="M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8l3.147-3.146zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8l-3.147-3.146z" />
        </svg>
        <ToggleTitle>Toggle menu</ToggleTitle>
      </MobileToggleButton>
      <ToggleButton onClick={() => toggleCentralPanel('Pomodoro')}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-alarm"
          viewBox="0 0 16 16"
        >
          <path d="M8.5 5.5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9V5.5z" />
          <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07a7.001 7.001 0 0 0-3.273 12.474l-.602.602a.5.5 0 0 0 .707.708l.746-.746A6.97 6.97 0 0 0 8 16a6.97 6.97 0 0 0 3.422-.892l.746.746a.5.5 0 0 0 .707-.708l-.601-.602A7.001 7.001 0 0 0 9 2.07V1h.5a.5.5 0 0 0 0-1h-3zm1.038 3.018a6.093 6.093 0 0 1 .924 0 6 6 0 1 1-.924 0zM0 3.5c0 .753.333 1.429.86 1.887A8.035 8.035 0 0 1 4.387 1.86 2.5 2.5 0 0 0 0 3.5zM13.5 1c-.753 0-1.429.333-1.887.86a8.035 8.035 0 0 1 3.527 3.527A2.5 2.5 0 0 0 13.5 1z" />
        </svg>
        <ToggleTitle>Pomodoro timer</ToggleTitle>
      </ToggleButton>
      <ToggleButton onClick={() => toggleCentralPanel('Weather')}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-cloud-haze2"
          viewBox="0 0 16 16"
        >
          <path d="M8.5 3a4.002 4.002 0 0 0-3.8 2.745.5.5 0 1 1-.949-.313 5.002 5.002 0 0 1 9.654.595A3 3 0 0 1 13 12H4.5a.5.5 0 0 1 0-1H13a2 2 0 0 0 .001-4h-.026a.5.5 0 0 1-.5-.445A4 4 0 0 0 8.5 3zM0 7.5A.5.5 0 0 1 .5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm2 2a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-2 4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z" />
        </svg>
        <ToggleTitle>Weather panel</ToggleTitle>
      </ToggleButton>
      <ToggleButton onClick={() => props.setIsBoardOn(true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-calendar3"
          viewBox="0 0 16 16"
        >
          <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z" />
          <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
        </svg>
        <ToggleTitle>Bulletin board</ToggleTitle>
      </ToggleButton>
    </Wrapper>
  )
}

export const MemoizedTogglePanel = React.memo(TogglePanel)
