import { faEdit, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Container, ListGroup } from "react-bootstrap";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators, compose, Dispatch } from "redux";
import Firebase, { withFirebase } from "../../Firebase";
import Update from "../../models/update";
import { RootState } from "../../store";
import { setUpdates } from "../../store/Updates";

interface UpdatesProps {
  firebase?: Firebase;
  updates: Update[];
  setUpdates: typeof setUpdates;
}

function Updates({ updates, setUpdates, firebase }: UpdatesProps) {
  React.useEffect(() => {
    if (!updates || updates.length === 0) {
      firebase!.getUpdates().then(setUpdates);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container fluid className="p-2">
      <div className="d-flex justify-content-between align-items-center px-4">
        <h1>Updates</h1>
        <Button variant="outline-dark" as={Link} to="/admin/updates/edit">
          <FontAwesomeIcon icon={faPlusCircle} />
        </Button>
      </div>
      <br />
      <ListGroup>
        {updates
          .sort((u1, u2) =>
            u1.date === u2.date ? 0 : u1.date < u2.date ? 1 : -1
          )
          .map((update) => (
            <ListGroup.Item
              action
              key={update.docRef!.id}
              as={Link}
              to={"/admin/updates/edit/" + update.docRef?.id}
              className="d-flex justify-content-between align-items-center"
            >
              {update.date.toLocaleDateString()}
              <Button variant="link">
                <FontAwesomeIcon icon={faEdit} />
              </Button>
            </ListGroup.Item>
          ))}
      </ListGroup>
    </Container>
  );
}

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setUpdates,
    },
    dispatch
  );

const mapStateToProps = (state: RootState) => ({
  updates: state.updates.updates,
});

export default compose(
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps)
)(Updates) as any;
