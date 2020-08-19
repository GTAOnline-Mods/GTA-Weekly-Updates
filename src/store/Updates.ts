import Update from "../models/update";
import { typedAction } from "./actions";

export interface UpdatesState {
  updates: Update[];
}

const initialState: UpdatesState = {
  updates: [],
};

export const setUpdates = (updates: Update[]) => {
  return typedAction("updates/SET", updates);
};

export const setUpdate = (update: Update) => {
  return typedAction("updates/SET_UPDATE", update);
};

type UpdatesAction = ReturnType<typeof setUpdates | typeof setUpdate>;

export function updatesReducer(
  state = initialState,
  action: UpdatesAction
): UpdatesState {
  switch (action.type) {
    case "updates/SET":
      return {
        ...state,
        updates: action.payload,
      };
    case "updates/SET_UPDATE":
      return {
        ...state,
        updates: [
          ...state.updates.filter((u) => u.docRef !== action.payload.docRef),
          action.payload,
        ],
      };
    default:
      return state;
  }
}
