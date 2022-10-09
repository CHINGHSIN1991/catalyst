import { timeData, timeKey } from "../static/types";

export function handleInputChange(e: React.ChangeEvent<HTMLInputElement>, state: any, setState: (state: any) => void) {
  console.log({ ...state, [e.target.name]: e.target.value });
  setState({ ...state, [e.target.name]: e.target.value })
}

export function handleTextAreaChange(e: React.ChangeEvent<HTMLTextAreaElement>, state: any, setState: (state: any) => void) {
  console.log({ ...state, [e.target.name]: e.target.value });
  setState({ ...state, [e.target.name]: e.target.value })
}

export function handleErrorImage(e) {
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

export function deepCopy(data: any){
  return JSON.parse(JSON.stringify(data));
}