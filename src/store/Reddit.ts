import { Dispatch } from "react";
import { AnyAction } from "redux";
import Snoowrap from "snoowrap";
import { typedAction } from "./actions";

interface RedditState {
  faqThread?: string;
  loading: boolean;
  redditClient?: Snoowrap;
}

const initialState: RedditState = {
  faqThread: undefined,
  loading: false,
};

const setFaqThread = (thread: string) => {
  return typedAction("reddit/SET_FAQ_THREAD", thread);
};

export const loadFaqThread = () => {
  return (dispatch: Dispatch<AnyAction>) => {
    fetch(
      "https://www.reddit.com/r/gtaonline/search/.json?q=title%3Aweekly%20simple%20question%20author%3ACausticPenguino%20OR%20AutoModerator%20subreddit%3Agtaonline&sort=new"
    )
      .then((response) => response.json())
      .then((data) => {
        dispatch(
          setFaqThread(
            "https://www.reddit.com" + data.data.children[0].data.permalink
          )
        );
      });
  };
};

export const setRedditClient = (client: Snoowrap) => {
  return typedAction("reddit/SET_REDDIT_CLIENT", client);
};

type RedditAction = ReturnType<typeof setFaqThread | typeof setRedditClient>;

export function redditReducer(
  state = initialState,
  action: RedditAction
): RedditState {
  switch (action.type) {
    case "reddit/SET_FAQ_THREAD":
      return {
        ...state,
        faqThread: action.payload,
      };
    case "reddit/SET_REDDIT_CLIENT":
      return {
        ...state,
        redditClient: action.payload,
      };
    default:
      return state;
  }
}
