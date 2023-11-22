# Get preferences of a user from the database
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

        output = query(f"select track_genre from history natural join songs where user_id = {user_id} order by ts")

        result = {}
        sum = 0

        for [i, [genre]] in enumerate(output):
            sum += i + 1

            if genre not in result:
                result[genre] = i + 1
            else:
                result[genre] += i + 1

        for key in result.keys():
            result[key] /= sum
    except Exception as e:
        error = e

    return get_request_body("GET", result, error)
