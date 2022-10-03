type PersonalSettings = {
  userName: string
  mode: "LIGHT_MODE"|"DARK_MODE"|"CYBERPUNK",
  weatherOptions: {
    tempScale: string
  },
  languageOptions:{
    language: string
  },
  timerOptions :{
    default: number
  },
  screenTool: {
    isOn: boolean
    position: "LEFT_TOP" | "LEFT_MIDDLE" | "LEFT_BOTTOM" | "RIGHT_TOP" | "RIGHT_MIDDLE" | "RIGHT_BOTTOM"
    size: "SMALL" | "MIDDLE" | "LARGE"
  }
}

export type userInfo = {
  name: string,
  email: string,
  id: string,
  authToken: string,
}

type role = {
  email: string, displayName: string, self: boolean;
};

type timeNode = { dateTime: string, timeZone: string; };
type timeDay = { date: string; };

export type calendarItem  = {
  colorId?: string;
  created?: string;
  creator?: role;
  end: timeNode | timeDay;
  etag?: string;
  evenType: string;
  htmlLink?: string;
  iCalUID: string;
  id?: string;
  kind?: string;
  organizer?: role;
  reminders?: { useDefault: boolean; };
  sequence?: 0;
  start: timeNode | timeDay;
  status?: string;
  summary: string;
  updated?: string;
  visibility?: 'public' | 'private',
}

export type tempEvent = {
  summary: string,
  isAllDay: boolean,
  startDate: string,
  endDate: string,
  startTime: string,
  endTime: string,
  visibility: 'public' | 'private',
  colorId: string,
}

export interface shortcut {
  id: number,
  logo: string,
  name: string,
  url: string,
};

export type background = {
  id: string,
  url: string,
  smallUrl: string,
  user: string,
  profile: string,
  downloadLink: string,
} 

export type backgroundSetting = {
  lastUpdate: string,
  current: {
    setting: number,
    slice: number,
  },
  backgroundList: background[][]
}

export type optionSetting = {
  isMilitary: boolean,
  isCelsius: boolean,
  isMenuShow: boolean,
  idCalendarColorful: boolean,
  isPrivateShow: boolean,
  isDarkMode: boolean,
  pronounce: string,
}

export type memo = {
  id: string,
  memo: string,
  color: string,
  position: { x: number, y: number; },
  createTime: number,
  createAt?: { title: string, url: string; },
};