import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import Firebase, { withFirebase } from "../../Firebase";
import { redditClient } from "../../Reddit";

interface HeaderProps {
  firebase?: Firebase;
}

const Header = ({ firebase }: HeaderProps) => {
  const [communityIcon, setCommunityIcon] = React.useState<string>("");
  React.useEffect(() => {
    redditClient
      .getSubreddit("gtaonline")
      // @ts-ignore
      .community_icon.then(setCommunityIcon);
  }, []);

  const getSubredditIcon = firebase?.functions.httpsCallable(
    "getSubredditIcon"
  );
  if (getSubredditIcon) {
    getSubredditIcon().then(console.log).catch(console.error);
  }

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand as={Link} to="/">
        <img
          alt=""
          src={communityIcon}
          width="30"
          height="30"
          className="d-inline-block align-top"
        />
        &nbsp;&nbsp; GTA Weekly Updates
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto"></Nav>
        <Nav>
          <Nav.Link as={Link} to="login">
            Log In
          </Nav.Link>
          <Nav.Link as={Link} eventKey={2} to="sign-up">
            Sign Up
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default withFirebase(Header);
