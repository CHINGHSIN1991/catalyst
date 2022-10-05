import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  alertWindowState: {name:''} as {name:string,message?:string,function?:any},
} 

const alertWindowSlice = createSlice({
  name: 'alertWindowState',
  initialState,
  reducers: {
    setAlertWindow(state, { payload }) {
      console.log(payload);
      state.alertWindowState.name = payload.name;
      if('message' in payload) {
        state.alertWindowState.message = payload.message;
      } else {
        delete state.alertWindowState.message
      }
      if('function' in payload) {
        state.alertWindowState.function = payload.function;
      } else {
        delete state.alertWindowState.function
      }
    },
  }
})

export const {setAlertWindow} = alertWindowSlice.actions
export const getAlertWindowState = (state: { alertWindowState: { alertWindowState: {name: string,message?:string, function?:any} }; }) => state.alertWindowState.alertWindowState
export default alertWindowSlice.reducer