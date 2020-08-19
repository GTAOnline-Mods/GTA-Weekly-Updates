import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Container, ListGroup } from "react-bootstrap";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators, compose, Dispatch } from "redux";
import Firebase, { withFirebase } from "../Firebase";
import { Vehicle } from "../models/vehicle";
import { RootState } from "../store";
import { setVehicles } from "../store/Vehicles";

interface VehiclesProps {
  firebase?: Firebase;
  vehicles: Vehicle[];
  setVehicles: typeof setVehicles;
  isAdmin: boolean;
  admin: boolean;
}

function Vehicles({
  firebase,
  vehicles,
  setVehicles,
  isAdmin,
  admin,
}: VehiclesProps) {
  React.useEffect(() => {
    async function getVehicles() {
      const v = await firebase!.getVehicles();
      setVehicles(v);
    }

    if (!vehicles.length) {
      getVehicles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container fluid className="p-2">
      <h1>Vehicles</h1>
      <br />
      <ListGroup>
        {vehicles.map((vehicle) => (
          <ListGroup.Item
            action
            as={Link}
            to={"/vehicles/" + vehicle.docRef?.id}
            key={vehicle.docRef!.id}
            className="d-flex justify-content-between align-items-center"
          >
            <span>
              <b>{vehicle.manufacturer}</b> {vehicle.name}
            </span>
            {admin && isAdmin && (
              <Button
                variant="link"
                as={Link}
                to={"/admin/vehicles/edit/" + vehicle.docRef?.id}
              >
                <FontAwesomeIcon icon={faEdit} />
              </Button>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <br />
      {admin && isAdmin && (
        <div className="d-flex flex-row-reverse">
          <Button variant="link" as={Link} to="/admin/vehicles/edit">
            Add
          </Button>
        </div>
      )}
    </Container>
  );
}

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setVehicles,
    },
    dispatch
  );

const mapStateToProps = (state: RootState) => ({
  isAdmin: state.user.isAdmin,
  vehicles: state.vehicles.vehicles,
});

export default compose(
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps)
)(Vehicles) as any;
