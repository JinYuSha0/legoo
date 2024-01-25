/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import './global.css';
import {View} from 'react-native';
import {
  ThemeProvider,
  useThemeContext,
  Button,
  ButtonVariants,
  Center,
} from '@legoo/headless';
import React from 'react';
import cx from 'classnames';

function ToggleColorScheme() {
  const {theme, toggleColorScheme} = useThemeContext();
  return (
    <Button
      onPress={() => {
        toggleColorScheme();
      }}>
      toggleColorScheme
    </Button>
  );
}

function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <View className="flex-1 bg-background">
        <View className="flex-row">
          <View className="bg-primary w-[125px] h-[125px] rounded-md "></View>
          <View className="bg-green-500 w-[125px] h-[125px] rounded-md"></View>
          <View
            className={cx('bg-indigo-400 w-[125px] h-[125px]', {
              'rounded-md': true,
            })}></View>
        </View>
        <Center>
          <View className="h-4 w-full"></View>
          <ToggleColorScheme />
          <View className="h-4 w-full"></View>
          <Button variants={ButtonVariants.Secondary}>Button</Button>
        </Center>
      </View>
    </ThemeProvider>
  );
}

export default App;
