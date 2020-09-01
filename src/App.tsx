// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
import { Container } from "react-bootstrap";
import { connect } from "react-redux";
import { Route, Switch } from "react-router";
import { bindActionCreators, compose, Dispatch } from "redux";
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
import { loadFaqThread } from "./store/Reddit";
import {
  setAuthReady,
  setIsAdmin,
  setLoggedIn,
  setRedirectUrl
} from "./store/User";

interface AppProps {
  firebase?: Firebase;
  setLoggedIn: typeof setLoggedIn;
  faqThread?: string;
  loadFaqThread: typeof loadFaqThread;
  isAdmin: boolean;
  setIsAdmin: typeof setIsAdmin;
  setRedirectUrl: (path?: string) => void;
  authReady: boolean;
  setAuthReady: typeof setAuthReady;
}

function App({
  firebase,
  setLoggedIn,
  faqThread,
  loadFaqThread,
  isAdmin,
  setRedirectUrl,
  authReady,
  setAuthReady,
  setIsAdmin,
}: AppProps) {
  React.useEffect(() => {
    loadFaqThread();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    firebase?.auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
        firebase?.getUserDoc(user.uid).then((snapshot) => {
          if (snapshot && snapshot.data()?.admin) {
            setIsAdmin(true);
            setAuthReady(true);
          } else {
            setAuthReady(true);
          }
        });
      } else {
        setLoggedIn(false);
        setIsAdmin(false);
        setAuthReady(true);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebase]);

  return (
    <React.Fragment>
      <Header />
      <Switch>
        <Route path="/" exact>
          <Container fluid>
            <Updates />
          </Container>
        </Route>
        <Route path="/login" component={LogIn} />
        <Route path="/sign-up" component={SignUp} />
        <Route path="/vehicles/:id" component={VehicleView} />
        <Route path="/vehicles" component={Vehicles} />
        <Route
          path="/admin"
          component={() => {
            if (!authReady) {
              return <h1 className="p-4">Loading...</h1>;
            }
            return (
              <ProtectedRoute
                path="/admin"
                isAuthenticated={isAdmin}
                component={Admin}
                authenticationPath="/login"
                setRedirectUrl={(path) => setRedirectUrl(path)}
              />
            );
          }}
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
      setAuthReady,
    },
    dispatch
  );

const mapStateToProps = (state: RootState) => ({
  faqThread: state.reddit.faqThread,
  isAdmin: state.user.isAdmin,
  authReady: state.user.authReady,
});

export default compose(
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps)
)(App) as any;
