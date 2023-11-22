# Add a new history to the database
# POST request

import json
from utils import query, get_request_body

def lambda_handler(event, context):
    error = None
    try:
        req = json.loads(event["body"])
        
        user_id = req.get("user_id")
        track_id = req.get("track_id")
        ts = req.get("ts")

        assert user_id is not None, "User ID is empty"
        assert track_id is not None, "Track ID is empty"
        assert ts is not None, "Timestamp is empty"

        user = query(f"select user_id from users where user_id = '{user_id}'")
        assert len(user) != 0, "User with user_id doesn't exist"

        track = query(f"select track_id from songs where track_id = '{track_id}'")
        assert len(track) != 0, "Song with track_id doesn't exist"

        query(f"insert into history (user_id, track_id, ts) values ({user_id}, '{track_id}', {ts})")
    except Exception as e:
        error = e

    return get_request_body("POST", None, error)