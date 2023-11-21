# Delete an existing history from the database
# DELETE request

import json
from utils import query, get_request_body

def lambda_handler(event, context):
    error = None
    try:
        req = json.loads(event["body"])
        
        user_id = req.get("user_id")
        track_id = req.get("track_id")

        assert user_id is not None, "User ID is empty"
        assert track_id is not None, "Track ID is empty"

        user = query(f"select user_id from users where user_id = '{user_id}'")
        assert len(user) != 0, "User with user_id doesn't exist"

        track = query(f"select track_id from songs where track_id = '{track_id}'")
        assert len(track) != 0, "Song with track_id doesn't exist"

        query(f"delete from history where user_id = {user_id} and track_id = '{track_id}'")
    except Exception as e:
        error = e

    return get_request_body("DELETE", None, error)