/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Card, CardDeck } from "react-bootstrap";
import Firebase, { withFirebase } from "../../Firebase";
import Update, { SaleItem, UpdateItem } from "../../models/update";
import UpdateItemElement from "./UpdateItemElement";

interface UpdatesProps {
  firebase?: Firebase;
}

function Updates({ firebase }: UpdatesProps) {
  const [updates, setUpdates] = React.useState<Update[]>([]);

  React.useEffect(() => {
    async function fetchUpdates() {
      const snapshot = await firebase?.db.collection("updates").get();

      const getItem = async (item: firebase.firestore.DocumentReference) => {
        const s = await item.get();
        return {
          name: s.data()!.name,
          docRef: item,
          id: item.id,
          data: s.data()!,
        };
      };

      const getItems = async (items?: firebase.firestore.DocumentData[]) =>
        items ? Promise.all(items.map((item) => getItem(item.item))) : [];

      const getSales = async (sale?: firebase.firestore.DocumentData[]) =>
        sale
          ? Promise.all(
              sale.map(async (item) => ({
                ...(await getItem(item.item)),
                amount: item.amount,
              }))
            )
          : [];

      const u: Update[] = [];

      for (const doc of snapshot!.docs) {
        const update = {
          podium: doc.data()!.podium && (await getItem(doc.data()!.podium)),
          new: await getItems(doc.data()!.new),
          sale: await getSales(doc.data()!.sale),
          twitchPrime: await getSales(doc.data()!.twitchPrime),
          date: new Date(doc.data()!.date.seconds * 1000),
        };
        u.push(update);
      }

      setUpdates(u);
    }
    fetchUpdates();
  }, []);

  return (
    <CardDeck>
      {updates.map((update: Update, index: number) => (
        <Card key={index}>
          <Card.Body>
            <Card.Title className="pb-2">Weekly Update</Card.Title>
            {update.podium && (
              <span>
                <b>Podium Vehicle</b>
                <br />
                <ul>
                  <UpdateItemElement
                    key={update.podium.id}
                    item={update.podium}
                  />
                </ul>
              </span>
            )}
            {update.new.length ? <b>New Content</b> : ""}
            <ul>
              {update.new.map((item: UpdateItem) => (
                <UpdateItemElement key={item.id} item={item} />
              ))}
            </ul>
            {update.sale.length ? <b>Discounts</b> : ""}
            <ul>
              {update.sale.map((item: SaleItem) => (
                <UpdateItemElement key={item.id} item={item} />
              ))}
            </ul>
            {update.twitchPrime.length ? <b>Twitch Prime Bonuses</b> : ""}
            <ul>
              {update.twitchPrime.map((item: SaleItem) => (
                <UpdateItemElement key={item.id} item={item} />
              ))}
            </ul>
          </Card.Body>
          <Card.Footer>
            <small className="text-muted">
              {update.date.toLocaleDateString()}
            </small>
          </Card.Footer>
        </Card>
      ))}
    </CardDeck>
  );
}

export default withFirebase(Updates);
