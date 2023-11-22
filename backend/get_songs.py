# Get song info given a list of track ids from the database
# GET request

import json
from utils import query, get_request_body

def lambda_handler(event, context):
    result, error = None, None

    try:
        req = event["queryStringParameters"]
        
        ids = req.get("track_id")

        assert ids is not None, "Track ID is empty"
        
        ids = ids.split(",")

        result = []

        for [id, track_id] in enumerate(ids):
            [track_id, artists, album_name, track_name, track_genre, url] = query(f"select * from songs where track_id = \"{track_id}\"")[0]
            result.append({
                "id": id,
                "track_id": track_id,
                "singer": artists,
                "album": album_name,
                "song": track_name,
                "track_genre": track_genre,
                "url": url
            })
    except Exception as e:
        error = e

    return get_request_body("GET", result, error)