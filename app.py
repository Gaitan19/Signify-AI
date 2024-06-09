from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array, load_img
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# Cargar el modelo y los pesos
model_path = './modelo/modelo.h5'
weights_path = './modelo/pesos.weights.h5'
model = load_model(model_path)
model.load_weights(weights_path)

# Ruta para predecir la imagen
@app.route('/predict', methods=['POST'])
def predict():
    # Verifica si el archivo está en la solicitud
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']

    # Guardar temporalmente el archivo subido
    filename = file.filename
    filepath = os.path.join('./uploads', filename)
    file.save(filepath)

    # Preprocesar la imagen
    img = load_img(filepath, target_size=(150, 150))
    img = img_to_array(img)
    img = np.expand_dims(img, axis=0)
    img = img / 255.0

    # Realizar la predicción
    prediction = model.predict(img)
    predicted_class = np.argmax(prediction, axis=1)[0]
    
    
    
    

    # Devolver la respuesta
    response = {
        'predicted_class': int(predicted_class),
        'prediction': prediction.tolist(),
        'accuracy': round(float(np.max(prediction) * 100), 2)
    }

    # Eliminar el archivo temporal
    os.remove(filepath)

    return jsonify(response)

if __name__ == '__main__':
    if not os.path.exists('./uploads'):
        os.makedirs('./uploads')
    app.run(debug=True)
