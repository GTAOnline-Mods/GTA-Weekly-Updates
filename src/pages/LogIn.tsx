import React from "react";
import { Button, Container, Form } from "react-bootstrap";
import { connect, useDispatch } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { compose } from "redux";
import Firebase, { withFirebase } from "../Firebase";
import { setLoggedIn } from "../store/User";

interface LogInProps extends RouteComponentProps<{}> {
  firebase?: Firebase;
  setLoggedIn: typeof setLoggedIn;
}

const LogIn = ({ firebase, history, setLoggedIn }: LogInProps) => {
  const dispatch = useDispatch();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const logIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email === "" || password === "") {
      return;
    }
    try {
      firebase?.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setLoggedIn(true));
      if (firebase?.auth.currentUser !== null) {
        history.push("/");
      }
    }
  };

  return (
    <Container fluid>
      <h1>Login</h1>
      <div style={{ height: "7vh" }} />
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

const mapDispatchToProps = { setLoggedIn };

export default compose(
  withFirebase,
  withRouter,
  connect(null, mapDispatchToProps)
)(LogIn) as any;
