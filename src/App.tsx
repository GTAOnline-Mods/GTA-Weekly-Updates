// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
import { Container } from "react-bootstrap";
import { connect } from "react-redux";
import { Route, Switch } from "react-router";
import { bindActionCreators, compose, Dispatch } from "redux";
import Snoowrap, { SnoowrapOptions } from "snoowrap";
import Admin from "./admin";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Updates from "./components/Updates";
import Vehicles from "./components/Vehicles";
import Firebase, { withFirebase } from "./Firebase";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import VehicleView from "./pages/VehicleView";
import { RootState } from "./store";
import { loadFaqThread, setRedditClient } from "./store/Reddit";
import { setIsAdmin, setLoggedIn, setRedirectUrl } from "./store/User";

interface AppProps {
  firebase?: Firebase;
  setLoggedIn: typeof setLoggedIn;
  faqThread?: string;
  loadFaqThread: typeof loadFaqThread;
  loggedIn: boolean;
  isAdmin: boolean;
  setIsAdmin: typeof setIsAdmin;
  setRedirectUrl: typeof setRedirectUrl;
  redditClient: Snoowrap;
  setRedditClient: typeof setRedditClient;
}

function App({
  firebase,
  setLoggedIn,
  faqThread,
  loadFaqThread,
  loggedIn,
  isAdmin,
  setIsAdmin,
  setRedirectUrl,
  redditClient,
  setRedditClient,
}: AppProps) {
  React.useEffect(() => {
    loadFaqThread();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!loggedIn && firebase?.auth.currentUser) {
    setLoggedIn(true);
    firebase
      ?.getUserDoc(firebase?.auth.currentUser.uid)
      .then((snapshot: firebase.firestore.DocumentSnapshot | null) => {
        if (snapshot && snapshot.data()?.admin) {
          setIsAdmin(true);
          if (!redditClient) {
            firebase?.db
              .collection("configs")
              .doc("reddit")
              .get()
              .then((snapshot: firebase.firestore.DocumentSnapshot) =>
                setRedditClient(
                  new Snoowrap({ ...(snapshot.data()! as SnoowrapOptions) })
                )
              );
          }
        }
      });
  }

  return (
    <React.Fragment>
      <Header />
      <div className="yellow-overlay" />
      <Switch>
        <Route path="/" exact component={Updates} />
        <Route path="/login" component={LogIn} />
        <Route path="/sign-up" component={SignUp} />
        <Route path="/vehicles/:id" component={VehicleView} />
        <Route path="/vehicles" component={Vehicles} />
        <ProtectedRoute
          path="/admin"
          isAuthenticated={isAdmin}
          component={Admin}
          authenticationPath="/login"
          setRedirectUrl={setRedirectUrl}
        />
        <Route
          path="/weekly-faq"
          component={() => {
            if (faqThread) {
              window.location.href = faqThread;
            }
            return <h1 className="p-4">Redirecting...</h1>;
          }}
        />
        <Route path="*">
          <Container fluid>
            <h1>404</h1>
            <h2 className="pricedown">Page not found.</h2>
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
      setIsAdmin,
      setRedirectUrl,
      setRedditClient,
    },
    dispatch
  );

const mapStateToProps = (state: RootState) => ({
  faqThread: state.reddit.faqThread,
  loggedIn: state.user.loggedIn,
  isAdmin: state.user.isAdmin,
  redditClient: state.reddit.redditClient,
});

export default compose(
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps)
)(App) as any;
