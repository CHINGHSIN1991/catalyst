import { createSlice } from '@reduxjs/toolkit'

type role = {
  email: string, displayName: string, self: boolean;
};

type timeNode = { dateTime: string, timeZone: string; };
type timeDay = { date: string; };

interface calendarItem {
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
}

const initialState = {
  events: []
} 

const calendarSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    loadEvents(state, { payload }) {
      console.log('events');
      console.log(payload);
      state.events = payload;
    },
  }
})

export const {loadEvents} = calendarSlice.actions
export const getEvents = (state: { events: { events: calendarItem}; }) => state.events.events
export default calendarSlice.reducer