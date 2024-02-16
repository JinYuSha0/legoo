import React, {
  type ForwardRefRenderFunction,
  forwardRef,
  memo,
  useMemo,
} from 'react';
import ThirdPartyBottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';

export interface IBottomSheetProps {
  onClose?: () => void;
}

const BottomSheet: ForwardRefRenderFunction<
  ThirdPartyBottomSheet,
  React.PropsWithChildren<IBottomSheetProps>
> = (props, ref) => {
  const {children, onClose} = props;
  const snapPoints = useMemo(() => [400], []);
  return (
    <ThirdPartyBottomSheet
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}>
      <BottomSheetView>{children}</BottomSheetView>
    </ThirdPartyBottomSheet>
  );
};

BottomSheet.displayName = 'BottomSheet';

export default memo(forwardRef(BottomSheet));
