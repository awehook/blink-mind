import { OpType, TopicContentStyle } from '@blink-mind/core';
import { Button, Popover } from '@blueprintjs/core';
import debug from 'debug';
import * as React from 'react';
import { SketchPicker } from 'react-color';
import styled from 'styled-components';
import {
  BaseProps,
  BaseWidget,
  CloseIcon,
  IconBg,
  ShowMenuIcon,
  Title,
  ZIndex
} from '../../../../components/common';
import { iconClassName, IconName } from '../../../../utils';
import { BorderStyleEditor } from './border-style-editor';
import { ClearAllCustomStyle } from './clear-all-custom-style';
import {
  ColorBar,
  SettingGroup,
  SettingItem,
  SettingTitle,
  WithBorder
} from './components';
import { LinkStyleEditor } from './link-style-editor';
import { TextStyleEditor } from './text-style-editor';

const log = debug('node:style-editor');

const PopRoot = styled.div`
  padding: 0 10px;
`;

let copiedStyle;

export function StyleEditor(props: BaseProps) {
  const { controller, model, topicKey } = props;
  const topic = model.getTopic(topicKey);
  const setTopicContentStyle = style => {
    controller.run('setTopicContentStyle', { ...props, style });
  };

  const handleBackgroundColorChange = color => {
    setTopicContentStyle({ background: color.hex });
  };

  const handleClearStyle = () => {
    if (topic.style) {
      controller.run('operation', {
        ...props,
        opType: OpType.SET_STYLE,
        style: null
      });
    }
  };

  const handleCopyStyle = () => {
    copiedStyle = controller.run('getTopicStyle', props);
    log(copiedStyle);
  };

  const handlePasteStyle = () => {
    if (copiedStyle) {
      controller.run('operation', {
        ...props,
        opType: OpType.SET_STYLE,
        style: JSON.stringify(copiedStyle)
      });
    }
  };

  if (!model.focusKey) return null;
  const topicStyle: TopicContentStyle = controller.run(
    'getTopicContentStyle',
    props
  );

  const setStyle = setTopicContentStyle;
  return (
    <PopRoot>
      {BorderStyleEditor({ ...props, topicStyle, setStyle })}
      {TextStyleEditor({ ...props, topicStyle, setStyle })}
      <SettingGroup>
        <SettingTitle>Background</SettingTitle>
        <div>
          <SettingItem>
            <Popover>
              <WithBorder>
                <div className={iconClassName(IconName.COLOR_PICKER)} />
                <ColorBar color={topicStyle.background} />
              </WithBorder>
              <div>
                <SketchPicker
                  color={topicStyle.background}
                  onChangeComplete={handleBackgroundColorChange}
                />
              </div>
            </Popover>
          </SettingItem>
        </div>
      </SettingGroup>
      {LinkStyleEditor(props)}
      <SettingGroup>
        <SettingItem>
          <Button onClick={handleClearStyle}>Clear Topic Style</Button>
        </SettingItem>
        <SettingItem>
          <Button onClick={handleCopyStyle}>Copy Style</Button>
        </SettingItem>
        <SettingItem>
          <Button onClick={handlePasteStyle}>Paste Style</Button>
        </SettingItem>
      </SettingGroup>
      {ClearAllCustomStyle(props)}
    </PopRoot>
  );
}
