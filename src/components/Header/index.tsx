import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

function Header() {
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
}

export default Header;
