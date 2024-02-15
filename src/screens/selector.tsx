import type {RootStackParamList} from '@/navigation/rootStack';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Text, View} from 'react-native';
import {Picker, DatePicker, Layout, Button} from '@legoo/headless';
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
            cycle
            clickable
            data={data}
            initialIndex={7}
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

const SelectorScreen: React.FC<Props> = props => {
  return (
    <Layout bottomOffset={20}>
      <DatePicker
        mode="date"
        height={200}
        onChange={date => {
          console.log(date);
        }}
        pickerProps={{}}
      />
      {/* <WheelPicker /> */}
    </Layout>
  );
};

export default memo(SelectorScreen);
