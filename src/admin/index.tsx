import React from "react";
import { Container, Nav, Col, Row } from "react-bootstrap";
import { Route, Switch } from "react-router";
import { Link } from "react-router-dom";
import Vehicles from "./pages/Vehicles";

function Admin() {
  return (
    <Container>
      <Row>
        <Col md={3} sm={12}>
          <Nav className="flex-md-column">
            <Nav.Link as={Link} to="/admin/vehicles" eventKey="vehicles">
              Vehicles
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/businesses" eventKey="businesses">
              Businesses
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/properties" eventKey="properties">
              Properties
            </Nav.Link>
          </Nav>
        </Col>
        <Col md={9} sm={12}>
          <Switch>
            <Route path="/admin" exact>
              <Container fluid>
                <h1>Admin Panel</h1>
              </Container>
            </Route>
            <Route path="/admin/vehicles">
              <Vehicles />
            </Route>
          </Switch>
        </Col>
      </Row>
    </Container>
  );
}

export default Admin;
