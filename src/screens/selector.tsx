import type {RootStackParamList} from '@/navigation/rootStack';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {View} from 'react-native';
import {Selector, Layout, Button} from '@legoo/headless';
import {useEvent} from '@legoo/hooks';
import {ScreenNames} from '@helper/sceenNames';
import React, {memo, useEffect, useRef, useState} from 'react';

type Props = NativeStackScreenProps<RootStackParamList, ScreenNames.SELECTOR>;

const data = Array.from({length: 100})
  .fill(undefined)
  .map((_, idx) => ({
    label: `${idx + 1}`,
    value: idx + 1,
  }));

const SelectorScreen: React.FC<Props> = props => {
  const time = useRef(performance.now());
  const [innerData, setInnerData] = useState(data);
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
  useEffect(() => {
    console.log('Enter page speed time:', performance.now() - time.current);
  }, []);
  return (
    <Layout bottomOffset={20}>
      <View className="flex-row">
        <View className="w-20">
          <Selector
            debug
            data={innerData}
            initialIndex={0}
            height={200}
            maxVelocity={1400}
            onChange={(value, idx) => {
              console.log(value, idx);
            }}
          />
        </View>
        <View className="w-20">
          <Selector
            data={data}
            initialIndex={6}
            height={200}
            maxVelocity={1400}
            onChange={(value, idx) => {
              console.log(value, idx);
            }}
          />
        </View>
        <View className="w-20">
          <Selector
            cycle
            debug
            data={data}
            initialIndex={7}
            height={200}
            maxVelocity={1400}
            onChange={(value, idx) => {
              console.log(value, idx);
            }}
          />
        </View>
      </View>
      <Button onPress={onPress}>reduce array</Button>
    </Layout>
  );
};

export default memo(SelectorScreen);
