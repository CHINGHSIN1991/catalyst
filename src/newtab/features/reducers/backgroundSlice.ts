import { createSlice } from '@reduxjs/toolkit'
import { backgroundSetting } from '../../../static/types'

const initialState = {
  backgrounds:{
    lastUpdate: '',
    current: {
      setting:0,
      slice:0,
    },
    backgroundList: [[{
      url: "https://images.unsplash.com/photo-1662900547193-7ef6d19ffcfc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&q=80",
      user: "Pascal Scholl",
      profile: "https://unsplash.com/@hghfve",
      downloadLink: "https://unsplash.com/photos/asmUeIsNIzw/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjYyOTgyNjk2&force=true",
    }]]
  }  
} 

const backgroundSlice = createSlice({
  name: 'backgrounds',
  initialState,
  reducers: {
    loadBackgrounds(state, { payload }) {
      // console.log('backgrounds');
      // console.log(payload);
      state.backgrounds = payload;
    },
    changeBackgroundRandomly(state) {
      const index = Math.floor(Math.random() * state.backgrounds.backgroundList[state.backgrounds.current.setting].length);
      state.backgrounds.current = {...state.backgrounds.current,slice: index}
    }
  }
})

export const {loadBackgrounds, changeBackgroundRandomly} = backgroundSlice.actions
export const getBackgrounds = (state: { backgrounds: { backgrounds:backgroundSetting }; }) => state.backgrounds.backgrounds
export default backgroundSlice.reducer