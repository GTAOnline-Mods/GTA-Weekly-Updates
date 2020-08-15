import React from "react";
import { Container } from "react-bootstrap";
import { connect, useDispatch } from "react-redux";
import { Route, Switch } from "react-router";
import { compose } from "redux";
import Header from "./components/Header";
import Updates from "./components/Updates";
import Firebase, { withFirebase } from "./Firebase";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import { setLoggedIn } from "./store/User";

interface AppProps {
  firebase?: Firebase;
  setLoggedIn: typeof setLoggedIn;
}

function App({ firebase, setLoggedIn }: AppProps) {
  const dispatch = useDispatch();
  if (firebase?.auth.currentUser !== null) {
    dispatch(setLoggedIn(true));
  }

  return (
    <React.Fragment>
      <Header />
      <div className="yellow-overlay" />
      <Switch>
        <Route path="/login" component={LogIn} />
        <Route path="/sign-up" component={SignUp} />
        <Route path="/" exact>
          <Container fluid>
            <Updates />
          </Container>
        </Route>
        <Route path="*">
          <Container fluid>
            <h1>404</h1>
            <h3>Page not found.</h3>
          </Container>
        </Route>
      </Switch>
    </React.Fragment>
  );
}

const mapDispatchToProps = { setLoggedIn };

export default compose(
  withFirebase,
  connect(null, mapDispatchToProps)
)(App) as any;
