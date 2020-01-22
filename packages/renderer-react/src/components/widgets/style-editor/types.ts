import { TopicContentStyle } from '@blink-mind/core';
import { BaseProps } from '../../common';

export interface ContentStyleEditorProps extends BaseProps {
  contentStyle: TopicContentStyle;
  setContentStyle: (TopicContentStyle) => void;
}
