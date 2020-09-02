import firebase from "firebase/app";
import _ from "lodash";
import React from "react";
import { Button, Col, Container, Form, Image, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { bindActionCreators, compose, Dispatch } from "redux";
import Firebase, { withFirebase } from "../../Firebase";
import { Vehicle } from "../../models/vehicle";
import { RootState } from "../../store";
import { setVehicle } from "../../store/Vehicles";

const shops = [
  "Legendary Motorsports",
  "Arena War",
  "Southern San Andreas Super Autos",
  "Warstock Cache & Carry",
  "Benny's Original Motor Works",
  "DockTease",
];

interface VehicleEditMatch {
  id?: string;
}

interface VehicleEditProps extends RouteComponentProps<VehicleEditMatch> {
  firebase?: Firebase;
  vehicles: Vehicle[];
  setVehicle: typeof setVehicle;
}

interface VehicleEditState {
  vehicle?: Vehicle;
  vehicleExists: boolean;
  vehicleAlreadyExists: boolean;
  loading: boolean;
}

class VehicleEdit extends React.Component<VehicleEditProps, VehicleEditState> {
  constructor(props: VehicleEditProps) {
    super(props);

    this.state = {
      vehicleExists: true,
      loading: false,
      vehicleAlreadyExists: false,
    };
  }

  async componentDidMount() {
    if (this.props.match.params.id) {
      const v = this.props.vehicles.filter(
        (v) => v.docRef?.id === this.props.match.params.id
      );

      if (v.length) {
        this.setState({
          vehicle: v[0],
        });
      } else {
        const v = await this.props.firebase!.getVehicle(
          this.props.match.params.id
        );

        if (v) {
          this.props.setVehicle(v);
          this.setState({
            vehicle: v,
          });
        } else {
          this.setState({
            vehicleExists: false,
          });
        }
      }
    } else {
      this.setState({
        vehicle: { name: "", shop: shops[0], manufacturer: "" },
      });
    }
  }

  setValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = event.target;

    if (name === "name") {
      const v = this.props.vehicles.filter((_v) => _v.name === value);
      if (v.length) {
        this.setState({
          vehicleAlreadyExists: true,
        });
      }
    }

    this.setState({
      vehicle: {
        ...this.state.vehicle!!,
        [name]: type === "number" && value ? parseInt(value) : value,
      },
    });
    this.debouncedSave();
  };

  saveVehicle = _.throttle(() => {
    if (this.state.vehicle) {
      const { docRef, ...v } = this.state.vehicle;

      if (!this.state.vehicle.name || !this.state.vehicle.price) {
        return;
      }

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
  }, 250);

  debouncedSave = _.debounce(this.saveVehicle, 250);

  render() {
    const {
      vehicle,
      vehicleExists,
      loading,
      vehicleAlreadyExists,
    } = this.state;
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
                  <Form.Label>Manufacturer</Form.Label>
                  <Form.Control
                    placeholder="Manufacturer"
                    name="manufacturer"
                    value={vehicle.manufacturer}
                    onChange={this.setValue}
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Name *</Form.Label>
                  <Form.Control
                    placeholder="Name"
                    name="name"
                    value={vehicle.name}
                    onChange={this.setValue}
                  />
                  {vehicleAlreadyExists && (
                    <Form.Text className="text-danger">
                      This vehicle name is already in use, make sure the entry
                      doesn't already exist.
                    </Form.Text>
                  )}
                </Form.Group>
              </Form.Row>
              <Form.Row className="mb-2">
                <Form.Group as={Col}>
                  <Form.Label>Image</Form.Label>
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
                    <Form.Label className="m-0 px-4">Price *</Form.Label>
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
                  <Form.Label>URL</Form.Label>
                  <Form.Control
                    placeholder="URL"
                    name="url"
                    value={vehicle.url}
                    onChange={this.setValue}
                  />
                </Form.Group>
              </Form.Row>
            </Form>
            <div className="d-flex flex-row-reverse align-items-center">
              <Button onClick={this.saveVehicle} className="rockstar-yellow">
                Save
              </Button>
              {loading && (
                <Spinner animation="border" role="status" className="mr-4 mt-2">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              )}
              <span className="text-muted mr-auto">
                Fields marked with * are required.
              </span>
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
