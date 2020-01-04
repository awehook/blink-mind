import { OpType, TopicContentStyle } from '@blink-mind/core';
import { Button, Popover } from '@blueprintjs/core';
import debug from 'debug';
import * as React from 'react';
import { SketchPicker } from 'react-color';
import styled from 'styled-components';
import {
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

const StyleEditorRoot = styled(ZIndex)`
  position: absolute;
  background: white;
  right: 30px;
  top: 20px;
  border-radius: 2px;
  user-select: none;
`;

const PopRoot = styled.div`
  padding: 0 10px;
`;

export class StyleEditor extends BaseWidget {
  constructor(props) {
    super(props);
    this.state = {
      showPanel: false
    };
  }

  setShowPanel = showPanel => () => {
    this.setState({
      showPanel: showPanel
    });
  };

  setTopicContentStyle = style => {
    const props = this.props;
    const { controller } = props;
    controller.run('setTopicContentStyle', { ...props, style });
  };

  handleBackgroundColorChange = color => {
    this.setTopicContentStyle({ background: color.hex });
  };

  handleClearStyle = () => {
    if (this.topic.style) {
      this.operation(OpType.SET_STYLE, { ...this.props, style: null });
      // 为什么需要呢？
      // this.setState({});
    }
  };

  copiedStyle;

  handleCopyStyle = () => {
    const props = this.props;
    const { controller } = props;
    this.copiedStyle = controller.run('getTopicStyle', props);
    log(this.copiedStyle);
  };

  handlePasteStyle = () => {
    if (this.copiedStyle) {
      this.operation(OpType.SET_STYLE, {
        ...this.props,
        style: JSON.stringify(this.copiedStyle)
      });
      // this.setState({});
    }
  };

  render() {
    const props = this.props;
    const { controller, model, zIndex } = props;
    if (!model.focusKey) return null;
    const topicStyle: TopicContentStyle = controller.run(
      'getTopicContentStyle',
      props
    );

    const setStyle = this.setTopicContentStyle;
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
                    onChangeComplete={this.handleBackgroundColorChange}
                  />
                </div>
              </Popover>
            </SettingItem>
          </div>
        </SettingGroup>
        {LinkStyleEditor(props)}
        <SettingGroup>
          <SettingItem>
            <Button onClick={this.handleClearStyle}>Clear Topic Style</Button>
          </SettingItem>
          <SettingItem>
            <Button onClick={this.handleCopyStyle}>Copy Style</Button>
          </SettingItem>
          <SettingItem>
            <Button onClick={this.handlePasteStyle}>Paste Style</Button>
          </SettingItem>
        </SettingGroup>
        {ClearAllCustomStyle(props)}
      </PopRoot>
    );
  }
}
