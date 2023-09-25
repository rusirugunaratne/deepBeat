from fastapi import FastAPI, File, UploadFile
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
from fastapi.middleware.cors import CORSMiddleware

# MODEL = tf.keras.models.load_model('../saved_models/1')
CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]

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

@app.get('/ping')
async def ping():
    return 'Hello, I am alive'


async def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image


@app.post('/api/predict')
async def predict(file: UploadFile = File(...)):
    image = await read_file_as_image(await file.read())
    # predictions = MODEL.predict(np.expand_dims(image, 0))
    return {
        # 'class': CLASS_NAMES[np.argmax(predictions[0])],
        # 'confidence': float(np.max(predictions[0]))
    }


if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)
