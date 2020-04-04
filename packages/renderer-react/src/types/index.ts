import { IHotkeyProps } from '@blueprintjs/core';
import * as React from 'react';

export type ValueOf<T> = T[keyof T];

export interface ElementItemConfig {
  order: number;
  element: React.ElementType;
}
export type ElementItemConfigs = ElementItemConfig[];

export type HotKeyMap = Map<string, IHotkeyProps>;

export interface HotKeysConfig {
  topicHotKeys: HotKeyMap;
  viewModeTopicHotKeys: Map<string, HotKeyMap>;
  globalHotKeys: HotKeyMap;
}

export const HotKeyName = {
  ADD_CHILD: 'ADD_CHILD',
  ADD_SIBLING: 'ADD_SIBLING',
  DELETE_TOPIC: 'DELETE_TOPIC',
  SWAP_UP: 'SWAP_UP',
  SWAP_DOWN: 'SWAP_DOWN',
  EDIT_CONTENT: 'EDIT_CONTENT',
  EDIT_NOTES: 'EDIT_NOTES',
  DELETE_NOTES: 'DELETE_NOTES',
  SET_EDITOR_ROOT: 'SET_EDITOR_ROOT',
  PASTE: 'PASTE'
};

export const MoveTopicDir = {
  CENTER: 0,
  LEFT_CENTER: 1
};

export interface RightTopPanelState {
  isOpen: boolean;
  selectedTabId: string;
}

export interface DragDropState {
  targetKey: KeyType;
  targetDir: 'in' | 'prev' | 'next';
}

export interface ITopicDescEditor {
  getContent(): any;
}
