import { combineReducers } from "redux";
import { redditReducer } from "./Reddit";
import { updatesReducer } from "./Updates";
import { userReducer } from "./User";

export const rootReducer = combineReducers({
  updates: updatesReducer,
  reddit: redditReducer,
  user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
