import type {RootStackParamList} from '@/navigation/rootStack';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Text, View} from 'react-native';
import {
  type DateType,
  Picker,
  DatePicker,
  Layout,
  Button,
} from '@legoo/headless';
import {useEvent} from '@legoo/hooks';
import {ScreenNames} from '@helper/sceenNames';
import React, {Profiler, memo, useEffect, useRef, useState} from 'react';

type Props = NativeStackScreenProps<RootStackParamList, ScreenNames.SELECTOR>;

const data = Array.from({length: 1000})
  .fill(undefined)
  .map((_, idx) => ({
    label: `${idx + 1}`,
    value: idx + 1,
  }));

const WheelPicker: React.FC<{}> = props => {
  const time = useRef(performance.now());
  const [innerData, setInnerData] = useState(data);
  const [result, setResult] = useState('');
  const onPress = useEvent(() => {
    setInnerData(
      Array.from({length: 28})
        .fill(undefined)
        .map((_, idx) => ({
          label: `${idx + 1}`,
          value: idx + 1,
        })),
    );
  });
  const onChange = useEvent((value, idx) => {
    console.log(value);
    setResult(`${value},${idx}`);
  });
  useEffect(() => {
    console.log('Enter page speed time:', performance.now() - time.current);
  }, []);
  return (
    <View>
      <View className="flex-row justify-center">
        <View className="w-20">
          <Profiler
            id="selector1"
            onRender={(
              id,
              phase,
              actualDuration,
              baseDuration,
              startTime,
              commitTime,
            ) => {
              console.log(id, phase, actualDuration);
            }}>
            <Picker
              cycle
              clickable
              data={innerData}
              initialIndex={0}
              height={200}
              onChange={onChange}
            />
          </Profiler>
        </View>
        <View className="w-20">
          <Picker
            clickable
            data={data}
            initialIndex={6}
            height={200}
            maxVelocity={1400}
            onChange={onChange}
          />
        </View>
        <View className="w-20">
          <Picker
            clickable
            data={data}
            initialIndex={0}
            height={200}
            maxVelocity={1400}
            onChange={onChange}
          />
        </View>
      </View>
      <Button onPress={onPress}>reduce array</Button>
      <Text>{result}</Text>
    </View>
  );
};

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

const SelectorScreen: React.FC<Props> = props => {
  return (
    <Layout bottomOffset={20}>
      <DatePicker
        mode="date"
        initDate={new Date('1989-6-4')}
        columnsOrder={['year', 'month', 'day', 'hour', 'minute']}
        formatter={dateFormatter}
        onChange={date => {
          console.log(date);
        }}
      />
      <WheelPicker />
    </Layout>
  );
};

export default memo(SelectorScreen);
