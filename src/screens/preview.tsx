import type {RootStackParamList} from '@/navigation/rootStack';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {View} from 'react-native';
import {useThemeContext, Layout, Center, Button, Input} from '@legoo/headless';
import {AmountInput, RestrictedTextInput} from '@legoo/treasure-chest';
import {ScreenNames} from '@helper/sceenNames';
import {cx} from 'class-variance-authority';
import * as Helper from '@legoo/helper';
import React, {memo} from 'react';

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
          className={cx('bg-indigo-400 w-[125px] h-[125px]', {
            'rounded-md': true,
          })}></View>
      </View>
      <Center className="px-8 gap-y-6">
        <ToggleColorScheme />
        <View className="flex-row gap-x-2">
          <Button
            variant="destructive"
            onPress={() => navigation.push(ScreenNames.TEST)}>
            Go 2 Test
          </Button>
          <Button
            variant="secondary"
            onPress={() => navigation.push(ScreenNames.SELECTOR)}>
            Secondary
          </Button>
          <Button
            variant="outline"
            onPress={() =>
              console.log(Helper.computing.add('0.1', '0.2', 0.3))
            }>
            Test
          </Button>
        </View>
        <Input placeholder="Please input" maxLength={30}>
          {(props, ref) => <AmountInput ref={ref} decimal={2} {...props} />}
        </Input>
        <Input placeholder="Please input" maxLength={30}>
          {(props, ref) => (
            <RestrictedTextInput ref={ref} regex="[^a-z|A-Z]" {...props} />
          )}
        </Input>
      </Center>
    </Layout>
  );
};

export default memo(Preview);
