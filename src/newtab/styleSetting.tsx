import styled from "styled-components";

export const PanelBasicSetting = styled.div`
  display: flex;
  flex-direction: column;  
  padding: 12px;
  border-radius: 4px;
  margin: 8px;
  background-color: rgba(0,0,0,0.3);
  backdrop-filter: blur(8px);
`;

export const PanelOpenBackground = styled.div`
  width: 100vw;
  height: 100vh;
  left: 0px;
  top: 0px;
  position: fixed;
  background-color: rgba(0,0,0,0.5);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

export const EditPanelWrapper = styled.div`
  background-color: rgba(255,255,255,0.9);
  border-radius: 8px;
`;

export const FocusPanelTitle = styled.div`
  width: 100%;
  padding: 8px;
  text-align: center;
  font-size: 1rem;
`;

export const PanelTitle = styled.div`
  display: flex;
  flex-shrink: 0;
  width: 100%;
  padding-bottom: 8px;
  font-weight: bold;
  text-align: start;
`;

export const CreateButton = styled.div`
  cursor: pointer;
  text-align: center;
  font-size: 0.75rem;
  width: 100%;
  border: solid 1px;
  background-color: rgba(200,200,200,0.2);
  border-radius: 4px;
  padding: 8px;
  margin-top: 8px;
  transition: 0.2s;

  :hover{
    background-color: rgba(200,200,200,0.5);
  }
`;