/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import './global.css';
import {normalization, AppProvider} from '@legoo/headless';
import React from 'react';
import RootStack from './src/navigation/rootStack';

normalization(['ios', 'android']);

function App(): React.JSX.Element {
  return (
    <AppProvider>
      <RootStack />
    </AppProvider>
  );
}

export default App;
