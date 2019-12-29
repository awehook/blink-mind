import { ThemeType } from '../../configs/theme/types';
import { DiagramLayoutType, KeyType } from '../../types';
import { Model } from '../model';
import { Topic } from '../topic';

export type ModifierArg =
  | BaseModifierArg
  | SetTopicArg
  | SetBlockDataArg
  | SetFocusModeArg
  | SetTopicStyleArg
  | SetZoomFactorArg
  | SetThemeArg
  | SetLayoutDirArg;

export type BaseModifierArg = {
  model: Model;
  topicKey?: KeyType;
};

export type SetTopicArg = BaseModifierArg & {
  topic: Topic;
};

export type SetBlockDataArg = BaseModifierArg & {
  blockType: string;
  data: any;
  focusMode?: string;
};

export type DeleteBlockArg = BaseModifierArg & {
  blockType: string;
}

export type SetFocusModeArg = BaseModifierArg & {
  focusMode: string;
};

export type SetTopicStyleArg = BaseModifierArg & {
  style: string;
};

export type SetZoomFactorArg = BaseModifierArg & {
  zoomFactor: number;
};

export type SetThemeArg = BaseModifierArg & {
  theme: ThemeType;
};

export type SetLayoutDirArg = BaseModifierArg & {
  layoutDir: DiagramLayoutType;
};

export type ModifierResult = Model;
