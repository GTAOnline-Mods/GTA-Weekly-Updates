import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { connect, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { compose } from "redux";
import Firebase, { withFirebase } from "../Firebase";
import { RootState } from "../store";
import { setLoggedIn } from "../store/User";

interface HeaderProps {
  firebase?: Firebase;
  loggedIn: boolean;
  setLoggedIn: typeof setLoggedIn;
}

function Header({ firebase, loggedIn, setLoggedIn }: HeaderProps) {
  const dispatch = useDispatch();

  const signOut = () => {
    firebase?.signOut();
    dispatch(setLoggedIn(false));
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand as={Link} to="/">
        <img
          alt=""
          src="res/img/community_icon.png"
          width="30"
          height="30"
          className="d-inline-block align-top"
        />
        &nbsp;&nbsp; GTA Weekly Updates
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto"></Nav>
        {loggedIn ? (
          <Nav>
            <Nav.Link onClick={signOut}>Sign Out</Nav.Link>
          </Nav>
        ) : (
          <Nav>
            <Nav.Link as={Link} to="login">
              Log In
            </Nav.Link>
            <Nav.Link as={Link} eventKey={2} to="sign-up">
              Sign Up
            </Nav.Link>
          </Nav>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}

const mapStateToProps = (state: RootState) => ({
  loggedIn: state.user.loggedIn,
});

const mapDispatchToProps = { setLoggedIn };

export default compose(
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps)
)(Header) as any;
