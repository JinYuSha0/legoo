import {type ForwardRefRenderFunction, forwardRef, memo} from 'react';
import {View} from 'react-native';
import {ChevronLeft} from 'lucide-react-native';
import {cssInterop} from 'nativewind';
import {cx} from 'class-variance-authority';
import React from 'react';
import Button from '../button/button';

cssInterop(ChevronLeft, {
  className: 'style',
});

export interface IHeaderLeftProps {
  className?: string;
  goBack: () => void;
}

export const HeaderLeft: ForwardRefRenderFunction<View, IHeaderLeftProps> = (
  props,
  ref,
) => {
  const {className, goBack} = props;
  return (
    <Button ref={ref} variant="none" size="icon" onPress={goBack}>
      <ChevronLeft className={cx('text-foreground', className)} />
    </Button>
  );
};

HeaderLeft.displayName = 'HeaderLeft';

export default memo(forwardRef(HeaderLeft));
