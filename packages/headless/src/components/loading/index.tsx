import React from 'react';
import {ActivityIndicator, View, Text} from 'react-native';

const LoadingIndicator: React.FC<{message?: string}> = props => {
  return (
    <View className="p-5 min-w-[120px] min-h-[120px] bg-popover-foreground/60 rounded-2xl justify-center items-center">
      <ActivityIndicator className="color-popover" size="large" />
      <Text className="text-popover mt-5">Loading...</Text>
    </View>
  );
};

export default LoadingIndicator;
