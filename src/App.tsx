import React from "react";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Updates from "./components/Updates";

function App() {
  return (
    <React.Fragment>
      <Header />
      <div className="yellow-overlay" />
      <Container fluid>
        <Updates />
      </Container>
    </React.Fragment>
  );
}

export default App;
