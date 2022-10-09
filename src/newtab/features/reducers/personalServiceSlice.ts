import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  serviceList: [5, 8, 9, 1]
} 

const serviceListSlice = createSlice({
  name: 'serviceList',
  initialState,
  reducers: {
    loadServiceList(state, { payload }) {
      console.log('service list');
      console.log(payload);
      state.serviceList = payload;
    },
  }
})

export const {loadServiceList} = serviceListSlice.actions
export const getServiceList = (state: { serviceList: { serviceList: number[]}; }) => state.serviceList.serviceList;
export default serviceListSlice.reducer