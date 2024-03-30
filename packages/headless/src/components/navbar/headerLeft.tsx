import {type ForwardRefRenderFunction, forwardRef, memo} from 'react';
import {View} from 'react-native';
import {ChevronLeft} from 'lucide-react-native';
import {cssInterop} from 'nativewind';
import {useUnstableNativeVariable} from 'react-native-css-interop';
import {variableToColor} from '@legoo/helper';
import React from 'react';
import Button from '../button/button';

export interface IHeaderLeftProps {
  goBack: () => void;
}

export const HeaderLeft: ForwardRefRenderFunction<View, IHeaderLeftProps> = (
  props,
  ref,
) => {
  const {goBack} = props;
  const color = variableToColor(useUnstableNativeVariable('--foreground'));
  return (
    <Button ref={ref} variant="none" size="icon" onPress={goBack}>
      <ChevronLeft color={color} />
    </Button>
  );
};

HeaderLeft.displayName = 'HeaderLeft';

cssInterop(HeaderLeft, {});

export default memo(forwardRef(HeaderLeft));
