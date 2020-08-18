import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import firebase from "firebase";
import React from "react";
import { Button, Container, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import Firebase, { withFirebase } from "../../Firebase";
import { Vehicle } from "../../models/vehicle";

interface VehiclesProps {
  firebase?: Firebase;
}

function Vehicles({ firebase }: VehiclesProps) {
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);

  React.useEffect(() => {
    firebase?.db
      .collection("vehicles")
      .get()
      .then((querySnapshot: firebase.firestore.QuerySnapshot) => {
        const v: Vehicle[] = [];
        querySnapshot.forEach((doc: firebase.firestore.DocumentSnapshot) =>
          v.push({
            ...(doc.data() as Vehicle),
            docRef: doc.ref,
          })
        );
        setVehicles(v);
      });
  }, []);

  return (
    <Container fluid className="p-2">
      <h1>Vehicles</h1>
      <br />
      <ListGroup>
        {vehicles.map((vehicle) => (
          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            {vehicle.name}
            <Button
              variant="link"
              as={Link}
              to={"/admin/vehicles/edit/" + vehicle.docRef?.id}
            >
              <FontAwesomeIcon icon={faEdit} />
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <br />
      <div className="d-flex flex-row-reverse">
        <Button variant="link" as={Link} to="/admin/vehicles/edit">
          Add
        </Button>
      </div>
    </Container>
  );
}

export default withFirebase(Vehicles);
