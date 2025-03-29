import { Image, StyleSheet, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Text, View } from 'react-native';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import React, { useState } from 'react';
// import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const TAN = "#FDF0D5"
const RED = '#C1121F'
const DBLUE = '#003049'
const LBLUE = '#669BBC'

function handleSubmit() {

}


export default function HomeScreen() {
  const [text, setText] = useState('');
  const [height, setHeight] = useState(40);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.centeredText}>FirstHand here, let me help assess the situation</ThemedText>

        <View style={styles.inputContainer}>
          <AutoGrowingTextInput 
              style={styles.input}
              placeholder="What is the situation?"
              placeholderTextColor={TAN}
              value={text}
              onChangeText={(text: React.SetStateAction<string>) => setText(text)}
              maxHeight={300}
              minHeight={40}
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
      </ThemedView> 
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginVertical: 15,
  },
  input: {
    flex: 0.8,
    margin: 15,
    borderColor: '#C1121F',
    color: "#FDF0D5", 
    borderWidth: 1,
    padding: 10,
    borderRadius: 25,
  },
  button: {
    flex: 0.2,
    height: 40, 
    backgroundColor: '#C1121F',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  buttonText: {
    color: 'FDF0D5'
  },
});
