# Get related songs based on search from the database
# GET request

import json
from utils import query, get_request_body

def lambda_handler(event, context):
    result, error = None, None

    try:
        req = event["queryStringParameters"]
        
        prompt = req.get("prompt")

        assert prompt is not None, "Prompt is empty"

        queries = []

        for word in prompt.split(" "):
            word = word.replace("\\", "\\\\").replace("\"", "\\\"")
            queries.append(f"(select * from songs where track_name like \"%{word}%\" or artists like \"%{word}%\")")

        output = query(f"select *, count(track_id) as relevance from ({' union all '.join(queries)}) as t group by track_id, artists, album_name, track_name, track_genre, url order by relevance desc")

        result = []

        for [track_id, artists, album_name, track_name, track_genre, url, _] in output:
            result.append({
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