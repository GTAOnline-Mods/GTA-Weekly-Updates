import { faExternalLinkAlt, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Image, Modal } from "react-bootstrap";
import { SaleItem, UpdateItem } from "../../models/update";

interface UpdateItemCardProps {
  item: UpdateItem | SaleItem;
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
          : item.name}{" "}
        <FontAwesomeIcon icon={faEye} />
      </li>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{item.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            {(item as SaleItem).amount ? (
              <span>
                <del>GTA$ {item.price.toLocaleString()}</del> GTA${" "}
                {(
                  item.price *
                  (1 - (item as SaleItem).amount / 100)
                ).toLocaleString()}
                {item.tradePrice && (
                  <span>
                    <br />
                    <del>GTA$ {item.tradePrice.toLocaleString()}</del> GTA${" "}
                    {(
                      item.tradePrice *
                      (1 - (item as SaleItem).amount / 100)
                    ).toLocaleString()}{" "}
                    (Trade Price)
                  </span>
                )}
              </span>
            ) : (
              <span>GTA$ {item.price.toLocaleString()}</span>
            )}
            {item.shop && (
              <span className="pt-2 mt-2">
                <br />
                <b>Available at</b> {item.shop}
              </span>
            )}
          </p>
          {item.img && (
            <Image
              src={item.img}
              className="mt-2"
              thumbnail
              style={{ maxHeight: "150px" }}
            />
          )}
          {item.url && (
            <Button variant="link" href={item.url} target="_blank">
              <FontAwesomeIcon icon={faExternalLinkAlt} />
            </Button>
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
