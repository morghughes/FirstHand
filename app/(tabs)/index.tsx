import { Image, StyleSheet, Platform, TextInput } from 'react-native';
import React, { useState } from 'react';
// import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';


export default function HomeScreen() {
  const [text, setText] = useState('');

  return (
    // <ParallaxScrollView
    //   headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
    //   headerImage={
    //     <Image
    //       source={require('@/assets/images/partial-react-logo.png')}
    //       style={styles.reactLogo}
    //     />
    //   }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.centeredText}>Hello I am FirstHand, let me help assess the situation</ThemedText>

        <TextInput
          style={styles.input}
          placeholder="Enter text here"
          placeholderTextColor="#FDF0D5"
          value={text}
          onChangeText={text => setText(text)}
        />
    </ThemedView> 
    //</ParallaxScrollView>
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
  input: {
    margin: 15,
    height: 40,
    borderColor: '#C1121F',
    borderWidth: 1,
    padding: 10
  },
});
