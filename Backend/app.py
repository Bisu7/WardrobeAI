from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from PIL import Image
import pickle
import io

app = Flask(__name__)
cors = CORS(app)

def load_knn_model():
    with open('knn_model.pkl', 'rb') as file:
        knn_model_data = pickle.load(file)
    return knn_model_data

train_images_flattened, train_labels = load_knn_model()

def euclidean_distance(image1, image2):
    return np.sqrt(np.sum((image1 - image2) ** 2))

def knn_predict(test_image, train_images, train_labels, k=5):
    distances = [euclidean_distance(test_image, train_image) for train_image in train_images]
    k_nearest_indices = np.argsort(distances)[:k]
    k_nearest_labels = [train_labels[i] for i in k_nearest_indices]
    return max(set(k_nearest_labels), key=k_nearest_labels.count)

@app.route('/classify', methods=['POST'])
def classify_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']
    img = Image.open(io.BytesIO(file.read())).convert('L')  
    img = img.resize((28, 28))  
    img_array = np.array(img) / 255.0  
    img_flat = img_array.reshape(1, -1)  

    predicted_label = knn_predict(img_flat[0], train_images_flattened, train_labels, k=5)

    class_names = [
        'T-shirt/top', 'Trouser', 'Pullover', 'Dress', 'Coat',
        'Sandal', 'Shirt', 'Sneaker', 'Bag', 'Ankle boot'
    ]
    return jsonify({'predicted_label': class_names[predicted_label]})

if __name__ == '__main__':
    app.run(debug=True)
