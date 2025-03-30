import { Image, StyleSheet, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Text, View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import React, { useState, useRef, useEffect  } from 'react';
// import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Audio } from 'expo-av';
import { useRouter, useLocalSearchParams  } from 'expo-router';

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


export default function ChatScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();

  // State for messages and input text
  const [messages, setMessages] = useState<{text: string, isUser: boolean}[]>([]);
  const [text, setText] = useState('');

  const scrollViewRef = useRef<ScrollView | null>(null);
  
  // Extract the prompt parameter, with a fallback value if needed
  const { prompt = "Hello there!" } = params;
  // Handle initial prompt
  useEffect(() => {
    // Only process if there's an actual prompt
    if (prompt) {
      // Add user's prompt as first message
      const userMessage = {
        text: Array.isArray(prompt) ? prompt.join(' ') : prompt,
        isUser: true
      };
      
      setMessages([userMessage]);
      
      // Process the initial prompt
      processMessage(prompt);
    }
  }, []);

  const processMessage = async (message: string) => {
    try {
      //Simulate response w delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(message)
      // Create a dynamic response based on the message
      let responseText = "Sorry not linked";

      // Add AI response
      const aiResponse = {
        text: responseText,
        isUser: false
      };
      
      setMessages(prevMessages => [...prevMessages, aiResponse]);
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add error message
      const errorResponse = "I'm sorry, I couldn't process your request. Please try again."
      
      setMessages(prevMessages => [...prevMessages, {
        text: "I'm sorry, I couldn't process your request. Please try again.",
        isUser: false
      }]);
    }
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);
  
  // Handle sending a message
  const handleSend = () => {
    if (text.trim() === '') return;
  
    
    // Add user message
    const userMessage = {
      text: text,
      isUser: true
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setText(''); // Clear input
    
    // Process the message
    processMessage(userMessage.text);
  };
  
  // Message bubble component
  const MessageBubble = ({ text, isUser }) => (
    <View style={[
      styles.bubble,
      isUser ? styles.userBubble : styles.aiBubble,
      isUser ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' }
    ]}>
      <Text style={[
        styles.bubbleText,
        isUser ? styles.userText : styles.aiText
      ]}>
        {text}
      </Text>
    </View>
  );

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
    <View style={{ flex: 1 }}>
    <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesList}
      >
        {messages.map((message, index) => (
        <MessageBubble 
          key={index}
          text={message.text}
          isUser={message.isUser}
        />
      ))}
      </ScrollView>
      <View style={styles.titleContainer}>
        <View style={styles.inputContainer}>
          <AutoGrowingTextInput 
              style={styles.input}
              placeholder="Type here"
              placeholderTextColor={TAN}
              value={text}
              onChangeText={(text: React.SetStateAction<string>) => setText(text)}
              maxHeight={80}
              minHeight={40}
            />
            <TouchableOpacity style={styles.textButton} onPress={handleSend}>
              <IconSymbol name="paperplane" color={RED} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.talkButton} onPress={isRecording ? stopRecording : startRecording}>
              <Image source={require('../../assets/images/RedHand.png')} style={styles.talkButtonImage} />
            </TouchableOpacity>
          </View>
        </View>
      </View> 
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TAN,
    },
  messagesContainer: {
      flex: 1,
      paddingHorizontal: 10,
    },
  messagesList: {
      paddingTop: 20,
      paddingBottom: 10,
    },
  bubble: {
      maxWidth: '80%',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 20,
      marginVertical: 5,
    },
  userBubble: {
      backgroundColor: RED,
      marginLeft: 40,
    },
  aiBubble: {
      backgroundColor: LBLUE,
      marginRight: 40,
    },
    bubbleText: {
      fontSize: 16,
    },
    userText: {
      color: TAN,
    },
    aiText: {
      color: TAN,
    },
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0,
    borderColor: "transparent",
    width: '100%',
    marginVertical: 15,
    position: 'absolute',
    bottom: 20,
  },
  input: {
    flex: 0.6,
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
    flex: 0.2,
    height: 80,
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
    height: 80, 
    width: 60,
    resizeMode: 'contain', //Ensures the image scales properly
  },
});
