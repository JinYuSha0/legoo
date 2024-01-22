/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import './global.css';
import {Text, View} from 'react-native';
import {
  vars,
  StyleSheet,
  remapProps,
  useUnstableNativeVariable,
} from 'nativewind';
import React, {useEffect} from 'react';

function App(): React.JSX.Element {
  return (
    <View>
      <View className="flex-row">
        <View className="bg-primary-500 w-32 h-32 rounded-md active:bg-primary-600"></View>
        <View className="bg-green-300 w-32 h-32 rounded-md"></View>
        <View className="bg-indigo-300 w-32 h-32 rounded-md"></View>
      </View>
      <Text className="text-rose-600">112</Text>
    </View>
  );
}

export default App;
