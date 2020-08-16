import React from "react";
import { Container } from "react-bootstrap";
import { connect, useDispatch } from "react-redux";
import { Route, Switch } from "react-router";
import { bindActionCreators, compose, Dispatch } from "redux";
import Header from "./components/Header";
import Updates from "./components/Updates";
import Firebase, { withFirebase } from "./Firebase";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import { RootState } from "./store";
import { loadFaqThread } from "./store/Reddit";
import { setLoggedIn } from "./store/User";

interface AppProps {
  firebase?: Firebase;
  setLoggedIn: typeof setLoggedIn;
  faqThread?: string;
  loadFaqThread: typeof loadFaqThread;
}

function App({ firebase, setLoggedIn, faqThread, loadFaqThread }: AppProps) {
  const dispatch = useDispatch();

  React.useEffect(() => {
    loadFaqThread();
  }, []);

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
        <Route
          path="/weekly-faq"
          component={() => {
            if (faqThread) {
              window.location.href = faqThread;
            }
            return <h1 className="p-4">Redirecting...</h1>;
          }}
        />
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

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setLoggedIn,
      loadFaqThread,
    },
    dispatch
  );

const mapStateToProps = (state: RootState) => ({
  faqThread: state.reddit.faqThread,
});

export default compose(
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps)
)(App) as any;
