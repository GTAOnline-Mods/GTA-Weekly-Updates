import React from "react";
import { Button, FormControl, InputGroup, ListGroup } from "react-bootstrap";
import { SaleItem, UpdateItem } from "../../models/update";
import { safeInt } from "../../utils";

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
  const price = [
    item.price,
    item.tradePrice,
    item.minPrice,
    item.maxPrice,
  ].find((x) => x != null);

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
            onChange={({ target }: React.ChangeEvent<HTMLInputElement>) =>
              setItem({
                ...item,
                amount: safeInt(target.value, (item as SaleItem).amount),
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
              {price &&
                (
                  price *
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
