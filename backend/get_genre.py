# Get all genres from database
# GET request

import json
from utils import query, get_request_body

def lambda_handler(event, context):
    result, error = None, None

    try:
        result = query("select distinct track_genre from songs order by track_genre")

        result = [r for [r] in result]
    except Exception as e:
        error = e

    return get_request_body("GET", result, error)