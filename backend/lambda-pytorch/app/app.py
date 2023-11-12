import json
import yaml
import torch
import requests
from torch import nn
import librosa
import numpy as np
from pickle import load

model = nn.Sequential(
    nn.Dropout(0.2),
    nn.Linear(57, 512),
    nn.ReLU(),
    nn.Dropout(0.2),
    nn.Linear(512, 256),
    nn.ReLU(),
    nn.Dropout(0.2),
    nn.Linear(256, 128),
    nn.ReLU(),
    nn.Dropout(0.2),
    nn.Linear(128, 64),
    nn.ReLU(),
    nn.Dropout(0.2),
    nn.Linear(64, 32),
    nn.ReLU(),
    nn.Dropout(0.2),
    nn.Linear(32, 10),
)

model.load_state_dict(torch.load("weights"))
model.eval()

def lambda_handler(event, context):
    try:
        name = json.loads(event["body"])["name"]
        config = yaml.safe_load(open("config.yaml"))["s3"]
        url = config["base_url"] + name + ".mp3"
        api_key = config["api_key"]

        response = requests.get(url, 
                                headers = {
                                    "x-api-key": api_key
                                })

        with open("/tmp/item.mp3", "wb") as f:
            f.write(response.content)
        
        y, sr = librosa.load("/tmp/item.mp3")

        # Extract audio features using Librosa
        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
        chroma_stft_ = librosa.feature.chroma_stft(y=y, sr=sr)
        rms = librosa.feature.rms(y=y)
        spec_cent = librosa.feature.spectral_centroid(y=y, sr=sr)
        spec_bw = librosa.feature.spectral_bandwidth(y=y, sr=sr)
        rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
        zcr = librosa.feature.zero_crossing_rate(y)
        harmony, perceptr = librosa.effects.hpss(y=y)
        mfcc_ = librosa.feature.mfcc(y=y, sr=sr)

        inputs = [
            np.mean(chroma_stft_), np.var(chroma_stft_), np.mean(rms), np.var(rms), 
            np.mean(spec_cent), np.var(spec_cent), np.mean(spec_bw), np.var(spec_bw), 
            np.mean(rolloff), np.var(rolloff), np.mean(zcr), np.var(zcr), 
            np.mean(harmony), np.var(harmony), np.mean(perceptr), np.var(perceptr), tempo
        ]

        for mfcc in mfcc_:
            inputs.append(np.mean(mfcc))
            inputs.append(np.var(mfcc))

        scaler = load(open("scaler.pkl", "rb"))
        inputs = scaler.transform(np.array(inputs).reshape(1, -1))

        inputs = torch.tensor(inputs, dtype = torch.float32)
        outputs = torch.argmax(torch.nn.Softmax(dim=-1)(model(inputs))).detach().numpy().tolist()

        return {
            "isBase64Encoded": True,
            "statusCode": 201,
            "headers": {
                'Access-Control-Allow-Headers': "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': "OPTIONS,POST"
            },
            "body": json.dumps({"outputs": outputs})
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
#         "name": "test"
#     })
# }, None))