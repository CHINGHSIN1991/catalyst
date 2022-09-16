import { configureStore } from "@reduxjs/toolkit";
import shortcutsReducer from './reducers/shortcutsSlice'
import editPanelStateReducer from "./reducers/editSlice";

export const store = configureStore({
  reducer: {
    shortcuts: shortcutsReducer,
    editPanelState: editPanelStateReducer,
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch