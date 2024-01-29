import type {RootStackParamList} from '@/navigation/rootStack';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {View} from 'react-native';
import {Layout, Center, Button, Input, useThemeContext} from '@legoo/headless';
import {AmountInput, RestrictedTextInput} from '@legoo/treasure-chest';
import {ScreenNames} from '@helper/sceenNames';
import React, {memo} from 'react';
import clsx from 'clsx';

type Props = NativeStackScreenProps<RootStackParamList, ScreenNames.PREVIEW>;

function ToggleColorScheme() {
  const {colorScheme, toggleColorScheme} = useThemeContext();
  return (
    <Button onPress={toggleColorScheme}>
      {colorScheme === 'light' ? '切换深色模式' : '切换浅色模式'}
    </Button>
  );
}

const Preview: React.FC<Props> = props => {
  const {navigation} = props;
  return (
    <Layout bottomOffset={20}>
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
        <Button
          variant="destructive"
          onPress={() => navigation.push(ScreenNames.TEST, {})}>
          Go to test
        </Button>
        <Button variant="secondary" onPress={() => console.log(1111)}>
          Button
        </Button>
        <Button disabled variant="secondary" onPress={() => console.log(1111)}>
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
    </Layout>
  );
};

export default memo(Preview);
