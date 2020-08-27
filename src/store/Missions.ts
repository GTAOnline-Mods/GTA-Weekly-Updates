import { Mission } from "../models/mission";
import { typedAction } from "./actions";

export interface MissionsState {
  missions: Mission[];
}

const initialState: MissionsState = {
  missions: [],
};

export const setMissions = (missions: Mission[]) => {
  return typedAction("missions/SET", missions);
};

export const setMission = (mission: Mission) => {
  return typedAction("missions/SET_MISSION", mission);
};

type MissionsAction = ReturnType<typeof setMissions | typeof setMission>;

export function missionsReducer(
  state = initialState,
  action: MissionsAction
): MissionsState {
  switch (action.type) {
    case "missions/SET":
      return {
        ...state,
        missions: action.payload,
      };
    case "missions/SET_MISSION":
      return {
        ...state,
        missions: [
          ...state.missions.filter((v) => v.docRef !== action.payload.docRef),
          action.payload,
        ],
      };
    default:
      return state;
  }
}
