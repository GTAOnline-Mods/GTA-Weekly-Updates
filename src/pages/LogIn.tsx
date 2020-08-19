import React from "react";
import { Button, Container, Form } from "react-bootstrap";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { bindActionCreators, compose, Dispatch } from "redux";
import Firebase, { withFirebase } from "../Firebase";
import { RootState } from "../store";
import { setIsAdmin, setLoggedIn, setRedirectUrl } from "../store/User";

interface LogInProps extends RouteComponentProps<{}> {
  firebase?: Firebase;
  setLoggedIn: typeof setLoggedIn;
  setIsAdmin: typeof setIsAdmin;
  redirectUrl?: string;
  setRedirectUrl: typeof setRedirectUrl;
  loggedIn: boolean;
  isAdmin: boolean;
}

const LogIn = ({
  firebase,
  history,
  setLoggedIn,
  setIsAdmin,
  redirectUrl,
  setRedirectUrl,
  loggedIn,
  isAdmin,
}: LogInProps) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const logIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // tslint:disable-next-line: possible-timing-attack
    if (email === "" || password === "") {
      return;
    }
    try {
      await firebase?.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error(error);
    } finally {
      if (firebase?.auth.currentUser != null) {
        setLoggedIn(true);
        firebase
          ?.getUserDoc(firebase?.auth.currentUser.uid)
          .then((snapshot: firebase.firestore.DocumentSnapshot | null) => {
            if (snapshot && snapshot.data()?.admin) {
              setIsAdmin(true);
            }
          });
      }
    }
  };

  if (loggedIn) {
    const ru = redirectUrl || "/";
    setRedirectUrl();
    history.push(ru);
  }

  return (
    <Container fluid>
      <h1>Login</h1>
      <div style={{ height: "6rem" }} />
      <Form noValidate validated onSubmit={logIn}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(event.target.value)
            }
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(event.target.value)
            }
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Log In
        </Button>
      </Form>
    </Container>
  );
};

const mapStateToProps = (state: RootState) => ({
  redirectUrl: state.user.redirectUrl,
  loggedIn: state.user.loggedIn,
  isAdmin: state.user.isAdmin,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setLoggedIn,
      setRedirectUrl,
      setIsAdmin,
    },
    dispatch
  );

export default compose(
  withFirebase,
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(LogIn) as any;
