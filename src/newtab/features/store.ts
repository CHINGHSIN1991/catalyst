import { configureStore } from "@reduxjs/toolkit";
import shortcutsReducer from './reducers/shortcutsSlice'
import editPanelStateReducer from "./reducers/editSlice";
import calendarReducer from './reducers/calendarSlice'
import userInfoReducer from "./reducers/userInfoSlice";

export const store = configureStore({
  reducer: {
    shortcuts: shortcutsReducer,
    editPanelState: editPanelStateReducer,
    events: calendarReducer,
    userInfo: userInfoReducer,
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch