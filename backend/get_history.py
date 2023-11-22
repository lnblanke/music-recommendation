# Get history of a user from the database
# GET request

import json
from utils import query, get_request_body

def lambda_handler(event, context):
    result, error = None, None

    try:
        req = event["queryStringParameters"]
        
        user_id = req.get("user_id")

        assert user_id is not None, "User ID is empty"
        
        user = query(f"select user_id from users where user_id = {user_id}")
        assert len(user) > 0, "User with user_id is not found"

        result = query(f"select track_id, ts from history where user_id = {user_id} order by ts desc")
        result = [{"track_id": track_id, "ts": ts} for [track_id, ts] in result]
    except Exception as e:
        error = e

    return get_request_body("GET", result, error)