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

type UpdatesAction = ReturnType<typeof setUpdates>;

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
    default:
      return state;
  }
}
