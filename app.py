from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai

app = Flask(__name__)
CORS(app)

# PASTE YOUR KEY HERE
client = genai.Client(api_key="AIzaSyDYNGMUiIMXPEBEyUrMxdUbNP4JiYLp9DE")

@app.route('/chat', methods=['POST'])
def chat():
    user_data = request.json
    user_message = user_data.get("message")
    
    # Using 'gemini-2.0-flash' - it's fast and free!
    response = client.models.generate_content(
        model="gemini-2.0-flash", 
        contents=user_message
    )
    
    return jsonify({"reply": response.text})

if __name__ == '__main__':
    app.run(port=5000)