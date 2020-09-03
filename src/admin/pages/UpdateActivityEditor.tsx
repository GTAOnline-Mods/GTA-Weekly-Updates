import React from "react";
import { Button, FormControl, InputGroup, ListGroup } from "react-bootstrap";
import { BonusActivity } from "../../models/update";
import { safeInt } from "../../utils";

interface UpdateActivityEditorProps {
  activity: BonusActivity;
  setActivity: (item: BonusActivity) => void;
  deleteActivity: () => void;
}

function UpdateActivityEditor({
  activity,
  setActivity,
  deleteActivity,
}: UpdateActivityEditorProps) {
  return (
    <ListGroup.Item className="p-0">
      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text className="w-100">{activity.name}</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          value={activity.moneyAmount}
          style={{ maxWidth: "50px" }}
          onChange={({ target }: React.ChangeEvent<HTMLInputElement>) =>
            setActivity({
              ...activity,
              moneyAmount: safeInt(target.value, activity.moneyAmount),
            })
          }
          aria-label={"bonus-activity"}
        />
        <InputGroup.Append>
          <InputGroup.Text>x GTA$</InputGroup.Text>
        </InputGroup.Append>
        <FormControl
          value={activity.rpAmount}
          style={{ maxWidth: "50px" }}
          onChange={({ target }: React.ChangeEvent<HTMLInputElement>) =>
            setActivity({
              ...activity,
              rpAmount: safeInt(target.value, activity.rpAmount),
            })
          }
          aria-label={"bonus-activity"}
        />
        <InputGroup.Append>
          <InputGroup.Text>x RP</InputGroup.Text>
          <Button
            variant="secondary"
            onClick={deleteActivity}
            style={{
              backgroundColor: "#e9ecef",
              borderColor: "#ced4da",
              color: "black",
            }}
          >
            Delete
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </ListGroup.Item>
  );
}

export default UpdateActivityEditor;
