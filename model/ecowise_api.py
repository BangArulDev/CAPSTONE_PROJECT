
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
from tensorflow import keras
import numpy as np
import io
from PIL import Image
from pydantic import BaseModel
from typing import List

class EcoWiseAttentionDropout(keras.layers.Layer):
    """Custom Layer: Adaptive Dropout dengan L2 regularization."""

    def __init__(self, rate=0.3, l2_strength=1e-5, **kwargs):
        super().__init__(**kwargs)
        self.rate = rate
        self.l2_strength = l2_strength
        self.dropout = keras.layers.Dropout(rate)

    def call(self, inputs, training=None):
        x = self.dropout(inputs, training=training)
        # L2 regularization loss — tanpa normalisasi yang merusak
        self.add_loss(self.l2_strength * tf.reduce_sum(tf.square(x)))
        return x

    def get_config(self):
        config = super().get_config()
        config.update({'rate': self.rate, 'l2_strength': self.l2_strength})
        return config

app = FastAPI(
    title="Eco Wise AI API",
    description="API untuk klasifikasi sampah berbasis Computer Vision",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

IMG_SIZE = (224, 224)
CLASS_NAMES = ["cardboard", "glass", "metal", "paper", "plastic", "trash"]
WASTE_INFO = {
    "cardboard": {"kategori": "Daur Ulang", "emoji": "📦"},
    "glass": {"kategori": "Daur Ulang", "emoji": "🪟"},
    "metal": {"kategori": "Daur Ulang", "emoji": "🔩"},
    "paper": {"kategori": "Daur Ulang", "emoji": "📄"},
    "plastic": {"kategori": "Daur Ulang / Kurangi", "emoji": "🧴"},
    "trash": {"kategori": "Sampah Residu", "emoji": "🗑️"},
}

# Load model sekali saat startup
model = None

@app.on_event("startup")
async def load_model():
    global model
    # Path disesuaikan untuk lokal/server (bukan Colab lagi)
    model = keras.models.load_model(
        "ecowise_model_final.keras",
        custom_objects={"EcoWiseAttentionDropout": EcoWiseAttentionDropout}
    )
    print("Model berhasil dimuat")

class PredictionResponse(BaseModel):
    predicted_class: str
    confidence: float
    category: str
    emoji: str
    top_3: List[dict]

@app.get("/")
def root():
    return {"message": "Eco Wise AI API v1.0 — Klasifikasi Sampah"}

@app.api_route("/health", methods=["GET", "HEAD"])
def health_check():
    return {"status": "healthy", "model_loaded": model is not None}

@app.post("/predict", response_model=PredictionResponse)
async def predict_waste_image(file: UploadFile = File(...)):
    """Endpoint untuk klasifikasi gambar sampah."""
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File harus berupa gambar")

    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB")
    img = img.resize(IMG_SIZE)
    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0)

    predictions = model.predict(img_array, verbose=0)
    pred_idx = int(np.argmax(predictions[0]))
    confidence = float(predictions[0][pred_idx] * 100)
    predicted_class = CLASS_NAMES[pred_idx]

    top3_idx = np.argsort(predictions[0])[::-1][:3]
    top3 = [{"class": CLASS_NAMES[i], "confidence": round(float(predictions[0][i] * 100), 2)} for i in top3_idx]

    return PredictionResponse(
        predicted_class=predicted_class,
        confidence=round(confidence, 2),
        category=WASTE_INFO[predicted_class]["kategori"],
        emoji=WASTE_INFO[predicted_class]["emoji"],
        top_3=top3
    )
