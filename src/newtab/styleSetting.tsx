import styled from "styled-components";

export const PanelBasicSetting = styled.div`
  display: flex;
  flex-direction: column;
  background-color: rgba(0,0,0,0.4);
  padding: 12px;
  border-radius: 4px;
  margin: 8px;
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
