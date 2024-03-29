import type {IItemProps} from './item';
import type {IIndicatorProps} from './indicator';

export type IItem<T = any> = {
  label: string;
  value: T;
};

export interface IPickerProps<T = any> {
  /**
   * Data array
   */
  data: IItem<T>[];
  /**
   * Picker height
   * default: true
   */
  height?: number;
  /**
   * Whether the rendering list is cycle
   */
  cycle?: boolean;
  /**
   * Whether the item enables click selection function
   */
  clickable?: boolean;
  /**
   * Initial selected index
   * default: 0
   */
  initialIndex?: number;
  /**
   * Render Item height
   * default: 30
   */
  itemHeight?: number;
  /**
   * Scroll container height
   * this value determines the maximum scroll distance you can scroll in both directions.
   * default: 30 * 2001
   */
  containerHeight?: number;
  /**
   * Render an extra number of items outside the visible range
   * if a white screen appears when you scroll quickly, you can try increasing this value.
   * if the value is particularly large, it may cause the rendering speed to slow down.
   * deafult: Three times the number of items in the visible range
   */
  extraRenderItem?: number;
  /**
   * This value determines how many items remain from the boundary to start the next round of lazy rendering.
   * if a white screen appears when you scroll quickly, you can try decreasing this value.
   * if the value is particularly small, it may cause the unnecessary rendering.
   * default: Math.ceil(extraRenderItem / 2)
   */
  renderThreshold?: number;
  /**
   * Debug mode
   */
  debug?: boolean;
  /**
   * Disable pan gestures
   */
  disabled?: boolean;
  /**
   * Maximum scroll velocity
   * if the velocity is too high, it will easily cause a white screen.
   * limit the velocity to reduce unnecessary rendering.
   */
  maxVelocity?: number;
  /**
   * If the velocityY is less than this value,
   * it is judged as a click event,
   * which may be different for each model.
   */
  velocityYClickThreshould?: number;
  /**
   * Item component
   * it is recommended to use the React.memo package to improve performance
   */
  ItemComponent?: React.ComponentType<IItemProps>;
  /**
   * Indicator Component
   */
  IndicatorComponent?: React.ComponentType<IIndicatorProps>;
  /**
   * Generate a unique key for the item
   * value: value of item
   * index: index of item
   * direction: -1(the top half) 1(the bottom half)
   * dataUpdateCount: Count of data updates
   */
  keyExtractor?: (value: T, index: number, direction: -1 | 1) => string;
  /**
   * A callback triggered when the selection changes.
   * the first parameter is the selected value,
   * and the second parameter is the index of the selection in the data array.
   */
  onChange?: (value: T, index: number) => void;
  /**
   * Callback triggered by picker state changes.
   * begin: Animation begin
   * running: Animation running
   * finished: Animation finished
   */
  onStatusChange?: (status: PickerStatus) => void;
}

export type PickerStatus = 'begin' | 'running' | 'finished';

export type WrapItem = {
  top: number;
  wrapped: IItem;
  direction: -1 | 1;
  lazy?: boolean;
};
