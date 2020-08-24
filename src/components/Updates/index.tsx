// eslint-disable react-hooks/exhaustive-deps
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Card, CardDeck, Container, Spinner } from "react-bootstrap";
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
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!updates.length) {
      setLoading(true);
      firebase!.getUpdates().then((updates) => {
        setUpdates(updates);
        setLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!loading) {
    return (
      <Container fluid>
        <CardDeck>
          {updates
            .sort((u1, u2) =>
              u1.date === u2.date ? 0 : u1.date < u2.date ? 1 : -1
            )
            .map((update: Update, index: number) => (
              <Card key={index} style={{ minWidth: "300px" }} className="mb-2">
                <Card.Body>
                  <Card.Title className="pb-2 d-flex justify-content-between">
                    <span>Weekly Update</span>
                    {update.redditThread && (
                      <Button
                        variant="link"
                        href={
                          "https://reddit.com/r/gtaonline/comments/" +
                          update.redditThread
                        }
                        target="_blank"
                      >
                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                      </Button>
                    )}
                  </Card.Title>
                  {update.podium && (
                    <span>
                      <b>Podium Vehicle</b>
                      <br />
                      <ul>
                        <UpdateItemElement
                          key={update.podium.item.id}
                          item={update.podium}
                        />
                      </ul>
                    </span>
                  )}
                  {update.new.length !== 0 && (
                    <React.Fragment>
                      <b>New Content</b>
                      <ul>
                        {update.new.map((item: UpdateItem) => (
                          <UpdateItemElement key={item.item.id} item={item} />
                        ))}
                      </ul>
                    </React.Fragment>
                  )}
                  {update.sale.length !== 0 && (
                    <React.Fragment>
                      <b>Discounts</b>
                      <ul>
                        {update.sale.map((item: SaleItem) => (
                          <UpdateItemElement key={item.item.id} item={item} />
                        ))}
                      </ul>
                    </React.Fragment>
                  )}
                  {update.twitchPrime.length !== 0 && (
                    <React.Fragment>
                      <b>Twitch Prime Bonuses</b>
                      <ul>
                        {update.twitchPrime.map((item: SaleItem) => (
                          <UpdateItemElement key={item.item.id} item={item} />
                        ))}
                      </ul>
                    </React.Fragment>
                  )}
                  {update.targetedSale.length !== 0 && (
                    <React.Fragment>
                      <b>Targeted Sales</b>
                      <ul>
                        {update.targetedSale.map((item: SaleItem) => (
                          <UpdateItemElement key={item.item.id} item={item} />
                        ))}
                      </ul>
                    </React.Fragment>
                  )}
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
      </Container>
    );
  } else {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <Spinner
          animation="grow"
          className="p-4"
          variant="warning"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }
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
