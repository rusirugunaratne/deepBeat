from fastapi import FastAPI, File, UploadFile
import uvicorn
import numpy as np
import joblib
from io import BytesIO
from PIL import Image
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd


# MODEL = tf.keras.models.load_model('../saved_models/1')
CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]
model = joblib.load('xgboost_model.joblib')


app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Item(BaseModel):
    # Define the input features as per your model's requirements
    artists_0: int
    artists_1: int
    artists_2: int
    artists_3: int
    artists_4: int
    album_name_0: int
    album_name_1: int
    album_name_2: int
    album_name_3: int
    album_name_4: int
    track_name_1: int
    track_name_2: int
    track_name_3: int
    track_name_4: int
    duration_ms: float
    explicit: float
    danceability: float
    energy: float
    key: float
    mode: int
    speechiness: float
    instrumentalness: float
    liveness: float
    valence: float
    tempo: float
    time_signature: float
    track_genre_1: int
    speechiness_type_Low: int


@app.get('/ping')
async def ping():
    return 'Hello, I am alive'


async def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image


@app.post('/api/predict')
async def predict(item: Item):
    input_data = pd.DataFrame([item.model_dump()])
    prediction = model.predict(input_data)
    print(prediction)
    return {"prediction": prediction[0].item()}


if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)
