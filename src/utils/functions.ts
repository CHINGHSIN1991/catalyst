import {timeData, timeKey, setNumberState, setTimeDisplay, setPomoAlertTime } from "../static/types";

export function handleInputChange<T>(e: React.ChangeEvent<HTMLInputElement>, state: T, setState: (state: T) => void) {
  setState({ ...state, [e.target.name]: e.target.value })
}

export function handleTextAreaChange<T>(e: React.ChangeEvent<HTMLTextAreaElement>, state: T, setState: (state: T) => void) {
  setState({ ...state, [e.target.name]: e.target.value })
}

export function handleErrorImage(e:React.ChangeEvent<HTMLImageElement>) {
  e.target.src = 'PlaceHolder_128.png';
}

export function statusChangeDelay(max: number, delay: number, processStatus: number, setProcessStatus: (n: number) => void) {
  if (processStatus + 1 < max) {
    setTimeout(() => setProcessStatus(processStatus + 1), delay);
  } else {
    setTimeout(() => setProcessStatus(0), delay);
  }
}

export function getTimeString(data: timeData, key: timeKey) {
  if ('date' in data) {
    const time = new Date(`${data.date} 00:00`)
    const endTime = new Date (Date.parse(`${data.date} 00:00`)+86500000)
    if (key === 'start') {
      return `${time.getMonth() + 1}/${time.getDate()} - 00:00`;
    } else {
      return `${(endTime).getMonth() + 1}/${endTime.getDate()} - 00:00`;;
    }
  } else {
    const time = new Date(data.dateTime);
    return `${time.getMonth() + 1}/${time.getDate()} - ${`${time.getHours()}`.padStart(2, "0")}:${`${time.getMinutes()}`.padStart(2, "0")}`;
  }
}

export function getTimeStamp(data: timeData, key: timeKey) {
  let timeStamp = 0;
  if ('date' in data) {
    if (key === 'start') {
      timeStamp = Date.parse(`${data.date}T00:00:00`);
    } else {
      timeStamp = Date.parse(`${data.date}T23:59:59`);
    }
  } else {
    timeStamp = Date.parse(data.dateTime);
  }
  return timeStamp;
}

export function deepCopy<T>(data: T):T{
  return JSON.parse(JSON.stringify(data));
}



export function triggerTimer(
  pomoStartTime: number,
  setPomoStartTime: setNumberState,
  pomoStoredTime: number,
  setPomoStoredTime: setNumberState
) {
    const current = Date.now();
    if (pomoStartTime) {
      const accumulation = current - pomoStartTime;
      chrome.storage.local.set({ pomoStartTime: 0, pomoStoredTime: pomoStoredTime + accumulation },
        () => { setPomoStartTime(0); setPomoStoredTime(pomoStoredTime + accumulation); }
      );
    } else {
      chrome.storage.local.set({ pomoStartTime: current },
        () => { setPomoStartTime(current); }
      );
    }
  }

  

  export function clearTimer(
    setPomoStartTime: setNumberState,
    setPomoStoredTime: setNumberState,
    setPomoTimer: setTimeDisplay,
    setPomoAlertTime: setPomoAlertTime
  ) {
    chrome.storage.local.set({ pomoStartTime: 0, pomoStoredTime: 0 },
      () => {
        setPomoStartTime(0);
        setPomoStoredTime(0);
        setPomoTimer({ minutes: '00', seconds: '00' });
        chrome.storage.local.get(["pomoAlertTime"], (res) => {
          if (res.pomoAlertTime) {
            setPomoAlertTime({ value: res.pomoAlertTime });
          }
        });
      }
    );
  }

  export function getPassedSeconds(start: number, stored: number) {
    const current = Date.now();
    return Math.floor((current - start + stored) / 1000);
  }

  export function updateTime(
    setPomoStartTime: setNumberState,
    setPomoStoredTime: setNumberState,
    setPomoTimer: setTimeDisplay,
    setPomoAlertTime: setPomoAlertTime
  ) {
    chrome.storage.local.get(['pomoStartTime', 'pomoAlertTime', 'pomoStoredTime'], (res) => {
      let passedSeconds = 0;
      if (res.pomoStartTime) {
        passedSeconds = getPassedSeconds(res.pomoStartTime, res.pomoStoredTime);
      } else if (res.pomoStoredTime) {
        passedSeconds = Math.floor(res.pomoStoredTime / 1000);
      }
      if (passedSeconds >= res.pomoAlertTime * 60) {
        clearTimer(setPomoStartTime, setPomoStoredTime, setPomoTimer, setPomoAlertTime);
      }
      const minutes = `${res.pomoAlertTime - Math.ceil(passedSeconds / 60)}`.padStart(2, "0");
      const seconds = `${passedSeconds % 60 && 60 - passedSeconds % 60}`.padStart(2, "0");
      setPomoStoredTime(res.pomoStoredTime);
      setPomoTimer({ minutes, seconds });
      setPomoStartTime(res.pomoStartTime);
    });
  }