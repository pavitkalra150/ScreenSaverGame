import React from 'react';
import { View, StyleSheet } from 'react-native';
import GameCanvas from './components/GameCanvas';

const App = () => {
  return (
    <View style={styles.container}>
      <GameCanvas />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;