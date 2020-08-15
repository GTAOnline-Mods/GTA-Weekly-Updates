import React from "react";
import { Button, Container, Form } from "react-bootstrap";
import Firebase, { withFirebase } from "../Firebase";

interface SignUpProps {
  firebase?: Firebase;
}

const SignUp = ({ firebase }: SignUpProps) => {
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
          Log In
        </Button>
      </Form>
    </Container>
  );
};

export default withFirebase(SignUp);
