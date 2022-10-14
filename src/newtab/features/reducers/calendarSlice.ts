import { createSlice } from '@reduxjs/toolkit'
import { calendarItem } from '../../../static/types'

const initialState = {
  events: []
} 

const calendarSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    loadEvents(state, { payload }) {
      state.events = payload;
    },
  }
})

export const {loadEvents} = calendarSlice.actions
export const getEvents = (state: { events: { events: calendarItem[]}; }) => state.events.events
export default calendarSlice.reducer