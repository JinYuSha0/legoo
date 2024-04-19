import {noop} from '@legoo/helper';
import {useEvent} from '@legoo/hooks';
import LoadingIndicator from '../loading';
import React, {useMemo, useState} from 'react';
import {View, Modal} from 'react-native';

interface ModalProps {}

export interface ModalInstance {
  showLoading: () => void;
  hideLoading: () => void;
}

const ModalContext = React.createContext<ModalInstance>({} as ModalInstance);

const ModalRef: React.MutableRefObject<ModalInstance> = {current: null};

export const ModalProvider: React.FC<React.PropsWithChildren<ModalProps>> = ({
  children,
}) => {
  const [isShowLoading, setShowLoading] = useState<boolean>(false);
  const showLoading = useEvent(() => {
    setShowLoading(true);
  });
  const hideLoading = useEvent(() => {
    setShowLoading(false);
  });
  const value = useMemo(
    () => ({
      showLoading,
      hideLoading,
    }),
    [],
  );
  ModalRef.current = value;
  return (
    <ModalContext.Provider value={value}>
      <>
        {children}

        {isShowLoading && (
          <Modal
            visible
            transparent
            statusBarTranslucent
            onRequestClose={noop}
            animationType="fade">
            <View className="flex-1 justify-center items-center">
              <LoadingIndicator />
            </View>
          </Modal>
        )}
      </>
    </ModalContext.Provider>
  );
};

export default {
  showLoading: () => {
    ModalRef.current.showLoading();
  },
  hideLoading: () => {
    ModalRef.current.hideLoading();
  },
};
