import React from "react";
import { Container, Table } from "react-bootstrap";
import { RouteComponentProps, withRouter } from "react-router";
import { Link } from "react-router-dom";
import { compose } from "recompose";
import Header from "./components/Header";
import Firebase, { withFirebase } from "./Firebase";

interface AppProps extends RouteComponentProps<{}> {
  firebase?: Firebase;
}

function App({ firebase, history, location, match }: AppProps) {
  return (
    <React.Fragment>
      <Header />
      <Container fluid>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Reddit Post</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>
                <Link to="weekly-update/30-7-2020">30/7/2020</Link>
              </td>
              <td>
                <a
                  href="https://www.reddit.com/r/gtaonline/comments/i0ig6o/3072020_weekly_gta_online_bonuses/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  30/7/2020 Weekly GTA Online Bonuses
                </a>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>
                <Link to="weekly-update/06-11-2020">06/11/2020</Link>
              </td>
              <td>
                <a
                  href="https://www.reddit.com/r/gtaonline/comments/i7ou4f/los_santos_summer_special_faq_links_and_discounts/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Los Santos Summer Special FAQ, Links and Discounts!
                </a>
              </td>
            </tr>
          </tbody>
        </Table>
      </Container>
    </React.Fragment>
  );
}

export default compose(withRouter, withFirebase)(App as any);
