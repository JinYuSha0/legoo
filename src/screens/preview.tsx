import type {RootStackParamList} from '@/navigation/rootStack';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {View} from 'react-native';
import {
  useThemeContext,
  addPortalScreen,
  Layout,
  Center,
  Button,
  Input,
} from '@legoo/headless';
import {AmountInput, RestrictedTextInput} from '@legoo/treasure-chest';
import {ScreenNames} from '@helper/sceenNames';
import {computing, nextTick} from '@legoo/helper';
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

function NonAnonymous(props: any) {
  console.log(props.route.params);
  return (
    <View className="w-screen h-24 bg-rose-300">
      <Input placeholder="Please input" maxLength={30}>
        {(props, ref) => <AmountInput ref={ref} decimal={2} {...props} />}
      </Input>
    </View>
  );
}

const Preview: React.FC<Props> = props => {
  const {navigation} = props;

  async function addPortal() {
    const remove = addPortalScreen({
      name: 'haha',
      initialParams: {msg: 'hello'},
      component: NonAnonymous,
      portal: {
        direction: 'bottomCenter',
      },
    });
    await nextTick();
    navigation.push('haha');
  }
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
      <Center className="px-8 gap-y-6">
        <ToggleColorScheme />
        <View className="flex-row gap-x-2">
          <Button
            variant="destructive"
            onPress={() => navigation.push(ScreenNames.TEST)}>
            Go 2 Test
          </Button>
          <Button variant="secondary" onPress={addPortal}>
            BottomSheet
          </Button>
          <Button
            variant="outline"
            onPress={() => console.log(111, computing.add('1', 2, 3, '4', 5))}>
            Modal
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
