from flask import Flask, request, jsonify
from flask_cors import CORS
try:
    import tensorflow as tf
    TF_AVAILABLE = True
except Exception:
    tf = None
    TF_AVAILABLE = False
import numpy as np
from PIL import Image
import io

app = Flask(__name__)
CORS(app)  # enable frontend calls (important for JS fetch)

# Load a pre-trained model (MobileNetV2) if available; otherwise use a small stub
if TF_AVAILABLE:
    try:
        model = tf.keras.applications.MobileNetV2(weights='imagenet')
    except Exception:
        # If loading fails (no internet, incompatible TF build, etc.) fall back to stub
        TF_AVAILABLE = False
        model = None
else:
    model = None

if not TF_AVAILABLE:
    # Simple stub model so frontend dev can continue without TensorFlow installed
    class _StubModel:
        def predict(self, x):
            # return a dummy predictions array compatible with MobileNetV2 decode shape
            # (1, 1000) - all zeros
            return np.zeros((1, 1000))

    model = _StubModel()

@app.route('/')
def home():
    return "✅ AI Health Companion Backend is Running!"

@app.route('/upload', methods=['POST'])
def upload_image():
    # Ensure an image was uploaded
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']

    # Open image and prepare for model
    img = Image.open(io.BytesIO(file.read())).convert("RGB").resize((224, 224))
    img_array = np.array(img)
    if TF_AVAILABLE:
        img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)
    else:
        # lightweight normalization when using stub
        img_array = img_array.astype('float32') / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Run prediction
    if TF_AVAILABLE:
        preds = model.predict(img_array)
        decoded = tf.keras.applications.mobilenet_v2.decode_predictions(preds, top=3)[0]
        top_classes = [
            {"label": decoded[0][1], "probability": round(float(decoded[0][2]), 3)},
            {"label": decoded[1][1], "probability": round(float(decoded[1][2]), 3)},
        ]
    else:
        preds = model.predict(img_array)
        top_classes = [
            {"label": "placeholder", "probability": 0.0},
            {"label": "placeholder", "probability": 0.0},
        ]

    # Fake mapping for skin demo (you can replace with your own fine-tuned model)
    acne_score = round(float(np.random.uniform(70, 95)), 2)
    eczema_score = round(100 - acne_score, 2)

    result = {
        "acne": acne_score,
        "eczema": eczema_score,
        "model_top_classes": top_classes
    }

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
