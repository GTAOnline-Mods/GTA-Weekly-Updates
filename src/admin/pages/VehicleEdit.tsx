import firebase from "firebase";
import _ from "lodash";
import React from "react";
import { Button, Col, Container, Form, Image, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { bindActionCreators, compose, Dispatch } from "redux";
import Firebase, { withFirebase } from "../../Firebase";
import { Vehicle } from "../../models/vehicle";
import { RootState } from "../../store";
import { setVehicle, setVehicles } from "../../store/Vehicles";

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
  vehicles: Vehicle[];
  setVehicle: typeof setVehicle;
  setVehicles: typeof setVehicles;
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

  async componentDidMount() {
    if (this.props.match.params.id) {
      if (!this.props.vehicles.length) {
        const v = await this.props.firebase!.getVehicles();
        this.props.setVehicles(v);
      }

      const vehicle = this.props.vehicles.filter(
        (v) => v.docRef?.id === this.props.match.params.id
      );

      if (vehicle.length) {
        this.setState({
          vehicle: vehicle[0],
        });
      } else {
        this.setState({
          vehicleExists: false,
        });
      }
    } else {
      this.setState({
        vehicle: { name: "" },
      });
    }
  }

  setValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = event.target;

    this.setState({
      vehicle: {
        ...this.state.vehicle!!,
        [name]: type === "number" ? parseInt(value) : value,
      },
    });
    this.debouncedSave();
  };

  saveVehicle = _.throttle(() => {
    if (this.state.vehicle) {
      const { docRef, id, ...v } = this.state.vehicle;

      this.setState({
        loading: true,
      });

      if (docRef) {
        docRef
          .update(v)
          .then(() => {
            this.props.setVehicle(this.state.vehicle!!);
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
            const v = {
              ...this.state.vehicle!!,
              docRef: ref,
              id: ref.id,
            };
            this.setState({
              vehicle: v,
            });
            this.props.setVehicle(v);
          })
          .catch(console.error);
      }
    }
  }, 5000);

  debouncedSave = _.debounce(this.saveVehicle, 2000);

  render() {
    const { vehicle, vehicleExists, loading } = this.state;
    const { match } = this.props;

    return (
      <Container fluid>
        {vehicle ? (
          <div>
            <h2 className="pricedown">{vehicle.manufacturer}</h2>
            <h1>{vehicle.name}</h1>

            <Image
              src={vehicle.img}
              className="my-4"
              thumbnail
              style={{ maxHeight: "200px" }}
            />

            <Form className="mt-2" onSubmit={(e) => e.preventDefault()}>
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
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <Form.Label className="m-0 px-4">Price</Form.Label>
                    <Form.Control
                      placeholder="Price"
                      className="w-75"
                      name="price"
                      value={vehicle.price}
                      onChange={this.setValue}
                      type="number"
                    />
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <Form.Label className="m-0 px-4">Trade Price</Form.Label>
                    <Form.Control
                      placeholder="Trade Price"
                      className="w-75"
                      name="tradePrice"
                      value={vehicle.tradePrice}
                      onChange={this.setValue}
                      type="number"
                    />
                  </div>
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
            <div className="d-flex flex-row-reverse">
              <Button onClick={this.saveVehicle} className="rockstar-yellow">
                Save
              </Button>
              {loading && (
                <Spinner animation="border" role="status" className="mr-4 mt-2">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              )}
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
}

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setVehicle,
      setVehicles,
    },
    dispatch
  );

const mapStateToProps = (state: RootState) => ({
  vehicles: state.vehicles.vehicles,
});

export default compose(
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps)
)(VehicleEdit) as any;
