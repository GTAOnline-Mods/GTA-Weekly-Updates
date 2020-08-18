import _ from "lodash";
import React from "react";
import { Col, Container, Form, Image, Spinner } from "react-bootstrap";
import { RouteComponentProps } from "react-router";
import Firebase, { withFirebase } from "../../Firebase";
import { Vehicle } from "../../models/vehicle";

const shops = [
  "Legendary Motorsports",
  "Arena War",
  "Southern San Andreas Super Autos",
  "Warstock Cache & Carry",
  "Benny's Original Motor Works",
];

interface VehicleEditMatch {
  id?: string;
}

interface VehicleEditProps extends RouteComponentProps<VehicleEditMatch> {
  firebase?: Firebase;
}

interface VehicleEditState {
  vehicle?: Vehicle;
  vehicleExists: boolean;
  loading: boolean;
}

class VehicleEdit extends React.Component<VehicleEditProps, VehicleEditState> {
  constructor(props: VehicleEditProps) {
    super(props);

    this.state = {
      vehicleExists: true,
      loading: false,
    };
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      this.props.firebase?.db
        .collection("vehicles")
        .doc(this.props.match.params.id)
        .get()
        .then((docSnapshot: firebase.firestore.DocumentSnapshot) => {
          if (docSnapshot.exists) {
            this.setState({
              vehicle: {
                ...(docSnapshot.data() as Vehicle),
                docRef: docSnapshot.ref,
              },
            });
          } else {
            this.setState({
              vehicleExists: false,
            });
          }
        });
    } else {
      this.setState({
        vehicle: { name: "" },
      });
    }
  }

  setValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      vehicle: {
        ...this.state.vehicle!!,
        [event.target.name]: event.target.value,
      },
    });
    this.saveVehicle();
  };

  saveVehicle = _.debounce(() => {
    if (this.state.vehicle) {
      const { docRef, ...v } = this.state.vehicle;

      this.setState({
        loading: true,
      });

      if (docRef) {
        docRef
          .update(v)
          .then(() => {
            this.setState({
              loading: false,
            });
          })
          .catch(console.error);
      } else {
        this.props.firebase?.db
          .collection("vehicles")
          .add(v)
          .then((ref: firebase.firestore.DocumentReference) => {
            this.setState({
              vehicle: {
                ...this.state.vehicle!!,
                docRef: ref,
              },
            });
          })
          .catch(console.error);
      }
    }
  }, 1000);

  render() {
    const { vehicle, vehicleExists, loading } = this.state;
    const { match } = this.props;

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
                    onChange={this.setValue}
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Control
                    placeholder="Name"
                    name="name"
                    value={vehicle.name}
                    onChange={this.setValue}
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row className="mb-2">
                <Form.Group as={Col}>
                  <Form.Control
                    placeholder="Image"
                    name="img"
                    value={vehicle.img}
                    onChange={this.setValue}
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row className="mb-2">
                <Form.Group as={Col}>
                  <Form.Control
                    placeholder="Price"
                    name="price"
                    value={vehicle.price}
                    onChange={this.setValue}
                    type="number"
                  />
                </Form.Group>
                <Col>
                  <Form.Group className="d-flex align-items-center">
                    <Form.Label className="m-0 px-4">Shop</Form.Label>
                    <Form.Control
                      as="select"
                      name="shop"
                      value={vehicle.shop}
                      onChange={this.setValue}
                    >
                      {shops.map((shop, index) => (
                        <option
                          key={index}
                          value={shop}
                          aria-selected={shop === vehicle.shop}
                        >
                          {shop}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Form.Row>
              <Form.Row className="mb-2">
                <Form.Group as={Col}>
                  <Form.Control
                    placeholder="URL"
                    name="url"
                    value={vehicle.url}
                    onChange={this.setValue}
                  />
                </Form.Group>
              </Form.Row>
            </Form>
            {loading && (
              <div className="d-flex flex-row-reverse">
                <Spinner animation="border" role="status" className="mr-4 mt-2">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              </div>
            )}
          </div>
        ) : match.params.id && !vehicleExists ? (
          <div>
            <h2>Vehicle not found.</h2>
          </div>
        ) : null}
      </Container>
    );
  }
}

export default withFirebase(VehicleEdit);
