/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import './global.css';
import {View} from 'react-native';
import {
  Provider,
  Layout,
  Center,
  Button,
  Input,
  useThemeContext,
} from '@legoo/headless';
import {AmountInput, RestrictedTextInput} from '@legoo/keyboard-manager';
import React from 'react';
import clsx from 'clsx';

function ToggleColorScheme() {
  const {colorScheme, toggleColorScheme} = useThemeContext();
  return (
    <Button onPress={toggleColorScheme}>
      {colorScheme === 'light' ? '切换深色模式' : '切换浅色模式'}
    </Button>
  );
}

function App(): React.JSX.Element {
  return (
    <Provider>
      <Layout>
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
            <Input placeholder="Please input" maxLength={30}>
              {(props, ref) => <AmountInput ref={ref} decimal={2} {...props} />}
            </Input>
            <Input placeholder="Please input" maxLength={30} className="mt-4">
              {(props, ref) => (
                <RestrictedTextInput ref={ref} regex="[^a-z|A-Z]" {...props} />
              )}
            </Input>
          </Center>
        </View>
      </Layout>
    </Provider>
  );
}

export default App;
