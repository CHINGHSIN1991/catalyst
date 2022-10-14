import React from 'react';
import styled from "styled-components";

type isProcess = { isProcess: boolean; };

const Wrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  left: 0px;
  bottom: 0px;
  color: rgba(40,40,40,1);
  font-family: 'Noto Sans', 'Trebuchet MS', 'Microsoft JhengHei';
  display: flex;
  flex-direction: column;
  width: 100%;
  transition: 0.1s;
  height: ${(props: isProcess) => props.isProcess ? '232px' : '0px'};
`;

const StatusContainer = styled.div`
  position: relative;
  width: 100%;
  height: ${(props: isProcess) => props.isProcess ? '224px' : '0px'};
  background-color: rgb(240,240,240);
  left: 0px;
  top: 0px;
  transition: 0.1s;
  overflow: hidden;
`;

const StatusContent = styled.div`
  width: 200px;
  height: 240px;
  line-height: 180px;
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: rgb(80,80,80);
`;

export const AlertComponent: React.FC<{ processStatus: number; }> = (props) => {
  return (
    <Wrapper isProcess={props.processStatus !== 0}>
      <StatusContainer isProcess={props.processStatus === 1}>
        <StatusContent>
          Posting note ...
        </StatusContent>
      </StatusContainer>
      <StatusContainer isProcess={props.processStatus === 2}>
        <StatusContent>
          Success!!
        </StatusContent>
      </StatusContainer>
    </Wrapper>
  );
};