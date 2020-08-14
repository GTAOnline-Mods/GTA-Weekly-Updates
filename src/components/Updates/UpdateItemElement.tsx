import React from "react";
import { Button, Modal } from "react-bootstrap";
import { SaleItem, UpdateItem } from "../../models/update";

interface UpdateItemCardProps {
  item: UpdateItem;
}

function UpdateItemElement({ item }: UpdateItemCardProps) {
  const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const formatPrice = (val: number) =>
    formatter.format(val).replace("$", "GTA$");

  return (
    <React.Fragment>
      <li onClick={handleShow}>
        {(item as SaleItem).amount !== undefined
          ? `${(item as SaleItem).amount}% off ${item.name}`
          : item.name}
      </li>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{item.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            {(item as SaleItem).amount !== undefined ? (
              <span>
                <del>{formatPrice(item.data?.price)}</del>{" "}
                {formatPrice(
                  item.data?.price * (1 - (item as SaleItem).amount / 100)
                )}
              </span>
            ) : (
              <span>{formatPrice(item.data?.price)}</span>
            )}
          </p>
          {item.data?.img && <img src={item.data?.img} alt={item.name} />}
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
