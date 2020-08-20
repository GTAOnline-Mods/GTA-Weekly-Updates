import firebase from "firebase";
import _ from "lodash";
import React from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  InputGroup,
  ListGroup,
  Spinner
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { bindActionCreators, compose, Dispatch } from "redux";
import SearchInput from "../../components/SearchInput";
import Firebase, { withFirebase } from "../../Firebase";
import Update, { SaleItem, UpdateItem } from "../../models/update";
import { Vehicle } from "../../models/vehicle";
import { RootState } from "../../store";
import { setUpdate, setUpdates } from "../../store/Updates";
import { setVehicles } from "../../store/Vehicles";
import "./UpdateEdit.scss";
import UpdateItemEditor from "./UpdateItemEditor";

interface UpdateEditMatch {
  id?: string;
}

interface UpdateEditProps extends RouteComponentProps<UpdateEditMatch> {
  firebase?: Firebase;
  updates: Update[];
  setUpdate: typeof setUpdate;
  setUpdates: typeof setUpdates;
  vehicles: Vehicle[];
  setVehicles: typeof setVehicles;
}

interface UpdateEditState {
  update?: Update;
  updateExists: boolean;
  loading: boolean;
}

class UpdateEdit extends React.Component<UpdateEditProps, UpdateEditState> {
  constructor(props: UpdateEditProps) {
    super(props);

    this.state = {
      updateExists: true,
      loading: false,
    };
  }

  async componentDidMount() {
    if (this.props.match.params.id) {
      if (!this.props.updates.length) {
        const u = await this.props.firebase!.getUpdates();
        this.props.setUpdates(u);
      }

      const update = this.props.updates.filter(
        (u) => u.docRef?.id === this.props.match.params.id
      );

      if (update.length) {
        this.setState({
          update: update[0],
        });
      } else {
        this.setState({
          updateExists: false,
        });
        return;
      }
    } else {
      this.setState({
        update: {
          new: [],
          sale: [],
          twitchPrime: [],
          date: new Date(),
        },
      });
    }

    if (!this.props.vehicles.length) {
      const v = await this.props.firebase!.getVehicles();
      this.props.setVehicles(v);
    }
  }

  setValue = (name: string, value: any) => {
    this.setState({
      update: {
        ...this.state.update!!,
        [name]: value,
      },
    });
    this.debouncedSave();
  };

  setDate = (date: Date) => {
    this.setState({
      update: {
        ...this.state.update!,
        date,
      },
    });
    this.debouncedSave();
  };

  setItem = (key: keyof Update, item: UpdateItem | SaleItem) => {
    this.setState({
      update: {
        ...this.state.update!,
        [key]: [
          ...this.state.update![key].filter(
            (i: UpdateItem) => item.id !== i.id
          ),
          item,
        ],
      },
    });
    this.debouncedSave();
  };

  deleteItem = (key: keyof Update, item: UpdateItem | SaleItem) => {
    this.setState({
      update: {
        ...this.state.update!,
        [key]: [
          ...this.state.update![key].filter(
            (i: UpdateItem) => item.id !== i.id
          ),
        ],
      },
    });
    this.debouncedSave();
  };

  saveUpdate = _.throttle(() => {
    if (this.state.update) {
      const { docRef, ...u } = this.state.update;

      const update = {
        ...u,
        new: [...u.new.map((i) => i.docRef)],
        podium: u.podium?.docRef || null,
        sale: [...u.sale.map((i) => ({ item: i.docRef, amount: i.amount }))],
        twitchPrime: [
          ...u.twitchPrime.map((i) => ({
            item: i.docRef,
            amount: i.amount,
          })),
        ],
        date: firebase.firestore.Timestamp.fromDate(u.date),
      };

      this.setState({
        loading: true,
      });

      if (docRef) {
        docRef!
          .update(update)
          .then(() => {
            this.props.setUpdate(this.state.update!!);
            this.setState({
              loading: false,
            });
          })
          .catch(console.error);
      } else {
        this.props.firebase?.db
          .collection("updates")
          .add({
            ...u,
            date: firebase.firestore.Timestamp.fromDate(u.date),
          })
          .then((ref: firebase.firestore.DocumentReference) => {
            const u = {
              ...this.state.update!!,
              docRef: ref,
            };
            this.setState({
              update: u,
            });
            this.props.setUpdate(u);
          })
          .catch(console.error);
      }
    }
  }, 2000);

  debouncedSave = _.debounce(this.saveUpdate, 5000);

