from flask import Flask, request, jsonify
import google.generativeai as genai
import os
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Load API key from .env file
load_dotenv()
api_key = "AIzaSyBRf8g2QU-5vZrLSqjOPYfCX4mmUUu9Psk"  # Store API key securely in .env file
genai.configure(api_key=api_key)

app = Flask(__name__)
CORS(app)

# Database Configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///scripts.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

# Define Database Models
class Script(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ipfs_hash = db.Column(db.String(256), unique=True, nullable=False)
    signer_address = db.Column(db.String(256), nullable=False)

    def to_dict(self):
        return {"id": self.id, "ipfs_hash": self.ipfs_hash , "signer_address": self.signer_address}


# Create the database tables
with app.app_context():
    db.create_all()

@app.route("/generate-script", methods=["POST"])
def generate_script():
    data = request.get_json()
    movie_idea = data.get("movieIdea")

    if not movie_idea:
        return jsonify({"error": "Movie idea is required"}), 400

    prompt = f"""
    Generate a concise and engaging screenplay summary for a movie idea. 
    Keep it under 100 words, with a clear title, logline, and brief synopsis.
    Movie idea: {movie_idea}
    """

    try:
        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content(prompt)
        script_text = response.text

        return jsonify({"script": script_text}), 200
    except Exception as e:
        print("Error generating script:", e)
        return jsonify({"error": "Failed to generate script"}), 500

@app.route("/store-hash/<signer_address>", methods=["POST"])
def store_hash(signer_address):
    """Stores the IPFS hash and script in the database."""
    data = request.get_json()
    ipfs_hash = data.get("hash")
    # script_text = data.get("script")

    if not ipfs_hash :
        return jsonify({"error": "IPFS hash and script are required"}), 400

    # Check if hash already exists
    existing_script = Script.query.filter_by(ipfs_hash=ipfs_hash).first()
    if existing_script:
        return jsonify({"error": "IPFS hash already exists"}), 400

    new_script = Script(ipfs_hash=ipfs_hash , signer_address=signer_address)
    db.session.add(new_script)
    db.session.commit()

    return jsonify({"message": "Hash stored successfully"}), 200

@app.route("/get-hash", methods=["GET"])
def get_script():
    """Retrieves the script from the database using IPFS hash."""
    script_entry = Script.query.order_by(Script.id.desc()).first()

    print(script_entry)

    if not script_entry:
        return jsonify({"error": "IPFS hash not found"}), 404

    return jsonify(script_entry.to_dict()), 200

@app.route("/get-signer/<ipfs_hash>", methods=["GET"])
def get_signer(ipfs_hash):
    """Retrieves the signer address from the database using IPFS hash."""
    signer = Script.query.filter_by(ipfs_hash=ipfs_hash).first()

    if not signer:
        return jsonify({"error": "IPFS hash not found"}), 404

    return jsonify({"signer_address": signer.signer_address}), 200

if __name__ == "__main__":
    app.run(port=5000, debug=True)