import React from "react";
import { Button, Container, Form } from "react-bootstrap";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { bindActionCreators, compose, Dispatch } from "redux";
import Firebase, { withFirebase } from "../Firebase";
import { RootState } from "../store";
import { setRedirectUrl } from "../store/User";

interface SignUpProps extends RouteComponentProps<{}> {
  firebase?: Firebase;
  redirectUrl?: string;
  setRedirectUrl: typeof setRedirectUrl;
  loggedIn: boolean;
}

const SignUp = ({
  firebase,
  redirectUrl,
  setRedirectUrl,
  loggedIn,
  history,
}: SignUpProps) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordConfirmation, setPasswordConfirmation] = React.useState("");
  const [error, setError] = React.useState<any>(null);

  const signUp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email === "" || password === "" || passwordConfirmation === "") {
      return;
    }
    firebase?.createUserWithEmailAndPassword(email, password).catch(setError);
    const ru = redirectUrl || "/";
    setRedirectUrl();
    history.push(ru);
  };

  return (
    <Container fluid>
      <h1>Sign Up</h1>
      <div style={{ height: "7vh" }} />
      <Form
        noValidate
        validated={password !== "" && password === passwordConfirmation}
        onSubmit={signUp}
      >
        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            required
            placeholder="Enter email"
            isInvalid={error?.code === "auth/email-already-in-use"}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(event.target.value)
            }
          />
          {!error && (
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          )}
          <Form.Control.Feedback type="invalid">
            This Email is already in use by another user.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            placeholder="Password"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(event.target.value)
            }
          />
        </Form.Group>

        {passwordConfirmation === "" ? (
          <Form.Text className="text-muted pb-2">
            Please confirm your password.
          </Form.Text>
        ) : null}

        <Form.Group controlId="passwordConfirmation">
          <Form.Label>Password confirmation</Form.Label>
          <Form.Control
            type="password"
            required
            placeholder="Password"
            isInvalid={password !== passwordConfirmation}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setPasswordConfirmation(event.target.value)
            }
          />
          <Form.Control.Feedback type="invalid">
            Your passwords don't match.
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit">
          Sign Up
        </Button>
      </Form>
    </Container>
  );
};

const mapStateToProps = (state: RootState) => ({
  redirectUrl: state.user.redirectUrl,
  loggedIn: state.user.loggedIn,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setRedirectUrl,
    },
    dispatch
  );

export default compose(
  withFirebase,
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(SignUp) as any;
