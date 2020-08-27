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
import Snoowrap from "snoowrap";
import SearchInput, { SearchInputOption } from "../../components/SearchInput";
import Firebase, { withFirebase } from "../../Firebase";
import { Mission } from "../../models/mission";
import Update, {
  BonusActivity,
  SaleItem,
  UpdateItem
} from "../../models/update";
import { Vehicle } from "../../models/vehicle";
import { RootState } from "../../store";
import { setMissions } from "../../store/Missions";
import {
  getMissionsAsSearchInputOptions,
  getVehiclesAsSearchInputOptions
} from "../../store/selectors";
import { setUpdate, setUpdates } from "../../store/Updates";
import { setVehicles } from "../../store/Vehicles";
import UpdateActivityEditor from "./UpdateActivityEditor";
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
  vehicleSearchInputOptions: SearchInputOption[];
  setVehicles: typeof setVehicles;
  missions: Mission[];
  missionSearchInputOptions: SearchInputOption[];
  setMissions: typeof setMissions;
  redditClient: Snoowrap;
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
          bonusActivities: [],
          new: [],
          sale: [],
          targetedSale: [],
          twitchPrime: [],
          date: new Date(),
        },
      });
    }

    if (!this.props.vehicles.length) {
      this.props.firebase!.getVehicles().then(this.props.setVehicles);
    }

    if (!this.props.missions.length) {
      this.props.firebase!.getMissions().then(this.props.setMissions);
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
            (i: UpdateItem) => item.item.id !== i.item.id
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
            (i: UpdateItem) => item.item.id !== i.item.id
          ),
        ],
      },
    });
    this.debouncedSave();
  };

  setActivity = (activity: BonusActivity) => {
    this.setState({
      update: {
        ...this.state.update!,
        bonusActivities: [
          ...this.state.update!.bonusActivities.filter(
            (a: BonusActivity) => activity.activity.id !== a.activity.id
          ),
          activity,
        ],
      },
    });
    this.debouncedSave();
  };

  deleteActivity = (activity: BonusActivity) => {
    this.setState({
      update: {
        ...this.state.update!,
        bonusActivities: [
          ...this.state.update!.bonusActivities.filter(
            (a: BonusActivity) => activity.activity.id !== a.activity.id
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
        date: firebase.firestore.Timestamp.fromDate(u.date),
      };

      console.log(update);

      this.setState({
        loading: true,
      });

      const updateDoc = (resp: any) => {
        const id = resp.name
          ? resp.name.substring(3)
          : resp.json.data.things[0].id;

        if (docRef) {
          docRef!
            .update({
              ...update,
              redditThread: id,
            })
            .then(() => {
              const u = {
                ...this.state.update!!,
                redditThread: id,
              };
              this.setState({
                update: u,
                loading: false,
              });
              this.props.setUpdate(u);
            })
            .catch(console.error);
        } else {
          this.props.firebase?.db
            .collection("updates")
            .add({
              ...update,
              redditThread: id,
            })
            .then((ref: firebase.firestore.DocumentReference) => {
              const u = {
                ...this.state.update!!,
                redditThread: id,
                docRef: ref,
              };
              this.setState({
                update: u,
                loading: false,
              });
              this.props.setUpdate(u);
            })
            .catch(console.error);
        }
      };

      const getSaleString = (item: SaleItem) => {
        const getPriceString = (price: number, saleAmount: number) =>
          (price * (1 - saleAmount / 100)).toLocaleString("en-US");
        const priceString = item.tradePrice
          ? `(GTA$ ${getPriceString(
              item.price,
              item.amount
            )} / ${getPriceString(item.tradePrice, item.amount)})`
          : `(GTA$ ${getPriceString(item.price, item.amount)})`;
        return item.url
          ? ` - ${item.amount}% off ${item.name} ${priceString} [↗](${item.url})`
          : ` - ${item.amount}% off ${item.name} ${priceString}`;
      };

      if (this.props.redditClient) {
        const groups: string[] = [];

        if (update.new.length) {
          groups.push(
            "**New Content**\n\n" +
              u.new
                .map((item) =>
                  item.url
                    ? ` - ${item.name} [↗](${item.url})`
                    : ` - ${item.name}`
                )
                .join("\n\n")
          );
        }
        if (update.podium) {
          groups.push(
            "**Podium Vehicle**\n\n" +
              (update.podium.url
                ? ` - ${update.podium.name} [↗](${update.podium.url})`
                : ` - ${update.podium.name}`)
          );
        }
        if (update.bonusActivities.length) {
          groups.push(
            "**Bonus GTA$ and RP Activities**\n\n" +
              u.bonusActivities
                .map((activity) => {
                  const bonusString =
                    activity.moneyAmount === activity.rpAmount
                      ? activity.moneyAmount + "x GTA$ and RP"
                      : activity.moneyAmount +
                        "x GTA$ and " +
                        activity.rpAmount +
                        "x RP";

                  return (
                    " - " +
                    bonusString +
                    " on " +
                    (activity.url
                      ? `${activity.name} [↗](${activity.url})`
                      : `${activity.name}`)
                  );
                })
                .join("\n\n")
          );
        }
        if (update.sale.length) {
          groups.push(
            "**Discounted Content**\n\n" +
              u.sale.map(getSaleString).join("\n\n")
          );
        }
        if (update.twitchPrime.length) {
          groups.push(
            "**Twitch Prime Bonuses**\n\n" +
              u.twitchPrime.map(getSaleString).join("\n\n")
          );
        }
        if (update.targetedSale.length) {
          groups.push(
            "**Targeted Sales**\n\n" +
              u.targetedSale.map(getSaleString).join("\n\n")
          );
        }
        if (update.timeTrial) {
          groups.push(
            `**Time Trial**\n\n - [${update.timeTrial.name}](${update.timeTrial.url})`
          );
        }
        if (update.rcTimeTrial) {
          groups.push(
            `**RC Bandito Time Trial**\n\n - [${update.rcTimeTrial.name}](${update.rcTimeTrial.url})`
          );
        }
        if (update.premiumRace) {
          groups.push(
            `**Premium Race**\n\n - [${update.premiumRace.name}](${update.premiumRace.url})`
          );
        }

        groups.push(
          "View embedded updates [here](https://gtaonline-cf0ea.web.app/)."
        );

        if (!update.redditThread) {
          this.props.redditClient
            .submitSelfpost({
              subredditName: "gtaonline",
              title: `${u.date.toLocaleDateString(
                "en-us"
              )} Weekly GTA Online Bonuses`,
              text: groups.join("\n\n"),
            })
            .then(updateDoc);
        } else {
          this.props.redditClient
            .getSubmission(update.redditThread)
            .fetch()
            .then((s) => {
              s.edit(groups.join("\n\n")).then(updateDoc);
            });
        }
      }
    }
  }, 2000);

  debouncedSave = _.debounce(this.saveUpdate, 5000);

  // tslint:disable-next-line: max-func-body-length
  render() {
    const { update, updateExists, loading } = this.state;
    const {
      match,
      vehicleSearchInputOptions,
      missionSearchInputOptions,
    } = this.props;

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
                    options={vehicleSearchInputOptions}
                    selected={
                      update.podium && {
                        label: update.podium?.name,
                        value: update.podium,
                        id: update.podium.item.id,
                      }
                    }
                    onSelect={(option) => {
                      this.setValue("podium", option.value);
                    }}
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" sm="12">
                  <Form.Label>New</Form.Label>
                  <SearchInput
                    multi
                    options={vehicleSearchInputOptions}
                    onSelect={(option) => this.setItem("new", option.value)}
                  />
                  <ListGroup className="mt-2">
                    {this.state.update?.new?.map((i) => (
                      <UpdateItemEditor
                        item={i}
                        key={i.item!.id}
                        setItem={(item) => this.setItem("new", item)}
                        deleteItem={() => this.deleteItem("new", i)}
                      />
                    ))}
                  </ListGroup>
                </Form.Group>
              </Form.Row>
              <Form.Row className="my-2">
                <Form.Group as={Col} md="6" sm="12">
                  <Form.Label>Bonus GTA$ and RP Activities</Form.Label>
                  <SearchInput
                    multi
                    options={missionSearchInputOptions}
                    onSelect={(option) => this.setActivity(option.value)}
                  />
                  <ListGroup className="mt-2">
                    {this.state.update?.bonusActivities?.map((a) => (
                      <UpdateActivityEditor
                        activity={a}
                        key={a.activity!.id}
                        setActivity={this.setActivity}
                        deleteActivity={() => this.deleteActivity(a)}
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
                    options={vehicleSearchInputOptions}
                    onSelect={(option) =>
                      this.setItem("sale", { ...option.value, amount: 10 })
                    }
                  />
                  <ListGroup className="mt-2">
                    {this.state.update?.sale?.map((i) => (
                      <UpdateItemEditor
                        item={i}
                        sale
                        key={i.item!.id}
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
                    options={vehicleSearchInputOptions}
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
                        key={i.item!.id}
                        setItem={(item) => this.setItem("twitchPrime", item)}
                        deleteItem={() => this.deleteItem("twitchPrime", i)}
                      />
                    ))}
                  </ListGroup>
                </Form.Group>
              </Form.Row>
              <Form.Row className="my-2">
                <Form.Group as={Col} md="6" sm="12">
                  <Form.Label>Targeted Sales</Form.Label>
                  <SearchInput
                    multi
                    options={vehicleSearchInputOptions}
                    onSelect={(option) =>
                      this.setItem("targetedSale", {
                        ...option.value,
                        amount: 10,
                      })
                    }
                  />
                  <ListGroup className="mt-2">
                    {this.state.update?.targetedSale?.map((i) => (
                      <UpdateItemEditor
                        item={i}
                        sale
                        key={i.item!.id}
                        setItem={(item) => this.setItem("targetedSale", item)}
                        deleteItem={() => this.deleteItem("targetedSale", i)}
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
      setMissions,
    },
    dispatch
  );

const mapStateToProps = (state: RootState) => ({
  updates: state.updates.updates,
  vehicles: state.vehicles.vehicles,
  vehicleSearchInputOptions: getVehiclesAsSearchInputOptions(state),
  missions: state.missions.missions,
  missionSearchInputOptions: getMissionsAsSearchInputOptions(state),
  redditClient: state.reddit.redditClient,
});

export default compose(
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps)
)(UpdateEdit) as any;
