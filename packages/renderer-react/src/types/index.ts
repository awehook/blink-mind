import * as React from 'react';

export interface ToolbarItemConfig {
  order: number;
  element: React.ElementType;
}
export type ToolbarItemConfigs = ToolbarItemConfig[];

export interface HotKeyItem {
  label: string;
  combo: string;
  onKeyDown: (e: KeyboardEvent) => any;
}

export type HotKeyMap = Map<string, HotKeyItem>;

export interface HotKeysConfig {
  topicHotKeys: HotKeyMap;
  globalHotKeys: HotKeyMap;
}

export const HotKeyName = {
  ADD_CHILD: 'ADD_CHILD',
  ADD_SIBLING: 'ADD_SIBLING',
  DELETE_TOPIC: 'DELETE_TOPIC',
  EDIT_CONTENT: 'EDIT_CONTENT',
  EDIT_NOTES: 'EDIT_NOTES',
  SET_EDITOR_ROOT: 'SET_EDITOR_ROOT'
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
