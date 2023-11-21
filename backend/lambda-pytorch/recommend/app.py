import json
import pandas as pd
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import MinMaxScaler
from sklearn.preprocessing import LabelEncoder

recset = pd.read_csv("data.csv")

def lambda_handler(event, context):
    try:
        history = json.loads(event["body"])["history"]
        history = pd.DataFrame({"track_id": history})

        #when history is empty, randomly present 10 songs
        if history.empty:
            recommend = recset["track_id"].sample(n=10, replace=False).to_numpy().tolist()
            
            return {
                "isBase64Encoded": True,
                "statusCode": 201,
                "headers": {
                    'Access-Control-Allow-Headers': "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': "OPTIONS,POST"
                },
                "body": json.dumps({
                    "recommend": recommend
                })
            }
        
        songs = recset.copy()
        songs = songs.drop_duplicates(subset = ["track_id"])
        label_encoder = LabelEncoder()
        songs.iloc[:, -1] = label_encoder.fit_transform(songs.iloc[:, -1])
        songs_num = songs.drop(songs.columns[[6, 11]], axis = 1)
        scaler = MinMaxScaler()
        songs_num[songs_num.columns[4:]] = scaler.fit_transform(songs_num[songs_num.columns[4:]])
        songs_num = pd.DataFrame(songs_num)

        df_history = pd.merge(history, songs_num, on=['track_id'])
        df_history = df_history.drop(df_history.columns[0:4], axis = 1)
        songs_num = songs_num.drop(songs_num.columns[0:4], axis = 1)

        weights = list(range(1, len(df_history) + 1))[::-1]

        weighted_history = df_history.mul(weights, axis=0)
        weighted_avg_history = weighted_history.sum(axis=0) / sum(weights)

        #50 NearestNeighbors
        knn = NearestNeighbors(n_neighbors=50)
        knn.fit(songs_num.values)
        weighted_avg_vector = weighted_avg_history.values.reshape(1, -1)
        _, indices = knn.kneighbors(weighted_avg_vector)

        # Get the indices of the neighbors
        recommended_songs = songs.iloc[indices[0]]
        recommended_songs = recommended_songs["track_id"].sample(n = 10, replace = False).to_numpy().tolist()
        
        return {
            "isBase64Encoded": True,
            "statusCode": 201,
            "headers": {
                'Access-Control-Allow-Headers': "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': "OPTIONS,POST"
            },
            "body": json.dumps({
                "recommend": recommended_songs
            })
        }
    except Exception as e:
        return {
            "isBase64Encoded": True,
            "statusCode": 400,
            "headers": {
                'Access-Control-Allow-Headers': "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': "OPTIONS,POST"
            },
            "body": json.dumps({
                "error_message": str(e)
            })
        }


# print(lambda_handler({
#     "body": json.dumps({
#         "history": ["7HneEBTvTra2CRYsxgMOAi", "7yRrWITiPlVJs5X9DhmNjl"]
#     })
# }, None))