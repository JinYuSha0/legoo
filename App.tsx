/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import './global.css';
import {Text, View} from 'react-native';
import {
  ThemeProvider,
  useThemeContext,
  Center,
  Button,
  Input,
} from '@legoo/headless';
import React from 'react';
import clsx from 'clsx';

function ToggleColorScheme() {
  const {colorScheme, toggleColorScheme} = useThemeContext();
  return <Button onPress={toggleColorScheme}>toggleColorScheme</Button>;
}

function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <View className="flex-1 bg-background">
        <View className="flex-row">
          <View className="bg-primary w-[125px] h-[125px] rounded-md "></View>
          <View className="bg-green-500 w-[125px] h-[125px] rounded-md"></View>
          <View
            className={clsx('bg-indigo-400 w-[125px] h-[125px]', {
              'rounded-md': true,
            })}></View>
        </View>
        <Center className="px-8">
          <View className="h-4 w-full"></View>
          <ToggleColorScheme />
          <View className="h-4 w-full"></View>
          <Button variant="destructive" onPress={() => console.log(1111)}>
            Button
          </Button>
          <Button variant="secondary" onPress={() => console.log(1111)}>
            Button
          </Button>
          <Button
            disabled
            variant="secondary"
            onPress={() => console.log(1111)}>
            Button
          </Button>
          <Input placeholder="Please input" />
        </Center>
      </View>
    </ThemeProvider>
  );
}

export default App;
