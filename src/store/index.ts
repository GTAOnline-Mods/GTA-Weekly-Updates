import { combineReducers } from "redux";
import { missionsReducer } from "./Missions";
import { redditReducer } from "./Reddit";
import { updatesReducer } from "./Updates";
import { userReducer } from "./User";
import { vehiclesReducer } from "./Vehicles";

export const rootReducer = combineReducers({
  updates: updatesReducer,
  reddit: redditReducer,
  user: userReducer,
  vehicles: vehiclesReducer,
  missions: missionsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
