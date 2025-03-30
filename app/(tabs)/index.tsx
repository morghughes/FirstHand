import { Image, StyleSheet, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Text, View, KeyboardAvoidingView } from 'react-native';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import React, { useState } from 'react';
// import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Audio } from 'expo-av';

const TAN = "#FDF0D5"
const RED = '#C1121F'
const DBLUE = '#003049'
const LBLUE = '#669BBC'

const handleSubmit = () => {
  console.log('Button pressed!');
};

const dismissKeyboard = (event: { target: { constructor: { name: string; }; }; }) => {
  // Check if the tap is outside the TextInput or Button
  const isTextInputFocused = event.target && event.target.constructor.name === 'TextInput';
  if (!isTextInputFocused) {
    Keyboard.dismiss();
  }
};


export default function HomeScreen() {
  const [text, setText] = useState('');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    setIsRecording(false);
    
    try {
      await recording.stopAndUnloadAsync();
      const uri = await recording.getURI();
      
      await sendRecording(uri);
      console.log(uri);
    } catch (error) {
      console.error('Error stopping recording', error);
    }
  }

  const sendRecording = async (uri) => {
    // Fetch the blob data
    const correctedUri = Platform.OS === 'ios' ? `file://${uri}` : uri;
    const response = await fetch(correctedUri);
    const blob = await response.blob();

    // Create FormData and append the Blob
    const formData = new FormData();
    formData.append('audio', blob, 'recording.m4a'); // Pass blob and filename

    // Debug FormData contents
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

  
    try {
      const response = await fetch('http://10.0.0.96:5000/transcribe', { 
        method: 'POST',
        body: formData,
      });
        
        const result = await response.json();
        console.log(result); 
        // The result should contain the transcribed text
        console.log('Transcription:', result.text);
        setText(result.text); 
        return result.text;
      } catch (error) {
        console.error('Transcription failed:', error);
        return null;
      }
    };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust behavior based on platform
    >
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.centeredText}>FirstHand here, let me help assess the situation</ThemedText>

        <View style={styles.speakingContainer}>
            <TouchableOpacity style={styles.talkButton} onPress={isRecording ? stopRecording : startRecording}>
              <Image source={require('../../assets/images/RedHand.png')} style={styles.talkButtonImage} />
            </TouchableOpacity>
            <ThemedText type="title" style={styles.centeredText}>Tell me the situation</ThemedText>
          </View>

        <View style={styles.inputContainer}>
          <AutoGrowingTextInput 
              style={styles.input}
              placeholder="Can't speak? Type here"
              placeholderTextColor={TAN}
              value={text}
              onChangeText={(text: React.SetStateAction<string>) => setText(text)}
              maxHeight={180}
              minHeight={40}
            />
            <TouchableOpacity style={styles.textButton} onPress={handleSubmit}>
              <IconSymbol name="paperplane.fill" color={RED} />
            </TouchableOpacity>
          </View>
      </ThemedView> 
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  centeredText: {
    textAlign: 'center', // This centers the text horizontally
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  speakingContainer: {
    flex: .6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderColor: "transparent",
    width: '100%',
    gap: 2,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0,
    borderColor: "transparent",
    width: '90%',
    marginVertical: 15,
  },
  input: {
    flex: 0.8,
    margin: 15,
    borderColor: RED,
    color: TAN, 
    borderWidth: 1,
    padding: 10,
    borderRadius: 25,
  },
  textButton: {
    flex: 0.2,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  talkButton: {
    flex: 0.4,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: 20, 
  },
  buttonImage: {
    height: 80, 
    width: 60,
    resizeMode: 'contain', //Ensures the image scales properly
  },
  talkButtonImage: {
    height: 200, 
    width: 180,
    resizeMode: 'contain', //Ensures the image scales properly
  },
});
