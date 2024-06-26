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

# Ruta para predecir las imágenes
@app.route('/predict', methods=['POST'])
def predict():
    if 'files' not in request.files:
        return jsonify({'error': 'No files provided'}), 400

    files = request.files.getlist('files')
    predicted_classes = []
    total_probability = 1.0

    for file in files:
        if file.filename.startswith('space'):
            predicted_classes.append(' ')
            continue
        
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
        predicted_classes.append(int(predicted_class))
        
        # Calcular la probabilidad
        total_probability *= np.max(prediction)

        # Eliminar el archivo temporal
        os.remove(filepath)

    # Devolver la respuesta
    response = {
        'predicted_classes': predicted_classes,
        'probability': total_probability * 100  # Convert to percentage
    }

    return jsonify(response)

if __name__ == '__main__':
    if not os.path.exists('./uploads'):
        os.makedirs('./uploads')
    app.run(debug=True)
