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

export const TopicRelationship = {
  ANCESTOR: 'ANCESTOR',
  DESCENDANT: 'DESCENDANT',
  SIBLING: 'SIBLING',
  NONE: 'NONE'
};

export const OpType = {
  TOGGLE_COLLAPSE: 'TOGGLE_COLLAPSE',
  ADD_CHILD: 'ADD_CHILD',
  ADD_SIBLING: 'ADD_SIBLING',
  DELETE_TOPIC: 'DELETE_TOPIC',
  FOCUS_TOPIC: 'FOCUS_TOPIC',
  SET_STYLE: 'SET_STYLE',
  SET_TOPIC_CONTENT: 'SET_TOPIC_CONTENT',
  SET_TOPIC_DESC: 'SET_TOPIC_DESC',
  START_EDITING_CONTENT: 'START_EDITING_CONTENT',
  START_EDITING_DESC: 'START_EDITING_DESC',
  DRAG_AND_DROP: 'DRAG_AND_DROP',
  SET_EDITOR_ROOT: 'SET_EDITOR_ROOT'
};
