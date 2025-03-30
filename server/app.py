from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable cross-origin requests

@app.route('/transcribe', methods=['GET'])
def test_route():
    return jsonify({"message": "Backend is working!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)