from flask import Flask, request, jsonify
import google.generativeai as genai
import os
from dotenv import load_dotenv
from flask_cors import CORS

# Load API key from .env file
load_dotenv()
api_key = "AIzaSyBRf8g2QU-5vZrLSqjOPYfCX4mmUUu9Psk"

# Configure Gemini API
genai.configure(api_key=api_key)

app = Flask(__name__)
CORS(app)

@app.route('/generate-script', methods=['POST'])
def generate_script():
    data = request.get_json()
    movie_idea = data.get('movieIdea')

    if not movie_idea:
        return jsonify({'error': 'Movie idea is required'}), 400

    prompt = f"""
    Generate a concise and engaging screenplay summary for a movie idea. 
    Keep it under 100 words, with a clear title, logline, and brief synopsis.
    Movie idea: {movie_idea}
    """

    try:
        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content(prompt)
        script_text = response.text

        return jsonify({'script': script_text}), 200
    except Exception as e:
        print("Error generating script:", e)
        return jsonify({'error': 'Failed to generate script'}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
