import type {RootStackParamList} from '@/navigation/rootStack';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {View} from 'react-native';
import {Selector, Layout} from '@legoo/headless';
import {ScreenNames} from '@helper/sceenNames';
import React, {memo, useEffect, useRef} from 'react';

type Props = NativeStackScreenProps<RootStackParamList, ScreenNames.SELECTOR>;

const data = Array.from({length: 100})
  .fill(undefined)
  .map((_, idx) => ({
    label: `${idx + 1}`,
    value: idx + 1,
  }));

const SelectorScreen: React.FC<Props> = props => {
  const startRef = useRef(+new Date());
  useEffect(() => {
    console.log(+new Date() - startRef.current);
  }, []);
  return (
    <Layout bottomOffset={20}>
      <View className="w-20">
        <Selector data={data} visibleItemCount={9} maxVelocity={3000} />
      </View>
    </Layout>
  );
};

export default memo(SelectorScreen);
