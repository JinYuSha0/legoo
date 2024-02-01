import type {RootStackParamList} from '@/navigation/rootStack';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Text, View} from 'react-native';
import {
  type IPortalScreenProps,
  Layout,
  Center,
  Input,
  Button,
  pushPortalScreen,
} from '@legoo/headless';
import {AmountInput} from '@legoo/treasure-chest';
import {ScreenNames} from '@helper/sceenNames';
import React, {memo, useRef} from 'react';

type Props = NativeStackScreenProps<RootStackParamList, ScreenNames.TEST>;

function NonAnonymous(props: IPortalScreenProps<string, {msg: string}>) {
  const {
    route: {
      params: {msg},
    },
    future,
  } = props;
  const resultRef = useRef(msg);
  return (
    <View className="w-screen h-64 p-8 gap-y-2 bg-rose-300">
      <Input placeholder="Please input" maxLength={30}>
        {(props, ref) => (
          <AmountInput
            ref={ref}
            defaultValue={msg}
            decimal={2}
            onChangeText={text => {
              resultRef.current = text;
            }}
            {...props}
          />
        )}
      </Input>
      <Button onPress={() => future.resolve(resultRef.current)}>Ok</Button>
    </View>
  );
}

async function pushPortal() {
  try {
    const res = await pushPortalScreen<string, {msg: string}>({
      name: 'haha',
      initialParams: {msg: '10000'},
      component: NonAnonymous,
      portal: {
        direction: 'bottomCenter',
      },
    });
    console.log(res);
  } catch (err) {
    console.log(err);
  }
}

const Test: React.FC<Props> = props => {
  return (
    <Layout bottomOffset={20}>
      <View className="flex-1">
        <Center className="px-8">
          <Text>This is test</Text>
          <Button onPress={pushPortal}>Portal Test</Button>
        </Center>
      </View>
    </Layout>
  );
};

export default memo(Test);
