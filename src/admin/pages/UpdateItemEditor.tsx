import React from "react";
import { Button, FormControl, InputGroup, ListGroup } from "react-bootstrap";
import { SaleItem, UpdateItem } from "../../models/update";

interface UpdateItemEditorProps {
  item: UpdateItem | SaleItem;
  sale?: boolean;
  setItem: (item: UpdateItem | SaleItem) => void;
  deleteItem: () => void;
}

function UpdateItemEditor({
  item,
  sale,
  setItem,
  deleteItem,
}: UpdateItemEditorProps) {
  return (
    <ListGroup.Item className="p-0">
      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text className="w-100">{item.name}</InputGroup.Text>
        </InputGroup.Prepend>
        {sale && (
          <FormControl
            value={(item as SaleItem).amount}
            style={{ maxWidth: "80px" }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setItem({
                ...item,
                amount: parseInt(event.target.value),
              })
            }
            aria-label={sale ? "sale-item" : "update-item"}
          />
        )}
        <InputGroup.Append>
          {sale && <InputGroup.Text>%</InputGroup.Text>}
          {sale && (
            <InputGroup.Text>
              GTA${" "}
              {(
                item.price *
                (1 - (item as SaleItem).amount / 100)
              ).toLocaleString()}
            </InputGroup.Text>
          )}
          <Button
            variant="secondary"
            onClick={deleteItem}
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

export default UpdateItemEditor;
