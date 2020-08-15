import { typedAction } from "./actions";

export interface UserState {
  loggedIn: boolean;
}

const initialState: UserState = {
  loggedIn: false,
};

export const setLoggedIn = (loggedIn: boolean) => {
  return typedAction("user/SET_LOGGED_IN", loggedIn);
};

type UserAction = ReturnType<typeof setLoggedIn>;

export function userReducer(
  state = initialState,
  action: UserAction
): UserState {
  switch (action.type) {
    case "user/SET_LOGGED_IN":
      return {
        ...state,
        loggedIn: action.payload,
      };
    default:
      return state;
  }
}
