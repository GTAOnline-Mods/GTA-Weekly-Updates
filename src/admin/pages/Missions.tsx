import { faSearch, faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import {
  Accordion,
  Button,
  Container,
  FormControl,
  InputGroup,
  Spinner
} from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators, compose, Dispatch } from "redux";
import Firebase, { withFirebase } from "../../Firebase";
import { Mission } from "../../models/mission";
import { RootState } from "../../store";
import { setMission, setMissions } from "../../store/Missions";
import MissionEdit from "./MissionEdit";

interface MissionsProps {
  firebase?: Firebase;
  missions: Mission[];
  setMissions: typeof setMissions;
  setMission: typeof setMission;
}

function Missions({
  missions,
  setMissions,
  setMission,
  firebase,
}: MissionsProps) {
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [activeKey, setActiveKey] = React.useState<string | undefined>(
    undefined
  );

  async function getMissions() {
    setLoading(true);
    const m = await firebase!.getMissions();
    setMissions(m);
    setLoading(false);
  }

  async function _setMission(mission: Mission) {
    const { docRef, ...m } = mission;

    if (docRef) {
      await docRef.update(m);
      setMission(mission);
    } else {
      const ref = await firebase?.db.collection("missions").add(m);
      mission = {
        ...mission,
        docRef: ref,
      };
      setMission(mission);
    }
  }

  React.useEffect(() => {
    if (!missions.length) {
      getMissions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container fluid className="p-2">
      <h1>Missions</h1>
      <br />
      <div className="d-flex mb-3">
        <InputGroup>
          <FormControl
            placeholder="Mission Name"
            aria-label="Mission Name"
            aria-describedby="search"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(event.target.value)
            }
          />
          <InputGroup.Append>
            <InputGroup.Text id="search">
              <FontAwesomeIcon icon={faSearch} />
            </InputGroup.Text>
          </InputGroup.Append>
          <Button
            variant="secondary"
            onClick={getMissions}
            style={{
              backgroundColor: "#e9ecef",
              borderColor: "#ced4da",
              color: "black",
            }}
          >
            <FontAwesomeIcon icon={faSync} />
          </Button>
        </InputGroup>
      </div>
      <br />
      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Accordion activeKey={activeKey}>
          {(search
            ? missions.filter((m) =>
                m.name.toLowerCase().includes(search.toLowerCase())
              )
            : missions
          ).map((mission, index) => (
            <MissionEdit
              mission={mission}
              key={index}
              index={index}
              setMission={_setMission}
              setActiveKey={setActiveKey}
            />
          ))}
        </Accordion>
      )}
      <br />
      <div className="d-flex flex-row-reverse">
        <Button
          variant="link"
          onClick={() => {
            _setMission({
              name: "",
            });
            setActiveKey(missions.length.toString());
          }}
        >
          Add
        </Button>
      </div>
    </Container>
  );
}

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setMissions,
      setMission,
    },
    dispatch
  );

const mapStateToProps = (state: RootState) => ({
  missions: state.missions.missions,
});

export default compose(
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps)
)(Missions) as any;
