import type {TextStyle} from 'react-native';
import {PropertyDirection} from './index';

type PropertyRecord = Partial<Record<keyof TextStyle, PropertyDirection>>;

export const propertyRecord: PropertyRecord = {
  height: 1,
  width: 0,
  maxHeight: 1,
  maxWidth: 0,
  minHeight: 1,
  minWidth: 0,

  borderBottomWidth: 0,
  borderLeftWidth: 0,
  borderRightWidth: 0,
  borderTopWidth: 0,
  borderWidth: 0,

  borderBottomEndRadius: 0,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  borderBottomStartRadius: 0,
  borderEndEndRadius: 0,
  borderEndStartRadius: 0,
  borderRadius: 0,
  borderStartEndRadius: 0,
  borderStartStartRadius: 0,
  borderTopEndRadius: 0,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  borderTopStartRadius: 0,

  margin: 0,
  marginBottom: 1,
  marginHorizontal: 0,
  marginLeft: 0,
  marginRight: 0,
  marginTop: 1,
  marginVertical: 1,

  padding: 0,
  paddingBottom: 1,
  paddingHorizontal: 0,
  paddingLeft: 0,
  paddingRight: 0,
  paddingTop: 1,
  paddingVertical: 1,

  top: 1,
  left: 0,
  bottom: 1,
  right: 0,

  gap: 0,
  rowGap: 0,
  columnGap: 1,

  translateX: 0,
  translateY: 1,

  // Font related
  fontSize: 0,
  letterSpacing: 0,
  lineHeight: 0,

  // Depends on other properties
  start: 0,
  end: 0,
  borderStartWidth: 0,
  borderEndWidth: 0,
  marginStart: 0,
  marginEnd: 0,
  paddingStart: 0,
  paddingEnd: 0,
  flexBasis: 0,
};
