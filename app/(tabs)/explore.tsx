import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabTwoScreen() {
  return (
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Space for our next two features!</ThemedText>
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
    height: '100%', 
    gap: 8,
  },
});
