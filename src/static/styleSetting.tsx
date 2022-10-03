import styled from "styled-components";

export const PanelBasicSetting = styled.div`
  display: flex;
  flex-direction: column;  
  padding: 12px;
  border-radius: 6px;
  margin: 8px 8px 0;
  border: ${(props) => { return props.panelBorder; }};
  background-color: ${(props) => { return props.panelBackground; }};
  backdrop-filter: blur(16px);
  :last-child {
    margin: 8px
  }
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
  padding: 12px;
  text-align: center;
  font-size: 1rem;
`;

export const PanelTitle = styled.div`
  display: flex;
  flex-shrink: 0;
  width: 100%;
  padding-bottom: 12px;
  font-weight: bold;
  text-align: start;
`;

export const CreateButton = styled.div`
  position: absolute;
  cursor: pointer;
  text-align: center;
  right: 8px;
  top: 8px;
  font-size: 1.5rem;
  line-height: 20px;
  width: 24px;
  height: 24px;
  /* border: solid 1px; */
  background-color: rgba(200,200,200,0.1);
  border-radius: 50%;
  transition: 0.2s;
  :hover{
    background-color: rgba(200,200,200,0.5);
  }
`;

//
export const EditPanelTitle = styled.div`
  margin-bottom: 12px;
  font-weight: bold;
  text-align: center;
`;

export const EditPanelTitleText = styled.div`
  font-weight: bold;
  padding: 0 8px;
`;

export const EditPanelTitleUnderLine = styled.div`
  width: 100%;
  height: 1px;
  margin-top: 8px;
  background-color: darkgrey;
`;

//
export const ToggleTitle = styled.div`
  /* border: solid 1px; */
  opacity: 0;
  transform: translateY(30px);
  position: absolute;
  text-align: center;
  text-shadow: 0 0 5px rgba(0, 0, 0, 1),  0 0 20px rgba(0, 0, 0, 0.5);
  width: 120px;
  transition: 0.2s;
`;

export const ToggleButton = styled.div`
  width: 48px;
  height: 48px;
  margin: 0 24px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* border: solid 1px; */
  cursor: pointer;
  box-shadow: 0px 5px 5px ${(props) => { return props.panelBackground; }};
  border: ${(props) => { return props.panelBorder; }};
  background-color: ${(props) => { return props.panelBackground; }};
  backdrop-filter: blur(16px);
  :hover{
    ${ToggleTitle} {
      opacity: 1;
      transform: translateY(40px);
    }
  }
`;