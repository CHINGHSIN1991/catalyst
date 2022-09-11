import React from 'react';
import styled from "styled-components";
import { useState, useEffect } from "react";

const Wrapper = styled.div`

`;

export const PomodoroPanel: React.FC<{}> = () => {

  function updateTime() {
    chrome.storage.local.get(["PomoTimer"], (res) => {
      console.log(res.PomoTimer);
    });
  }

  return (
    <Wrapper>
      <input type="number" />
      <button>Start</button>
      <button>Pause</button>
      <button>Clear</button>
    </Wrapper>
  );
};

