import React from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'

import { setEditPanel } from '../features/reducers/editSlice'
import { getBackgrounds } from '../features/reducers/backgroundSlice'

import { PanelBasicSetting, PanelTitle } from '../../static/styleSetting'
import { scheme } from '../../static/types'

const SettingPanelWrapper = styled(PanelBasicSetting)`
  height: 88px;
`

const ButtonContainer = styled.div`
  width: 100%;
  margin-top: 8px;
  height: 40px;
  display: flex;
  align-items: center;
  @media (max-width: 1180px) {
    margin-top: 0px;
  }
`

const ButtonArea = styled.div<scheme>`
  width: 32px;
  height: 32px;
  background-color: ${(props) => props.theme.primarySemiopaque};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.1s;
  margin-right: 20px;
  :last-child {
    margin-right: 0px;
  }
  :hover {
    background-color: ${(props) => props.theme.primaryHover};
  }
`

const SettingPanel: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const backgroundSetting = useSelector(getBackgrounds)

  return (
    <SettingPanelWrapper>
      <PanelTitle>Setting Panel</PanelTitle>
      <ButtonContainer>
        <ButtonArea
          title="User information"
          onClick={() => {
            dispatch(setEditPanel({ name: 'UserInfoEdit' }))
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="currentColor"
            className="bi bi-person-circle"
            viewBox="0 0 16 16"
          >
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
            <path
              fillRule="evenodd"
              d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
            />
          </svg>
        </ButtonArea>
        <ButtonArea
          title="Background setting"
          onClick={() => {
            dispatch(
              setEditPanel({ name: 'BackgroundEdit', data: backgroundSetting })
            )
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="currentColor"
            className="bi bi-card-image"
            viewBox="0 0 16 16"
          >
            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
            <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z" />
          </svg>
        </ButtonArea>
        <ButtonArea
          title="Pronounce tool"
          onClick={() => {
            dispatch(setEditPanel({ name: 'PronounceToolEdit' }))
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="currentColor"
            className="bi bi-translate"
            viewBox="0 0 16 16"
          >
            <path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286H4.545zm1.634-.736L5.5 3.956h-.049l-.679 2.022H6.18z" />
            <path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2zm7.138 9.995c.193.301.402.583.63.846-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6.066 6.066 0 0 1-.415-.492 1.988 1.988 0 0 1-.94.31z" />
          </svg>
        </ButtonArea>
        <ButtonArea
          title="Menu setting"
          onClick={() => {
            dispatch(setEditPanel({ name: 'MenuOptionEdit' }))
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="currentColor"
            className="bi bi-layout-sidebar-inset"
            viewBox="0 0 16 16"
          >
            <path d="M14 2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h12zM2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2z" />
            <path d="M3 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z" />
          </svg>
        </ButtonArea>
        <ButtonArea
          title="Display mode"
          onClick={() => {
            dispatch(setEditPanel({ name: 'DisplayModeEdit' }))
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="currentColor"
            className="bi bi-display"
            viewBox="0 0 16 16"
          >
            <path d="M0 4s0-2 2-2h12s2 0 2 2v6s0 2-2 2h-4c0 .667.083 1.167.25 1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.75c.167-.333.25-.833.25-1.5H2s-2 0-2-2V4zm1.398-.855a.758.758 0 0 0-.254.302A1.46 1.46 0 0 0 1 4.01V10c0 .325.078.502.145.602.07.105.17.188.302.254a1.464 1.464 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.758.758 0 0 0 .254-.302 1.464 1.464 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.757.757 0 0 0-.302-.254A1.46 1.46 0 0 0 13.99 3H2c-.325 0-.502.078-.602.145z" />
          </svg>
        </ButtonArea>
      </ButtonContainer>
    </SettingPanelWrapper>
  )
}

export const MemoizedSettingPanel = React.memo(SettingPanel)
