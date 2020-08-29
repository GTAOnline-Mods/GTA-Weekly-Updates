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
      <Container fluid="sm" className="justify-content-center">
        <style
          dangerouslySetInnerHTML={{
            __html: `
            .background {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              z-index: -100;
              background-color: #f99c1c;
              background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Rockstar_Games_Logo.svg/1113px-Rockstar_Games_Logo.svg.png");
              background-size: 50px 50px;
              opacity: 30%;
            }

            .yellow-overlay { display: none; }
            `,
          }}
        />
        <div className="background" />
        {updates
          .sort((u1, u2) =>
            u1.date === u2.date ? 0 : u1.date < u2.date ? 1 : -1
          )
          .map((update: Update, index: number) => (
            <Card
              key={index}
              style={{
                minWidth: "300px",
                width: "75%",
                margin: "0 auto 40vh auto",
              }}
              data-aos="zoom-in-up"
              data-aos-duration="400"
            >
              <Card.Body>
                <Card.Title className="pb-2 d-flex justify-content-between">
                  <span className="h4">
                    <span
                      className="d-block mb-2 text-muted"
                      style={{ fontSize: "60%" }}
                    >
                      {update.date.toLocaleDateString()}
                    </span>
                    Weekly Update
                  </span>
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
                {update.bonusActivities.length !== 0 && (
                  <React.Fragment>
                    <b>Bonus GTA$ and RP Activities</b>
                    <ul>
                      {update.bonusActivities.map((activity: BonusActivity) => (
                        <UpdateActivityElement
                          key={activity.activity.id}
                          activity={activity}
                        />
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
