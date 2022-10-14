import { createSlice } from '@reduxjs/toolkit'
import { optionSetting } from '../../../static/types'

const initialState = {
  personalization:{
    isMilitary: true,
    isCelsius: true,
    isMenuShow: true,
    idCalendarColorful: true,
    isPrivateShow: true,
    isDarkMode: true,
    isPageToolShow: true,
    pronounce: 'en-US',
  }
} 

const personalizationSlice = createSlice({
  name: 'personalization',
  initialState,
  reducers: {
    loadPersonalization(state, { payload }) {
      state.personalization = payload;
    },
  }
})

export const {loadPersonalization} = personalizationSlice.actions
export const getPersonalization = (state: { personalization: { personalization:optionSetting }; }) => state.personalization.personalization
export default personalizationSlice.reducer