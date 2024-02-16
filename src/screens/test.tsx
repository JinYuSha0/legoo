import type {RootStackParamList} from '@/navigation/rootStack';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Text, View} from 'react-native';
import {
  type IPortalScreenProps,
  type DateType,
  Layout,
  Center,
  Input,
  Button,
  pushPortalScreen,
  DatePicker,
} from '@legoo/headless';
import {AmountInput} from '@legoo/treasure-chest';
import {ScreenNames} from '@helper/sceenNames';
import React, {memo, useRef} from 'react';
import BottomSheet from './bottomsheet';

type Props = NativeStackScreenProps<RootStackParamList, ScreenNames.TEST>;

function dateFormatter(value: string, type: DateType) {
  switch (type) {
    case 'year':
      return `${value}年`;
    case 'month':
      return `${value}月`;
    case 'day':
      return `${value}日`;
  }
  return value;
}

function NonAnonymous(props: IPortalScreenProps<string, {msg: string}>) {
  const {
    route: {
      params: {msg},
    },
    future,
  } = props;
  const resultRef = useRef(msg);
  return (
    <BottomSheet
      snapPoints={[400]}
      onClose={() => future.reject('Portal screen closed by bottomsheet')}>
      <View className="flex flex-col justify-between p-8 gap-y-8">
        <DatePicker
          mode="date"
          initDate={new Date('1989-6-4')}
          columnsOrder={['year', 'month', 'day', 'hour', 'minute']}
          formatter={dateFormatter}
          onChange={date => {
            console.log(date);
          }}
        />
        <Button onPress={() => future.resolve(resultRef.current)}>Ok</Button>
      </View>
    </BottomSheet>
  );
}

async function pushPortal() {
  try {
    const res = await pushPortalScreen<string, {msg: string}>({
      initialParams: {msg: '10000'},
      component: NonAnonymous,
      portal: {
        direction: 'bottomCenter',
      },
    });
    console.log(111, res);
  } catch (err) {
    console.error(err);
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
