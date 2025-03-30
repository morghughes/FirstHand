from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import tempfile
import speech_recognition as sr
import subprocess

app = Flask(__name__)
CORS(app)  # Enable cross-origin requests

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    print("Request files:", request.files)
    print("Request form:", request.form)
    print("Request data:", request.data)
    
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files['audio']
    print("Received audio file:", audio_file)

    # Save the uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix='.m4a') as temp_audio:
        audio_file.save(temp_audio.name)
        temp_filename = temp_audio.name
        print(temp_filename)

    try:
        # Convert M4A to WAV using FFmpeg
        converted_filename = temp_filename.replace('.m4a', '.wav')
        subprocess.run(['ffmpeg', '-i', temp_filename, '-ar', '16000', '-ac', '1', converted_filename], check=True)

        print("MAKING RECOGNIZER")
        recognizer = sr.Recognizer()
        print("MADE RECOGNIZER")
    
        # Load the audio file
        with sr.AudioFile(converted_filename) as source:
            print("OPENED FILE")
            audio_data = recognizer.record(source)
        print("LOADED AUDIO FILE")
        
        # Use CMU Sphinx for offline recognition
        transcript = recognizer.recognize_sphinx(audio_data)
    

        return jsonify({'transcript': transcript})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        # Clean up the temporary file
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
        if os.path.exists(converted_filename):
            os.remove(converted_filename)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)