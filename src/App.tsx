// eslint-disable-next-line @typescript-eslint/no-unused-vars
import firebase from "firebase";
import React from "react";
import { Container } from "react-bootstrap";
import { connect } from "react-redux";
import { Route, Switch } from "react-router";
import { bindActionCreators, compose, Dispatch } from "redux";
import Admin from "./admin";
import Vehicles from "./components/Vehicles";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Updates from "./components/Updates";
import Firebase, { withFirebase } from "./Firebase";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import VehicleView from "./pages/VehicleView";
import { RootState } from "./store";
import { loadFaqThread } from "./store/Reddit";
import { setIsAdmin, setLoggedIn, setRedirectUrl } from "./store/User";

interface AppProps {
  firebase?: Firebase;
  setLoggedIn: typeof setLoggedIn;
  faqThread?: string;
  loadFaqThread: typeof loadFaqThread;
  isAdmin: boolean;
  setIsAdmin: typeof setIsAdmin;
  setRedirectUrl: (path?: string) => void;
}

function App({
  firebase,
  setLoggedIn,
  faqThread,
  loadFaqThread,
  isAdmin,
  setRedirectUrl,
}: AppProps) {
  React.useEffect(() => {
    loadFaqThread();

    if (firebase?.auth.currentUser !== null) {
      setLoggedIn(true);
      firebase
        ?.getUserDoc(firebase?.auth.currentUser.uid)
        .then((snapshot: firebase.firestore.DocumentSnapshot | null) => {
          if (snapshot && snapshot.data()?.admin) {
            setIsAdmin(true);
          }
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <Header />
      <div className="yellow-overlay" />
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
        <ProtectedRoute
          path="/admin"
          isAuthenticated={isAdmin}
          component={Admin}
          authenticationPath="/login"
          setRedirectUrl={(path) => setRedirectUrl(path)}
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
    },
    dispatch
  );

const mapStateToProps = (state: RootState) => ({
  faqThread: state.reddit.faqThread,
  isAdmin: state.user.isAdmin,
});

export default compose(
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps)
)(App) as any;
