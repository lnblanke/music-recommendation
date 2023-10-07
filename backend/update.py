# Upload music_features.csv to database
import pandas as pd
import mysql.connector
import yaml

# Establish connection with MySQL
def get_connection(database_config):
    cnx = mysql.connector.connect(
        host = database_config["host"],
        user = database_config["user"],
        password = database_config["password"],
        database = database_config["database"],
        port = database_config["port"]
    )
    return cnx

# Query into MySQL
def query(cnx, query):
    cursor = cnx.cursor()
    cnx.start_transaction
    cursor.execute(query)
    cnx.commit()
    cursor.close()

if __name__ == "__main__":
    # Get config file and connect to MySQL
    config = yaml.safe_load(open("config.yaml"))
    cnx = get_connection(config["database"])

    # Read features file
    df = pd.read_csv(config["data"]["features"])

    # Create feature table into database
    create_query = ""

    for (col, type) in zip(df.columns, df.dtypes):
        if type == float:
            create_query += f"{col} float"
        elif type == int:
            create_query += f"{col} int"
        else:
            create_query += f"{col} varchar(255)"
        
        if col == "filename":
            create_query += " primary key"
        else:
            create_query += " not null"

        create_query += ","

    query(cnx, f"drop table if exists features")
    query(cnx, f"create table features({create_query[:-1]})")

    # Insert rows into feature table
    insert_query = ""

    for _, row in df.iterrows():
        insert_query += '('
        for (col, type) in zip(df.columns, df.dtypes):
            if type != object:
                insert_query += f"{row[col]},"
            else:
                insert_query += f"'{row[col]}',"
        insert_query = insert_query[:-1] + "),"

    query(cnx, f"insert into features values {insert_query[:-1]}")