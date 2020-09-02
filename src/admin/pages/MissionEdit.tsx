import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import React from "react";
import { Accordion, Button, Card, Col, Form, Spinner } from "react-bootstrap";
import { Mission } from "../../models/mission";

interface MissionEditProps {
  mission: Mission;
  setMission: (mission: Mission) => Promise<void>;
  index: number;
  setActiveKey: (key: string) => void;
}

function MissionEdit({
  mission,
  setMission,
  index,
  setActiveKey,
}: MissionEditProps) {
  const [loading, setLoading] = React.useState(false);
  const [localMission, setLocalMission] = React.useState<Mission>(mission);

  React.useEffect(() => {
    setLocalMission(mission);
  }, [mission]);

  const debouncedSave = React.useCallback(
    _.debounce((m: Mission) => {
      if (!m.name) {
        return;
      }

      setLoading(true);
      setMission(m).then(() => setLoading(false));
    }, 250),
    []
  );

  const setValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = event.target;

    const m = {
      ...localMission,
      [name]: type === "number" && value ? parseInt(value) : value,
    };

    setLocalMission(m);
    debouncedSave(m);
  };

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span>{mission.name}</span>
        <Accordion.Toggle as={Button} variant="link" eventKey={`${index}`}>
          <FontAwesomeIcon icon={faEdit} />
        </Accordion.Toggle>
      </Card.Header>
      <Accordion.Collapse eventKey={`${index}`}>
        <Card.Body>
          <Form className="mt-2" onSubmit={(e) => e.preventDefault()}>
            <Form.Row className="mb-2">
              <Form.Group as={Col}>
                <Form.Label>Name *</Form.Label>
                <Form.Control
                  placeholder="Name"
                  name="name"
                  value={localMission.name}
                  onChange={setValue}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>URL</Form.Label>
                <Form.Control
                  placeholder="URL"
                  name="url"
                  value={localMission.url}
                  onChange={setValue}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row className="mb-2">
              <Form.Group as={Col}>
                <Form.Label>Pay</Form.Label>
                <Form.Control
                  placeholder="Pay"
                  name="pay"
                  type="number"
                  value={localMission.pay}
                  onChange={setValue}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row className="mb-2">
              <Form.Group as={Col}>
                <Form.Label>Minimum Pay</Form.Label>
                <Form.Control
                  placeholder="Minimum Pay"
                  name="minPay"
                  type="number"
                  value={localMission.minPay}
                  onChange={setValue}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Maximum Pay</Form.Label>
                <Form.Control
                  placeholder="Maximum Pay"
                  name="maxPay"
                  type="number"
                  value={localMission.maxPay}
                  onChange={setValue}
                />
              </Form.Group>
            </Form.Row>
          </Form>
          <div className="d-flex flex-row-reverse">
            {loading && (
              <Spinner animation="border" role="status" className="mr-4 mt-2">
                <span className="sr-only">Loading...</span>
              </Spinner>
            )}
            <span className="text-muted mr-auto">
              Fields marked with * are required.
            </span>
          </div>
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
}

export default MissionEdit;
