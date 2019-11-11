import { Model } from '@blink-mind/core';

export type KeyType = string;

export const TopicDirection = {
  LEFT: 'L', // 从右向左
  RIGHT: 'R', // 从左向右
  BOTTOM: 'B', // 从上往下
  MAIN: 'M' // root
};

export enum DiagramLayoutType {
  LEFT_TO_RIGHT,
  RIGHT_TO_LEFT,
  LEFT_AND_RIGHT,
  TOP_TO_BOTTOM
}

export const TopicVisualLevel = {
  ROOT: 0,
  PRIMARY: 1,
  NORMAL: 2
};

export const BlockType = {
  CONTENT: 'CONTENT',
  DESC: 'DESC'
};

export const FocusMode = {
  NORMAL: 'NORMAL',
  EDITING_CONTENT: 'EDITING_CONTENT',
  EDITING_DESC: 'EDITING_DESC',
  SHOW_POPUP: 'SHOW_POPUP',
  DRAGGING: 'DRAGGING'
};

export type OnChangeFunction = (model: Model) => void;
