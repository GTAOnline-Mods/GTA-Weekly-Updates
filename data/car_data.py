import csv
import re

import requests

from bs4 import BeautifulSoup
import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("gtaonline-cf0ea-firebase-adminsdk-m40wm-c97b6484bf.json")
app = firebase_admin.initialize_app(cred)
db = firestore.client()


def camel_to_snake(name):
    pattern = re.compile(r'(?<!^)(?=[A-Z])')
    return pattern.sub('_', name).lower()

def snake_to_camel(name):
    return ''.join(word.title() for word in name.split('_'))

if __name__ == "__main__":
    vehicles = db.collection("vehicles")

    with open("car_data - car_data.csv", "r") as f:
        reader = csv.DictReader(f, delimiter=",")
        for row in reader:
            name = row["Name"]

            doc = vehicles.where("name", "==", name).get()
            if doc:
                print("Skipping", name)
                continue

            data = dict()
            data["name"] = name

            img = ".".join([*row["Image URL"].split(".")[:-1], row["Image URL"].split(".")[-1].split("/")[0]])
            data["img"] = img

            url = "https://gta.fandom.com/wiki/" + row["Name"].replace(" ", "_")
            data["url"] = url

            page = requests.get(url)
            if page.status_code == 200:
                try:
                    soup = BeautifulSoup(page.content, "html.parser")

                    manufacturer = soup.find("div", attrs={"data-source": "manufacturer"})
                    if manufacturer:
                        manufacturer = manufacturer.find("a")
                        manufacturer = manufacturer.text
                        data["manufacturer"] = manufacturer

                    price_data = soup.find("div", attrs={"data-source": "price"})
                    price_data = price_data.find("div")

                    _, price, trade_price = [*price_data.text.split("$"), "", "", ""][:3]
                    price = int("".join(c for c in price if c.isdigit()))
                    data["price"] = price
                    if trade_price:
                        trade_price = int("".join(c for c in trade_price if c.isdigit()))
                        data["tradePrice"] = trade_price

                    shop = price_data.find_all("a", limit=2)[-1]
                    shop = shop.text
                    data["shop"] = shop

                    vehicles.add(data)
                    print("Added", name)
                except Exception as e:
                    print(e, name, url)
            else:
                print(name, page.status_code, page.text)
