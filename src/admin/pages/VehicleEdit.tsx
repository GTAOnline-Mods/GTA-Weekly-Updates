import React from "react";
import { Container, Image } from "react-bootstrap";
import { RouteComponentProps } from "react-router";
import Firebase, { withFirebase } from "../../Firebase";
import { Vehicle } from "../../models/vehicle";

interface VehicleEditMatch {
  id?: string;
}

interface VehicleEditProps extends RouteComponentProps<VehicleEditMatch> {
  firebase?: Firebase;
}

function VehicleEdit({ match, firebase }: VehicleEditProps) {
  const [vehicle, setVehicle] = React.useState<Vehicle | null>(null);
  const [vehicleExists, setVehicleExists] = React.useState(true);

  if (match.params.id) {
    firebase?.db
      .collection("vehicles")
      .doc(match.params.id)
      .get()
      .then((docSnapshot: firebase.firestore.DocumentSnapshot) => {
        if (docSnapshot.exists) {
          setVehicle(docSnapshot.data() as Vehicle);
        } else {
          setVehicleExists(false);
        }
      });
  } else {
    setVehicle({
      name: "",
    });
  }

  return (
    <Container fluid>
      {vehicle ? (
        <div>
          <h2>{vehicle.name}</h2>
          <Image src={vehicle.img} thumbnail style={{ maxHeight: "200px" }} />
        </div>
      ) : match.params.id && !vehicleExists ? (
        <div>
          <h2>Vehicle not found.</h2>
        </div>
      ) : null}
    </Container>
  );
}

export default withFirebase(VehicleEdit);
