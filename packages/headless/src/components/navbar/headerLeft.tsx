import {type ForwardRefRenderFunction, forwardRef, memo} from 'react';
import {View} from 'react-native';
import {ChevronLeft} from 'lucide-react-native';
import {cssInterop} from 'nativewind';
import React from 'react';
import Button from '../button/button';
import clsx from 'clsx';

cssInterop(ChevronLeft, {
  className: 'style',
});

export interface HeaderLeftProps {
  className?: string;
  goBack: () => void;
}

export const HeaderLeft: ForwardRefRenderFunction<View, HeaderLeftProps> = (
  props,
  ref,
) => {
  const {className, goBack} = props;
  return (
    <Button ref={ref} variant="none" size="icon" onPress={goBack}>
      <ChevronLeft className={clsx('text-foreground', className)} />
    </Button>
  );
};

HeaderLeft.displayName = 'HeaderLeft';

export default memo(forwardRef(HeaderLeft));
