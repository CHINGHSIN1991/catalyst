import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  editPanelState: {name:''} as {name:string,data:unknown},
} 

const editPanelSlice = createSlice({
  name: 'editPanelState',
  initialState,
  reducers: {
    setEditPanel(state, { payload }) {
      state.editPanelState.name = payload.name;
      if('data' in payload) {
        state.editPanelState.data = payload.data;
      }
    },
  }
})

export const {setEditPanel} = editPanelSlice.actions
export const getEditPanelState = (state: { editPanelState: { editPanelState: {name: string, data?:any} }; }) => state.editPanelState.editPanelState
export default editPanelSlice.reducer