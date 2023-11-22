# Get user info from the database
# GET request

import json
from utils import query, get_request_body, check_invalid_character

def lambda_handler(event, context):
    result, error = None, None

    try:
        req = event["queryStringParameters"]
        
        user_name = req.get("username")

        assert user_name is not None, "Username is empty"
        assert check_invalid_character(user_name), "Username is invalid"
        
        user = query(f"select * from users where username = '{user_name}'")
        assert len(user) > 0, "User with username is not found"

        result = {
            "user_id": user[0][0],
            "username": user[0][1],
            "password": user[0][2],
            "email": user[0][3],
            "gender": user[0][4],
            "bio": user[0][5]
        }
    except Exception as e:
        error = e

    return get_request_body("GET", result, error)