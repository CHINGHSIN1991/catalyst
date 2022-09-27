import { createSlice } from '@reduxjs/toolkit'
import { shortcut } from '../../../static/types'

const initialState = {
  shortcuts:[{id:1234567, logo:"	https://icon.horse/icon/www.google.com.tw", name:"Google", url:"https://www.google.com"}]
};

const shortcutsSlice = createSlice({
  name: 'shortcuts',
  initialState,
  reducers: {
    loadShortcuts(state, { payload }) {
      state.shortcuts = payload;
    },
    editShortcut(state, { payload }) {      
      if('id' in payload){
        const tempState = []
        state.shortcuts.forEach((item)=>{
          if(item.id === payload.id){
            const linkUrl = new URL(payload.url);
            const url = linkUrl.href;
            const logo = `https://icon.horse/icon/${linkUrl.hostname}`;
            tempState.push(
              {
                id: payload.id,
                logo: logo,
                name: payload.name,
                url: url,
              }
            )
          } else {
            tempState.push(item)
          }
        })
        state.shortcuts = tempState
      } else {
        const tempState = [...state.shortcuts]
        const linkUrl = new URL(payload.url);
        const id = Date.now();
        const url = linkUrl.href;
        const logo = `https://icon.horse/icon/${linkUrl.hostname}`;
        tempState.push(
          {
            id: id,
            logo: logo,
            name: payload.name,
            url: url,
          }
        )
        state.shortcuts = tempState
      }
      chrome.storage.sync.set({ shortcuts: state.shortcuts }, function () {
        console.log('set');
      });
    },
    deleteShortcut(state, { payload }) {
      let tempState = state.shortcuts
      state.shortcuts = tempState.filter((item)=> item.id !== payload.id )
      chrome.storage.sync.set({ shortcuts: state.shortcuts }, function () {
        console.log('set');
      });
    }
  }
})

export const {loadShortcuts, editShortcut, deleteShortcut} = shortcutsSlice.actions
export const getShortcuts = (state: { shortcuts: { shortcuts: shortcut[] }; }) => state.shortcuts.shortcuts
export default shortcutsSlice.reducer