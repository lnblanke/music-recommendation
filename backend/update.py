# Upload music_features.csv to database
import pandas as pd
import yaml
import requests
import json
from utils import get_connection,  query

if __name__ == "__main__":
    # Get config file and connect to MySQL
    config = yaml.safe_load(open("config.yaml"))
    cnx = get_connection(config["database"])
    cursor = cnx.cursor()
    cnx.start_transaction()

    # Read features file
    df = pd.read_csv(config["data"]["recommend"])
    df = df[["track_id", "artists", "album_name", "track_name", "track_genre", "url"]]

    # Create feature table into database
    create_query = ""

    for col in df.columns:
        create_query += f"{col} varchar(255)"
        if col == "track_id":
            create_query += " primary key"
        else:
            create_query += " not null"

        create_query += ","

    cursor.execute(f"drop table if exists songs")
    cursor.execute(f"create table songs({create_query[:-1]})")

    # Insert rows into feature table
    insert_query = []
    for _, row in df.iterrows():
        item = []
        for col in df.columns:
            row[col] = str(row[col]).replace("\\", "\\\\").replace("\'", "\\\'").replace("\"", "\\\"")
            item.append(f"\"{row[col]}\"")

        insert_query.append(f"({', '.join(item)})")

    cursor.execute(f"insert ignore into songs values {', '.join(insert_query)}")

    cnx.commit()
    cursor.close()