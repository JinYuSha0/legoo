import type {RootStackParamList} from '@/navigation/rootStack';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Text, View} from 'react-native';
import {Layout, Center} from '@legoo/headless';
import {ScreenNames} from '@helper/sceenNames';
import {Button} from '@legoo/headless';
import React, {memo} from 'react';

type Props = NativeStackScreenProps<RootStackParamList, ScreenNames.TEST>;

const Test: React.FC<Props> = props => {
  const {navigation} = props;
  return (
    <Layout bottomOffset={20}>
      <View className="flex-1">
        <Center className="px-8">
          <Text>This is test</Text>
          <View />
          <Button variant="secondary" onPress={navigation.goBack}>
            Back
          </Button>
        </Center>
      </View>
    </Layout>
  );
};

export default memo(Test);
