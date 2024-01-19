/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import './global.css';
import {View} from 'react-native';
import React from 'react';

const Colors = {
  darker: '#000000',
  lighter: '#FFFFFF',
  black: '#000000',
  white: '#FFFFFF',
};

function A(...props: any) {
  console.log(props);
  return null;
}

function App(): React.JSX.Element {
  return (
    <View>
      <View className="flex-row">
        <View className="bg-primary-500 w-32 h-32 rounded-md active:bg-primary-600"></View>
        <View className="bg-green-300 w-32 h-32 rounded-md"></View>
      </View>
    </View>
  );
}

export default App;
