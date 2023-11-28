# Add a new user to the database
# POST request

import json
from utils import query, get_request_body, check_invalid_character

def lambda_handler(event, context):
    error = None
    try:
        req = json.loads(event["body"])
        
        password = req.get("password")
        username = req.get("username")
        gender = req.get("gender")
        email = req.get("email")
        bio = req.get("bio")

        assert password is not None, "Password is empty"
        assert username is not None and username != "", "Username is empty"
        assert gender is not None and gender != "", "Gender is empty"
        assert email is not None and email != "", "Email is empty"
    
        assert '@' in email, "Email is invalid"
        assert check_invalid_character(username), "Username contains invalid character"
        assert check_invalid_character(password, True), "Password contains invalid character"
        assert check_invalid_character(email, True), "Email contains invalid character"
        
        user_check = query(f"select username from users where username = '{username}'")
        assert len(user_check) == 0, "User with username already exists"

        email_check = query(f"select email from users where email = '{email}'")
        assert len(email_check) == 0, "User with email already exists"

        update_cols = ["password", "username", "gender", "email"]
        update_items = [f"'{password}'", f"'{username}'", f"'{gender}'", f"'{email}'"]

        if bio:
            update_cols.append("bio")
            bio = bio.replace("\\", "\\\\").replace("\"", "\\\"")
            update_items.append(f"\"{bio}\"")

        query(f"insert into users({', '.join(update_cols)}) values ({', '.join(update_items)})")
    except Exception as e:
        error = e

    return get_request_body("POST", None, error)