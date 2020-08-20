// eslint-disable react-hooks/exhaustive-deps
import React from "react";
import { Card, CardDeck } from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators, compose, Dispatch } from "redux";
import Firebase, { withFirebase } from "../../Firebase";
import Update, { SaleItem, UpdateItem } from "../../models/update";
import { RootState } from "../../store";
import { setUpdates } from "../../store/Updates";
import UpdateItemElement from "./UpdateItemElement";

interface UpdatesProps {
  firebase?: Firebase;
  updates: Update[];
  setUpdates: typeof setUpdates;
}

const Updates = ({ firebase, updates, setUpdates }: UpdatesProps) => {
  React.useEffect(() => {
    if (!updates || updates.length === 0) {
      firebase!.getUpdates().then(setUpdates);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CardDeck>
      {updates
        .sort((u1, u2) =>
          u1.date === u2.date ? 0 : u1.date < u2.date ? 1 : -1
        )
        .map((update: Update, index: number) => (
          <Card key={index}>
            <Card.Body>
              <Card.Title className="pb-2">Weekly Update</Card.Title>
              {update.podium && (
                <span>
                  <b>Podium Vehicle</b>
                  <br />
                  <ul>
                    <UpdateItemElement
                      key={update.podium.id}
                      item={update.podium}
                    />
                  </ul>
                </span>
              )}
              {update.new.length ? <b>New Content</b> : ""}
              <ul>
                {update.new.map((item: UpdateItem) => (
                  <UpdateItemElement key={item.id} item={item} />
                ))}
              </ul>
              {update.sale.length ? <b>Discounts</b> : ""}
              <ul>
                {update.sale.map((item: SaleItem) => (
                  <UpdateItemElement key={item.id} item={item} />
                ))}
              </ul>
              {update.twitchPrime.length ? <b>Twitch Prime Bonuses</b> : ""}
              <ul>
                {update.twitchPrime.map((item: SaleItem) => (
                  <UpdateItemElement key={item.id} item={item} />
                ))}
              </ul>
              {update.timeTrial && (
                <div>
                  <p>
                    <b>Time Trial</b>
                    <br />
                    <a
                      href={update.timeTrial.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {update.timeTrial.name}, Par Time{" "}
                      {update.timeTrial.parTime}
                    </a>
                  </p>
                </div>
              )}
              {update.rcTimeTrial && (
                <div>
                  <p>
                    <b>RC Bandito Time Trial</b>
                    <br />
                    <a
                      href={update.rcTimeTrial.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {update.rcTimeTrial.name}, Par Time{" "}
                      {update.rcTimeTrial.parTime}
                    </a>
                  </p>
                </div>
              )}
              {update.premiumRace && (
                <div>
                  <p>
                    <b>Premium Race</b>
                    <br />
                    <a
                      href={update.premiumRace.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {update.premiumRace.name}
                    </a>
                  </p>
                </div>
              )}
            </Card.Body>
            <Card.Footer>
              <small className="text-muted">
                {update.date.toLocaleDateString()}
              </small>
            </Card.Footer>
          </Card>
        ))}
    </CardDeck>
  );
};

const mapStateToProps = (state: RootState) => ({
  updates: state.updates.updates,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setUpdates,
    },
    dispatch
  );

export default compose(
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps)
)(Updates) as any;
