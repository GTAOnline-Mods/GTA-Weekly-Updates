import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { bindActionCreators, compose, Dispatch } from "redux";
import Firebase, { withFirebase } from "../Firebase";
import { Vehicle } from "../models/vehicle";
import { RootState } from "../store";
import { setVehicles } from "../store/Vehicles";

interface VehicleViewMatch {
  id: string;
}

interface VehicleViewProps extends RouteComponentProps<VehicleViewMatch> {
  firebase?: Firebase;
  vehicles: Vehicle[];
  isAdmin: boolean;
  setVehicles: typeof setVehicles;
}

// tslint:disable-next-line: function-name
// tslint:disable-next-line: react-a11y-accessible-headings
function VehicleView({
  firebase,
  vehicles,
  setVehicles,
  match,
  isAdmin,
}: VehicleViewProps) {
  const [vehicle, setVehicle] = React.useState<Vehicle | null>(null);
  const [vehicleExists, setVehicleExists] = React.useState(true);

  React.useEffect(() => {
    async function getVehicles() {
      const v = await firebase!.getVehicles();
      setVehicles(v);
    }
    if (!vehicles || vehicles.length === 0) {
      getVehicles();
    }

    const v = vehicles.filter((v) => v.docRef?.id === match.params.id);
    if (v.length) {
      setVehicle(v[0]);
    } else {
      setVehicleExists(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicles, match]);

  if (vehicle) {
    return (
      <Container fluid>
        <div className="d-flex justify-content-between">
          <h2 className="pricedown">{vehicle.manufacturer}</h2>
          {isAdmin && (
            <Button
              variant="link"
              style={{ color: "black" }}
              as={Link}
              to={"/admin/vehicles/edit/" + vehicle.docRef?.id}
            >
              <FontAwesomeIcon icon={faEdit} />
            </Button>
          )}
        </div>
        <h1 className="mb-4">{vehicle.name}</h1>

        <Image
          src={vehicle.img}
          className="my-4"
          thumbnail
          style={{ maxHeight: "200px" }}
        />

        <Row className="pb-2 mt-4">
          <Col md={4} lg={12}>
            <b>Price</b>
          </Col>
          <Col md={8} lg={12}>
            GTA$ {vehicle.price!.toLocaleString()}
          </Col>
        </Row>
        {vehicle.tradePrice && (
          <Row className="pb-2">
            <Col md={4} lg={12}>
              <b>Trade Price</b>
            </Col>
            <Col md={8} lg={12}>
              GTA$ {vehicle.tradePrice!.toLocaleString()}
            </Col>
          </Row>
        )}
        <Row className="pb-2">
          <Col md={4} lg={12}>
            <b>Available at</b>
          </Col>
          <Col md={8} lg={12}>
            {vehicle.shop}
          </Col>
        </Row>

        <div className="d-flex flex-row-reverse p-4">
          <a href={vehicle.url} target="_blank" rel="noopener noreferrer">
            Source
          </a>
        </div>
      </Container>
    );
  } else {
    return !vehicleExists ? <h1>Vehicle not found.</h1> : <h1>Loading...</h1>;
  }
}

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setVehicles,
    },
    dispatch
  );

const mapStateToProps = (state: RootState) => ({
  vehicles: state.vehicles.vehicles,
  isAdmin: state.user.isAdmin,
});

export default compose(
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps)
)(VehicleView) as any;
