import firebase from "firebase";
import _ from "lodash";
import React from "react";
import { Container, Form, Spinner } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { bindActionCreators, compose, Dispatch } from "redux";
import Firebase, { withFirebase } from "../../Firebase";
import Update from "../../models/update";
import { Vehicle } from "../../models/vehicle";
import { RootState } from "../../store";
import { setUpdate, setUpdates } from "../../store/Updates";
import { setVehicles } from "../../store/Vehicles";
import "./UpdateEdit.scss";

const shops = [
  "Legendary Motorsports",
  "Arena War",
  "Southern San Andreas Super Autos",
  "Warstock Cache & Carry",
  "Benny's Original Motor Works",
];

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

class VehicleEdit extends React.Component<UpdateEditProps, UpdateEditState> {
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

  setValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      update: {
        ...this.state.update!!,
        [event.target.name]: event.target.value,
      },
    });
    this.saveUpdate();
  };

  saveUpdate = _.debounce(() => {
    if (this.state.update) {
      const { docRef, ...u } = this.state.update;

      this.setState({
        loading: true,
      });

      if (docRef) {
        docRef
          .update({
            new: u.new.map((i) => i.docRef),
            podium: u.podium?.docRef,
            sale: u.sale.map((i) => ({ item: i.docRef, amount: i.amount })),
            twitchPrime: u.twitchPrime.map((i) => ({
              item: i.docRef,
              amount: i.amount,
            })),
            date: firebase.firestore.Timestamp.fromDate(u.date),
          })
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
  }, 1000);

  // tslint:disable-next-line: max-func-body-length
  render() {
    const { update, updateExists, loading } = this.state;
    const { match } = this.props;

    return (
      <Container fluid>
        {update ? (
          <div>
            <h2>{update.date.toLocaleDateString()}</h2>
            <Form className="mt-2">Test.</Form>
            <DatePicker
              selected={update.date}
              onChange={(date: Date) => {
                this.setState({
                  update: {
                    ...update!,
                    date: date,
                  },
                });
                this.saveUpdate();
              }}
            />
            {loading && (
              <div className="d-flex flex-row-reverse">
                <Spinner animation="border" role="status" className="mr-4 mt-2">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              </div>
            )}
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
)(VehicleEdit) as any;