  // tslint:disable-next-line: max-func-body-length
  render() {
    const { update, updateExists, loading } = this.state;
    const { match, vehicles } = this.props;

    return (
      <Container fluid>
        {update ? (
          <div>
            <h1 className="pb-4 mb-4">{update.date.toLocaleDateString()}</h1>
            <Form className="mt-4 pt-4" onSubmit={(e) => e.preventDefault()}>
              <DatePicker
                className="mb-2 mt-4"
                selected={update.date}
                onChange={this.setDate}
              />
              <Form.Row className="my-2">
                <Form.Group as={Col} md="6" sm="12">
                  <Form.Label>Podium</Form.Label>
                  <SearchInput
                    options={vehicles.map((v) => ({
                      label: `${v.manufacturer} ${v.name}`,
                      value: v,
                      id: v.docRef!.id,
                    }))}
                    onSelect={(option) => {
                      this.setValue("podium", option.value);
                    }}
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" sm="12">
                  <Form.Label>New</Form.Label>
                  <SearchInput
                    multi
                    options={vehicles.map((v) => ({
                      label: v.name,
                      value: v,
                      id: v.docRef!.id,
                    }))}
                    onSelect={(option) => this.setItem("new", option.value)}
                  />
                  <ListGroup className="mt-2">
                    {this.state.update?.new?.map((i) => (
                      <UpdateItemEditor
                        item={i}
                        key={i.docRef!.id}
                        setItem={(item) => this.setItem("new", item)}
                        deleteItem={() => this.deleteItem("new", i)}
                      />
                    ))}
                  </ListGroup>
                </Form.Group>
              </Form.Row>
              <Form.Row className="my-2">
                <Form.Group as={Col} md="6" sm="12">
                  <Form.Label>Sale</Form.Label>
                  <SearchInput
                    multi
                    options={vehicles.map((v) => ({
                      label: `${v.manufacturer} ${v.name}`,
                      value: v,
                      id: v.docRef!.id,
                    }))}
                    onSelect={(option) =>
                      this.setItem("sale", { ...option.value, amount: 10 })
                    }
                  />
                  <ListGroup className="mt-2">
                    {this.state.update?.sale?.map((i) => (
                      <UpdateItemEditor
                        item={i}
                        sale
                        key={i.docRef!.id}
                        setItem={(item) => this.setItem("sale", item)}
                        deleteItem={() => this.deleteItem("sale", i)}
                      />
                    ))}
                  </ListGroup>
                </Form.Group>
                <Form.Group as={Col} md="6" sm="12">
                  <Form.Label>Twitch Prime</Form.Label>
                  <SearchInput
                    multi
                    options={vehicles.map((v) => ({
                      label: `${v.manufacturer} ${v.name}`,
                      value: v,
                      id: v.docRef!.id,
                    }))}
                    onSelect={(option) =>
                      this.setItem("twitchPrime", {
                        ...option.value,
                        amount: 10,
                      })
                    }
                  />
                  <ListGroup className="mt-2">
                    {this.state.update?.twitchPrime?.map((i) => (
                      <UpdateItemEditor
                        item={i}
                        sale
                        key={i.docRef!.id}
                        setItem={(item) => this.setItem("twitchPrime", item)}
                        deleteItem={() => this.deleteItem("twitchPrime", i)}
                      />
                    ))}
                  </ListGroup>
                </Form.Group>
              </Form.Row>
              <Form.Label>Featured Content</Form.Label>
              <Form.Row className="my-2">
                <Form.Group as={Col} md="6" sm="12">
                  <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text>Time Trial</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      value={update.timeTrial?.name}
                      placeholder="Name"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        this.setValue("timeTrial", {
                          ...update.timeTrial,
                          name: event.target.value,
                        })
                      }
                    />
                    <FormControl
                      value={update.timeTrial?.parTime}
                      placeholder="Par Time"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        this.setValue("timeTrial", {
                          ...update.timeTrial,
                          parTime: event.target.value,
                        })
                      }
                    />
                    <FormControl
                      value={update.timeTrial?.url}
                      placeholder="URL"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        this.setValue("timeTrial", {
                          ...update.timeTrial,
                          url: event.target.value,
                        })
                      }
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="6" sm="12">
                  <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text>RC Time Trial</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      value={update.rcTimeTrial?.name}
                      placeholder="Name"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        this.setValue("rcTimeTrial", {
                          ...update.rcTimeTrial,
                          name: event.target.value,
                        })
                      }
                    />
                    <FormControl
                      value={update.rcTimeTrial?.parTime}
                      placeholder="Par Time"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        this.setValue("rcTimeTrial", {
                          ...update.rcTimeTrial,
                          parTime: event.target.value,
                        })
                      }
                    />
                    <FormControl
                      value={update.rcTimeTrial?.url}
                      placeholder="URL"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        this.setValue("rcTimeTrial", {
                          ...update.rcTimeTrial,
                          url: event.target.value,
                        })
                      }
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="6" sm="12">
                  <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text>Premium Race</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      value={update.premiumRace?.url}
                      placeholder="Name"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        this.setValue("premiumRace", {
                          ...update.premiumRace,
                          name: event.target.value,
                        })
                      }
                    />
                    <FormControl
                      value={update.premiumRace?.url}
                      placeholder="URL"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        this.setValue("premiumRace", {
                          ...update.premiumRace,
                          url: event.target.value,
                        })
                      }
                    />
                  </InputGroup>
                </Form.Group>
              </Form.Row>
            </Form>

            <div className="d-flex flex-row-reverse">
              <Button onClick={this.saveUpdate} className="rockstar-yellow">
                Save
              </Button>
              {loading && (
                <Spinner animation="border" role="status" className="mr-4 mt-2">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              )}
            </div>
          </div>
        ) : match.params.id && !updateExists ? (
          <div>
            <h2>Update not found.</h2>
          </div>
        ) : null}
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setUpdate,
      setUpdates,
      setVehicles,
    },
    dispatch
  );

const mapStateToProps = (state: RootState) => ({
  updates: state.updates.updates,
  vehicles: state.vehicles.vehicles,
});

export default compose(
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps)
)(UpdateEdit) as any;
