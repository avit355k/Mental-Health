from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import json
import pickle
import numpy as np
import nltk

nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('wordnet')

from nltk.stem import WordNetLemmatizer
from tensorflow.keras.models import load_model

lemmatizer = WordNetLemmatizer()

# Load files
model = load_model('chatbot_model.h5')
intents = json.loads(open('intents.json').read())
words = pickle.load(open('words.pkl', 'rb'))
classes = pickle.load(open('classes.pkl', 'rb'))

app = Flask(__name__)
# GLOBAL CORS (Render-safe)
CORS(
    app,
    resources={r"/*": {"origins": [
        "https://calmbridge.vercel.app",
        "http://localhost:5173"
    ]}}
)

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "https://calmbridge.vercel.app"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    return response

# Create bag of words
def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word.lower()) for word in sentence_words]
    return sentence_words


def bow(sentence, words):
    sentence_words = clean_up_sentence(sentence)
    bag = [1 if w in sentence_words else 0 for w in words]
    return np.array(bag)


# Predict intent
def predict_class(sentence):
    bow_vector = bow(sentence, words)
    res = model.predict(np.array([bow_vector]))[0]
    ERROR_THRESHOLD = 0.2
    results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]

    results.sort(key=lambda x: x[1], reverse=True)
    return_list = []

    for r in results:
        return_list.append({"intent": classes[r[0]], "probability": str(r[1])})
    return return_list


# Get response
def get_response(intents_list, intents_json):
    if len(intents_list) == 0:
        return "Sorry, I didn’t get that. Can you explain again?"

    tag = intents_list[0]['intent']
    for intent in intents_json['intents']:
        if intent['tag'] == tag:
            return random.choice(intent['responses'])


@app.route("/chatbot", methods=["POST", "OPTIONS"])
def chatbot_response():
    if request.method == "OPTIONS":
        return "", 204

    message = request.json.get("message", "")
    ints = predict_class(message)
    response = get_response(ints, intents)
    return jsonify({"response": response})


@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "Chatbot Backend Running"})


