import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load API Keys
load_dotenv()
api_key = os.getenv("GOOGLE_GEMINI_API_KEY")

# Configure Gemini API
genai.configure(api_key=api_key)

# Ask user for movie idea
movie_idea = input("Enter your movie idea: ")

# Define AI prompt for a shorter and more specific script
prompt = f"""
Generate a concise and engaging screenplay summary for a movie idea. 
Keep it under 100 words, with a clear title, logline, and brief synopsis.
Movie idea: {movie_idea}
"""

# Use the correct method to generate text
model = genai.GenerativeModel("gemini-pro")
response = model.generate_content(prompt)

# Print the generated script
script_text = response.text
print("\nGenerated Script:")
print(script_text)
