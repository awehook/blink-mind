export type KeyType = string;

export enum TopicWidgetDirection {
  LEFT, // 从右向左
  RIGHT, // 从左向右
  ROOT // root
}

export enum DiagramLayoutDirection {
  LEFT_TO_RIGHT,
  RIGHT_TO_LEFT,
  LEFT_AND_RIGHT
}

export const BlockType = {
  CONTENT: 'CONTENT',
  DESC: 'DESC'
};

export const FocusItemMode = {
  NORMAL: 'NORMAL',
  EDITING_CONTENT: 'EDITING_CONTENT',
  EDITING_DESC: 'EDITING_DESC',
  SHOW_POPUP: 'SHOW_POPUP',
};
