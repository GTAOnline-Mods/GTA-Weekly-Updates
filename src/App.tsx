import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { compose } from "recompose";
import Firebase, { withFirebase } from "./Firebase";

interface AppProps extends RouteComponentProps<{}> {
  firebase?: Firebase;
}

function App({ firebase, history, location, match }: AppProps) {
  return (
    <div className="App">
      <h1>GTA Weekly Updates</h1>
    </div>
  );
}

export default compose(withRouter, withFirebase)(App as any);
