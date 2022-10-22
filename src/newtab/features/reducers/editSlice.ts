import { createSlice } from '@reduxjs/toolkit'
import { SetStateAction } from 'react';

type editContent = {name: string, data?: SetStateAction<{ name: string; url: string; }>}

const initialState = {
  editPanelState: {name:''} as editContent,
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
export const getEditPanelState = (state: { editPanelState: { editPanelState: editContent }; }) => state.editPanelState.editPanelState
export default editPanelSlice.reducer