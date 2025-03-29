import { Image, StyleSheet, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Text, View, KeyboardAvoidingView } from 'react-native';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import React, { useState, useEffect  } from 'react';
// import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';

const TAN = "#FDF0D5"
const RED = '#C1121F'
const DBLUE = '#003049'
const LBLUE = '#669BBC'

const dismissKeyboard = (event: { target: { constructor: { name: string; }; }; }) => {
  // Check if the tap is outside the TextInput or Button
  const isTextInputFocused = event.target && event.target.constructor.name === 'TextInput';
  if (!isTextInputFocused) {
    Keyboard.dismiss();
  }
};


export default function HomeScreen() {
  const [text, setText] = useState('');
  const [capturingAudio, setCapturingAudio] = useState(true);

  const handleSubmit = () => {
    console.log(text);
    // Send text to backend for processing 
    // Switch screens to chat mode
  };

  // Register event listeners using hooks
  useSpeechRecognitionEvent("start", () => setCapturingAudio(true));
  useSpeechRecognitionEvent("end", () => setCapturingAudio(false));
  
  useSpeechRecognitionEvent("result", (event) => {
    setText(event.results[0]?.transcript || '');
  });
  
  useSpeechRecognitionEvent("error", (event) => {
    console.log("Error code:", event.error, "Error message:", event.message);
  });

  const handleStartRecognition = async () => {
    // Request permissions first
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    
    if (!result.granted) {
      console.warn("Permissions not granted", result);
      return;
    }
    
    // Start speech recognition
    ExpoSpeechRecognitionModule.start({
      lang: "en-US",
      interimResults: true,
      continuous: false,
    });
  };

  const handleStopRecognition = () => {
    ExpoSpeechRecognitionModule.stop();
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
            <TouchableOpacity style={styles.talkButton} onPress={capturingAudio ? handleStartRecognition : handleStopRecognition}>
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
            <IconSymbol 
              name="paperplane.fill" 
              size={28} 
              color={RED} // Use your desired color
            />
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
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
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
