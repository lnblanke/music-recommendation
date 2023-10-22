# Change user info in the database
# PUT request

import json
from utils import query, check_invalid_character, get_request_body

def lambda_handler(event, context):
    error = None
    try:
        req = json.loads(event["body"])
        
        user_id = req.get("user_id")
        password = req.get("password")
        username = req.get("user_name")
        gender = req.get("gender")
        email = req.get("email")
        bio = req.get("bio")
    
        assert user_id is not None, "user_id is empty"
        
        user = query(f"select user_id from users where user_id='{user_id}'")
        
        assert len(user) > 0, "User with user_id is not found"

        update_cols = []

        if password:
            assert password != "", "Password is empty"
            assert check_invalid_character(password, True), "Password contains invalid character"
        
            update_cols.append(f"password = '{password}'")
        if username:
            assert username != "", "Username is empty"
            assert check_invalid_character(username), "Username contains invalid character"
            
            user = query(f"select user_name from users where user_name = '{username}' and user_id <> {user_id}")
            assert len(user) == 0, "User with username already exists"
            
            update_cols.append(f"user_name = '{username}'")
        if email:
            assert email != "", "Email is empty"
            assert '@' in email, "Email is invalid"
            assert check_invalid_character(email, True), "Email contains invalid character"
            
            email = query(f"select email from users where email = '{email}' and user_id <> {user_id}")
            assert len(email) == 0, "User with email already exists"
        
            update_cols.append(f"email = '{email}'")
        if gender:
            assert gender != "", "Gender is empty"
            update_cols.append(f"gender = '{gender}'")
        if bio:
            bio = bio.replace("\"", "'")
            update_cols.append(f"bio = \"{bio}\"")

        query(f"update users set {', '.join(update_cols)} where user_id = {user_id}")
    except Exception as e:
        error = e

    return get_request_body("PUT", None, error)