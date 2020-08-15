// eslint-disable react-hooks/exhaustive-deps
import React from "react";
import { Card, CardDeck } from "react-bootstrap";
import { connect, useDispatch } from "react-redux";
import { compose } from "redux";
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
  const dispatch = useDispatch();

  React.useEffect(() => {
    async function getUpdates() {
      const u = await firebase!.getUpdates();
      dispatch(setUpdates(u));
    }
    if (!updates || updates.length === 0) {
      getUpdates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CardDeck>
      {updates.map((update: Update, index: number) => (
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

const mapDispatchToProps = { setUpdates };

// tslint:disable-next-line: export-name
export default compose(
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps)
)(Updates) as any;
