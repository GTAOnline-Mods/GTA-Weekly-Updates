// eslint-disable react-hooks/exhaustive-deps
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Card, Container, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators, compose, Dispatch } from "redux";
import Firebase, { withFirebase } from "../../Firebase";
import Update, {
  BonusActivity,
  SaleItem,
  UpdateItem
} from "../../models/update";
import { RootState } from "../../store";
import { setUpdates } from "../../store/Updates";
import UpdateActivityElement from "./UpdateActivityElement";
import UpdateItemElement from "./UpdateItemElement";
import "./index.scss";

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
      <Container className="updates justify-content-center p-0">
        <div className="background" />
        {updates
          .sort((u1, u2) =>
            u1.date === u2.date ? 0 : u1.date < u2.date ? 1 : -1
          )
          .map((update: Update, index: number) => (
            <Card
              className="update"
              key={index}
              data-aos="zoom-in-up"
              data-aos-duration="400"
            >
              <Card.Header
                className="update-title"
              >
                  <span
                    className="update-title__topic text-muted"
                  >
                    Weekly Update
                  </span>
                  <span
                    className="update-title__date"
                  >
                    {update.date.toLocaleString('default', { 
                      month: 'long', day: 'numeric', year: 'numeric' 
                    })}
                  </span>
                  <span
                    className="update-title__link"
                  >
                    {update.redditThread && (
                      <Button
                        variant="link"
                        href={
                          "https://reddit.com/r/gtaonline/comments/" +
                          update.redditThread
                        }
                        target="_blank"
                      >
                        <span
                          className="update-title__link--text"
                        >
                          /r/gtaonline
                        </span>
                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                      </Button>
                    )}
                  </span>
              </Card.Header>
              <Card.Body>
                {update.podium && (
                  <section className="update-section update-section__podium-vehicle">
                    <b>Podium Vehicle</b>
                    <br />
                    <ul className="update-item-list">
                      <UpdateItemElement
                        key={update.podium.item.id}
                        item={update.podium}
                      />
                    </ul>
                  </section>
                )}
                {update.new.length !== 0 && (
                  <section className="update-section update-section__new-content">
                    <b>New Content</b>
                    <ul className="update-item-list">
                      {update.new.map((item: UpdateItem) => (
                        <UpdateItemElement key={item.item.id} item={item} />
                      ))}
                    </ul>
                  </section>
                )}
                {update.bonusActivities.length !== 0 && (
                  <section className="update-section update-section__bonus-activites">
                    <b>Bonus GTA$ and RP Activities</b>
                    <ul className="update-item-list">
                      {update.bonusActivities.map((activity: BonusActivity) => (
                        <UpdateActivityElement
                          key={activity.activity.id}
                          activity={activity}
                        />
                      ))}
                    </ul>
                  </section>
                )}
                {update.sale.length !== 0 && (
                  <section className="update-section update-section__discounts">
                    <b>Discounts</b>
                    <ul className="update-item-list">
                      {update.sale.map((item: SaleItem) => (
                        <UpdateItemElement key={item.item.id} item={item} />
                      ))}
                    </ul>
                  </section>
                )}
                {update.twitchPrime.length !== 0 && (
                  <section className="update-section update-section__twitch-prime">
                    <b>Twitch Prime Bonuses</b>
                    <ul className="update-item-list">
                      {update.twitchPrime.map((item: SaleItem) => (
                        <UpdateItemElement key={item.item.id} item={item} />
                      ))}
                    </ul>
                  </section>
                )}
                {update.targetedSale.length !== 0 && (
                  <section className="update-section update-section__targeted-sales">
                    <b>Targeted Sales</b>
                    <ul className="update-item-list">
                      {update.targetedSale.map((item: SaleItem) => (
                        <UpdateItemElement key={item.item.id} item={item} />
                      ))}
                    </ul>
                  </section>
                )}
                {update.timeTrial && (
                  <section className="update-section update-section__time-trial">
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
                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                      </a>
                    </p>
                  </section>
                )}
                {update.rcTimeTrial && (
                  <section className="update-section update-section__rc-time-trial">
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
                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                      </a>
                    </p>
                  </section>
                )}
                {update.premiumRace && (
                  <section className="update-section update-section__premium-race">
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
                  </section>
                )}
              </Card.Body>
            </Card>
          ))}
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
