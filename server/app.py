from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import tempfile
import whisper
import subprocess

app = Flask(__name__)
CORS(app)  # Enable cross-origin requests

# Check if ffmpef is installed
def check_ffmpeg():
    try:
        result = subprocess.run(['ffmpeg', '-version'], capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ FFmpeg is installed successfully.")
            return True
        else:
            print("❌ FFmpeg is not installed properly. Please install FFmpeg before proceeding.")
            return False
    except FileNotFoundError:
        print("❌ FFmpeg is not installed. Please install FFmpeg before proceeding.")
        return False

# Run the check at the start
if not check_ffmpeg():
    raise SystemExit("FFmpeg is not installed. Exiting...")

# Load Whisper model
print("📥 Loading Whisper model...")
model = whisper.load_model("base")  # You can also use "small", "medium", "large" for more accuracy
print("✅ Whisper model loaded successfully.")

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
        print(f"📁 Temporary file saved at: {temp_filename}")

    try:
        # Convert M4A to WAV using FFmpeg
        converted_filename = temp_filename.replace('.m4a', '.wav')
        ffmpeg_command = ['ffmpeg', '-i', temp_filename, '-ar', '16000', '-ac', '1', converted_filename]
        
        ffmpeg_process = subprocess.run(ffmpeg_command, capture_output=True, text=True)

        if ffmpeg_process.returncode != 0:
            print(f"❌ FFmpeg conversion failed with error: {ffmpeg_process.stderr}")
            return jsonify({'error': 'Failed to convert audio file to WAV format.'}), 500
        else:
            print(f"✅ Audio file successfully converted to WAV format at: {converted_filename}")

        # Use Whisper model for transcription
        print("📝 Transcribing audio using Whisper model...")
        result = model.transcribe(converted_filename)
        transcript = result["text"]
        print("✅ Transcription successful.")

        return jsonify({'transcript': transcript})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        # Clean up the temporary files
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
        if os.path.exists(converted_filename):
            os.remove(converted_filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)