# Get user info from the database
# GET request

import json
from utils import query, get_request_body, check_invalid_character

def lambda_handler(event, context):
    result, error = None, None

    try:
        req = event["queryStringParameters"]
        
        user_name = req.get("user_name")

        assert user_name is not None, "Username is empty"
        assert check_invalid_character(user_name), "Username is invalid"
        
        result = query(f"select * from users where user_name = '{user_name}'")
        assert len(result) > 0, "User with username is not found"
    except Exception as e:
        error = e

    return get_request_body("GET", result, error)