/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import './global.css';
import {Text, View} from 'react-native';
import {Button} from '@legoo/headless';
import React from 'react';
import cx from 'classnames';
import {Pressable} from 'react-native';

function App(): React.JSX.Element {
  return (
    <View>
      <View className="flex-row">
        <View className="bg-primary-500 w-[125px] h-[125px] rounded-md active:bg-primary-600"></View>
        <View className="bg-green-500 w-[125px] h-[125px] rounded-md"></View>
        <View
          className={cx('bg-indigo-500 w-[125px] h-[125px]', {
            'rounded-md': true,
          })}></View>
      </View>
      <Button>8888</Button>
    </View>
  );
}

export default App;
