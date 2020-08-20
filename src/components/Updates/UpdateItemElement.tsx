import React from "react";
import { Button, Image, Modal } from "react-bootstrap";
import { SaleItem, UpdateItem } from "../../models/update";

interface UpdateItemCardProps {
  item: UpdateItem;
}

function UpdateItemElement({ item }: UpdateItemCardProps) {
  const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <React.Fragment>
      <li onClick={handleShow}>
        {(item as SaleItem).amount
          ? `${(item as SaleItem).amount}% off ${item.name}`
          : item.name}
      </li>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{item.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            {(item as SaleItem).amount ? (
              <span>
                <del>GTA$ {item.data?.price.toLocaleString()}</del> GTA${" "}
                {(
                  item.data?.price *
                  (1 - (item as SaleItem).amount / 100)
                ).toLocaleString()}
                {item.data?.tradePrice && (
                  <span>
                    <br />
                    <del>
                      GTA$ {item.data?.tradePrice.toLocaleString()}
                    </del>{" "}
                    GTA${" "}
                    {(
                      item.data?.tradePrice *
                      (1 - (item as SaleItem).amount / 100)
                    ).toLocaleString()}{" "}
                    (Trade Price)
                  </span>
                )}
              </span>
            ) : (
              <span>GTA$ {item.data?.price.toLocaleString()}</span>
            )}
            {item.data?.shop && (
              <span className="pt-2 mt-2">
                <br />
                <b>Available at</b> {item.data?.shop}
              </span>
            )}
          </p>
          {item.data?.img && (
            <Image
              src={item.data?.img}
              className="mt-2"
              thumbnail
              style={{ maxHeight: "150px" }}
            />
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}

export default UpdateItemElement;
