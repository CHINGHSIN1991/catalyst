import { createSlice } from '@reduxjs/toolkit'
import { userInfo } from '../../../static/types'

// type userInfo = {
//   email: string,
//   id: string,
//   authToken: string,
// }

const initialState = {
  userInfo: {
    email: '',
    id: '',
    authToken: '',
  }
} 

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    loadUserInfo(state, { payload }) {
      console.log('userInfo');
      console.log(payload);
      state.userInfo = payload;
    },
  }
})

export const {loadUserInfo} = userInfoSlice.actions
export const getUserInfo = (state: { userInfo: { userInfo: userInfo}; }) => state.userInfo.userInfo;
export default userInfoSlice.reducer