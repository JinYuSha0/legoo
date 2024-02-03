import React, {isValidElement} from 'react';
import {View, Text, Pressable} from 'react-native';
import {pushPortalScreen} from '../portal';
import Button from '../button/button';
import {X} from 'lucide-react-native';
import {type IPortalScreenProps} from '../portal';
import clsx from 'clsx';

export interface IAlertDialogProps {
  title: React.ReactNode;
  content: React.ReactNode;
  cancelBtn?: React.ReactNode;
  okBtn?: React.ReactNode;
  onOk?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
}

const AlertDialog = (props: IPortalScreenProps<any, IAlertDialogProps>) => {
  const {
    route: {
      params: {
        onOk = () => {},
        onCancel = () => {},
        onClose = () => {},
        title,
        content,
        cancelBtn,
        okBtn,
        className,
        titleClassName,
        contentClassName,
      },
    },
    future,
  } = props;

  const Ok = () => {
    onOk();
    future.resolve(true);
  };
  const cancel = () => {
    onCancel();
    future.resolve(false);
  };
  const close = () => {
    onClose();
    future.resolve(undefined);
  };
  return (
    <View>
      <Pressable
        onPress={close}
        className="top-0 bottom-0 left-0 right-0 fixed bg-transparent"></Pressable>
      <View
        className={clsx(
          'bg-white w-full max-w-xs p-3 border rounded-md min-w-[250px] gap-2 text-foreground text-base',
          className,
        )}>
        <View className={clsx('pr-5 text-lg', titleClassName)}>
          {isValidElement(title) ? title : <Text>{title}</Text>}
        </View>
        <View
          className={clsx('text-sm text-muted-foreground', contentClassName)}>
          {isValidElement(content) ? content : <Text>{content}</Text>}
        </View>
        <View className="flex flex-row-reverse">
          {isValidElement(okBtn) ? (
            <Pressable onPress={Ok} className="ml-3">
              {okBtn}
            </Pressable>
          ) : (
            <Button className="ml-3" onPress={Ok}>
              {okBtn || '确认'}
            </Button>
          )}
          {isValidElement(cancelBtn) ? (
            <Pressable onPress={cancel}>{cancelBtn}</Pressable>
          ) : (
            <Button variant="outline" onPress={cancel}>
              {cancelBtn || '取消'}
            </Button>
          )}
        </View>
        <Pressable className="absolute right-3 top-4" onPress={close}>
          <Text>
            <X className="w-4 h-4" />
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const renderModal = async (props: IAlertDialogProps) => {
  const result = await pushPortalScreen<boolean, IAlertDialogProps>({
    initialParams: {...props},
    component: AlertDialog,
    portal: {
      direction: 'middleCenter',
    },
  });

  return result;
};

export default {show: renderModal};
