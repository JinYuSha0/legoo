/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import './global.css';
import {AppProvider} from '@legoo/headless';
import {Platform, Text} from 'react-native';
import React from 'react';
import RootStack from './src/navigation/rootStack';

function App(): React.JSX.Element {
  const content = (
    <AppProvider>
      <RootStack />
    </AppProvider>
  );
  if (Platform.OS === 'web') {
    // Why wrapped by Text component?
    // Create a TextAncestorContext, make the color of the child Text component inherited
    // Related issues: https://github.com/necolas/react-native-web/issues/2634
    return <Text className="flex flex-1 text-foreground">{content}</Text>;
  }
  return content;
}

export default App;
