import _ from "lodash";
import React from "react";
import { Col, Container, Form, Image, Spinner } from "react-bootstrap";
import { RouteComponentProps } from "react-router";
import Firebase, { withFirebase } from "../../Firebase";
import { Vehicle } from "../../models/vehicle";

interface VehicleEditMatch {
  id?: string;
}

interface VehicleEditProps extends RouteComponentProps<VehicleEditMatch> {
  firebase?: Firebase;
}

// tslint:disable-next-line: max-func-body-length
function VehicleEdit({ match, firebase }: VehicleEditProps) {
  const [vehicle, setVehicle] = React.useState<Vehicle | null>(null);
  const [vehicleExists, setVehicleExists] = React.useState(true);

  const saveVehicle = React.useCallback(
    _.debounce(() => {
      if (vehicle) {
        const { docRef, ...v } = vehicle;
        console.log("Saving vehicle:", v);
      }
    }, 500),
    []
  );

  React.useEffect(() => {
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
  }, []);

  const setValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVehicle({
      ...vehicle!!,
      [event.target.name]: event.target.value,
    });
    saveVehicle();
  };

  return (
    <Container fluid>
      {vehicle ? (
        <div>
          <h2>{vehicle.name}</h2>
          <Image
            src={vehicle.img}
            className="my-4"
            thumbnail
            style={{ maxHeight: "200px" }}
          />
          <Form className="mt-2">
            <Form.Row className="mb-2">
              <Form.Group as={Col}>
                <Form.Control
                  placeholder="Manufacturer"
                  name="manufacturer"
                  value={vehicle.manufacturer}
                  onChange={setValue}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Control
                  placeholder="Name"
                  name="name"
                  value={vehicle.name}
                  onChange={setValue}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row className="mb-2">
              <Form.Group as={Col}>
                <Form.Control
                  placeholder="Image"
                  name="img"
                  value={vehicle.img}
                  onChange={setValue}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row className="mb-2">
              <Form.Group as={Col}>
                <Form.Control
                  placeholder="Price"
                  name="price"
                  value={vehicle.price}
                  onChange={setValue}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Control
                  placeholder="Shop"
                  name="shop"
                  value={vehicle.shop}
                  onChange={setValue}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row className="mb-2">
              <Form.Group as={Col}>
                <Form.Control
                  placeholder="URL"
                  name="url"
                  value={vehicle.url}
                  onChange={setValue}
                />
              </Form.Group>
            </Form.Row>
          </Form>
          <div className="d-flex flex-row-reverse">
            <Spinner animation="border" role="status" className="mr-4 mt-2">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
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
