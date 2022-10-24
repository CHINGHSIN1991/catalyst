import React, { useContext } from 'react';
import styled from "styled-components";

import AlertContext from '../features/alertContext';

import { EditPanelWrapper, EditPanelTitle, EditPanelTitleText, EditPanelTitleUnderLine } from '../../static/styleSetting';
import { PanelButton, AlertButton, ButtonContainer } from '../../static/components';

type panelState = { editPanelState: string; };

const PanelOpenBackground = styled.div`
  width: 100vw;
  height: ${(props: panelState) => props.editPanelState === '' ? "0vh" : "100vh"};
  opacity: ${(props: panelState) => props.editPanelState === '' ? '0' : '1'};
  left: 0px;
  top: 0px;
  position: fixed;
  background-color: rgba(128,128,128,0.1);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.03s;
  z-index: 100;
`;

const PanelContainer = styled.div`
  width: ${(props: panelState) => props.editPanelState === '' ? '0vh' : '100vw'};
  height: ${(props: panelState) => props.editPanelState === '' ? '0vh' : '100vh'};
  transform: ${(props: panelState) => props.editPanelState === '' ? 'translateY(30%)' : 'translateY(0%)'};
  opacity: ${(props: panelState) => props.editPanelState === '' ? '0' : '1'};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.1s;
  transition-delay: 0.1s;
`;

const Wrapper = styled(EditPanelWrapper)`
  width: 480px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AlertTitleText = styled(EditPanelTitleText)`
  padding-top: 4px;
`;

const InfoContainer = styled.div`
  text-align: center;
  line-height: 24px;
  padding: 16px 0 8px;
  width: 100%;
`;

const AlertWindow: React.FC<{}> = () => {
  const [alertState, setAlertState] = useContext(AlertContext);


  return (
    <PanelOpenBackground editPanelState={alertState.title} onClick={() => setAlertState({ title: '' })}>
      <PanelContainer editPanelState={alertState.title}>
        <AlertPanel></AlertPanel>
      </PanelContainer>
    </PanelOpenBackground>
  );
};

const AlertPanel: React.FC<{}> = () => {
  const [alertState, setAlertState] = useContext(AlertContext);

  return (<Wrapper onClick={(e: Event) => { e.stopPropagation(); }}>
    <EditPanelTitle>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
      </svg>
      <AlertTitleText>
        {alertState.title}
      </AlertTitleText>
      <EditPanelTitleUnderLine></EditPanelTitleUnderLine>
    </EditPanelTitle>
    <InfoContainer>
      {alertState.message}
    </InfoContainer>
    {!alertState.function && <ButtonContainer>
      <PanelButton width={96} name='Confirm' onClick={() => setAlertState({ title: '' })} />
    </ButtonContainer>}
    {alertState.function && <ButtonContainer>
      <AlertButton width={96} name='Confirm' onClick={() => { alertState.function(); setAlertState({ title: '' }); }} />
      <PanelButton width={96} name='Cancel' onClick={() => setAlertState({ title: '' })} />
    </ButtonContainer>}
  </Wrapper>);
};

export const MemoizedAlertWindow = React.memo(AlertWindow);
