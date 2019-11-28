import { OpType, TopicStyle } from '@blink-mind/core';
import {
  Button,
  Divider,
  InputGroup,
  MenuItem,
  NumericInput,
  Popover
} from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import debug from 'debug';
import { isEqual } from 'lodash';
import * as React from 'react';
import { SketchPicker } from 'react-color';
import styled from 'styled-components';
import {
  BaseWidget,
  CloseIcon,
  Flex,
  IconBg,
  Margin,
  ShowMenuIcon,
  Title
} from '../../../../components/common';
import { iconClassName, IconName } from '../../../../utils';

const log = debug('node:style-editor');

const StyleEditorRoot = styled.div`
  position: absolute;
  background: white;
  right: 30px;
  top: 20px;
  border-radius: 2px;
  z-index: 4;
`;

const PopRoot = styled.div`
  padding: 10px;
`;

const WithBorder = styled.div`
  border: 1px solid grey;
  cursor: pointer;
  font-weight: bold;
`;

const SettingTitle = styled.div`
  margin-top: 10px;
  margin-bottom: 5px;
  font-weight: bold;
`;

const SettingItem = styled.span`
  margin: 0px 10px 0px 0px;
`;

const SettingGroup = props => {
  return (
    <div>
      {props.children}
      <Divider style={{ margin: '10px 0' }} />
    </div>
  );
};

const ColorBar = styled.div`
  height: 3px;
  width: 80%;
  margin-left: 10%;
  margin-right: 10%;
  margin-bottom: 2px;
  background: ${props => props.color};
`;

const PxSelect = Select.ofType();

const renderItem = unit => (width, { handleClick, modifiers, query }) => {
  return (
    <MenuItem text={`${width}${unit}`} key={width} onClick={handleClick} />
  );
};

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

  setStyle = obj => {
    const style = this.topic.style;
    const styleObj = style ? JSON.parse(style) : {};
    const newStyleObj = {
      ...styleObj,
      ...obj
    };
    if (!isEqual(styleObj, newStyleObj)) {
      const newStyleStr = JSON.stringify(newStyleObj);
      this.operation(OpType.SET_STYLE, { ...this.props, style: newStyleStr });
    }
  };

  setLinkStyle = obj => {
    const style = this.topic.style;
    const styleObj = style ? JSON.parse(style) : {};
    const newStyleObj = {
      ...styleObj,
      linkStyle: {
        ...styleObj.linkStyle,
        ...obj
      }
    };
    if (!isEqual(styleObj, newStyleObj)) {
      const newStyleStr = JSON.stringify(newStyleObj);
      this.operation(OpType.SET_STYLE, { ...this.props, style: newStyleStr });
    }
  };

  handleBorderWidthChange = value => {
    log('handleBorderWithChange:', value);
    this.setStyle({ borderWidth: `${value}px` });
  };

  handleBorderStyleChange = value => {
    this.setStyle({ borderStyle: value });
  };

  handleBorderRadiusChange = value => {
    log('handleBorderRadiusChange:', value);
    this.setStyle({ borderRadius: `${value}px` });
  };

  handleLinkWidthChange = value => {
    log('handleBorderRadiusChange:', value);
    this.setLinkStyle({ lineWidth: `${value}px` });
  };

  handleBorderColorChange = color => {
    this.setStyle({ borderColor: color.hex });
  };

  handleBackgroundColorChange = color => {
    this.setStyle({ background: color.hex });
  };

  handleLinkColorChange = color => {
    this.setLinkStyle({ lineColor: color.hex });
  };

  handleFontSizeChange = value => {
    log('handleFontSizeChange:', value);
    this.setStyle({ fontSize: value });
  };

  handleLineHeightChange = e => {
    log('handleLineHeightChange:', e.target.value);
    this.setStyle({ lineHeight: e.target.value });
  };

  handleColorChange = color => {
    this.setStyle({ color: color.hex });
  };

  render() {
    const props = this.props;
    const { controller, model } = props;
    if (!model.focusKey) return null;
    const topicStyle: TopicStyle = controller.run('getTopicStyle', props);
    const linkStyle = topicStyle.linkStyle;
    if (!this.state.showPanel) {
      return (
        <StyleEditorRoot>
          <IconBg onClick={this.setShowPanel(true)}>
            <ShowMenuIcon className={iconClassName(IconName.SHOW_MENU)} />
          </IconBg>
        </StyleEditorRoot>
      );
    }

    const borderWidthItems = [...Array(7).keys()];
    const borderRadiusItems = [0, 5, 10, 15, 20, 25, 30, 35];
    const borderStyleItems = ['none', 'solid', 'dotted', 'dashed', 'double'];
    const fontSizeNumInputProps = {
      min: 12,
      max: 100,
      value: parseInt(topicStyle.fontSize),
      style: {
        width: 50
      },
      onValueChange: this.handleFontSizeChange

      // leftIcon: 'size'
    };
    const lineHeightInputProps = {
      style: {
        width: 50
      },
      defaultValue: topicStyle.lineHeight,
      onChange: this.handleLineHeightChange
    };

    return (
      <StyleEditorRoot>
        <Title>
          <CloseIcon
            className={iconClassName(IconName.CLOSE)}
            onClick={this.setShowPanel(false)}
          />
        </Title>
        <PopRoot>
          <SettingGroup>
            <SettingTitle>Border</SettingTitle>
            <div>
              <SettingItem>
                <PxSelect
                  items={borderWidthItems}
                  itemRenderer={renderItem('px')}
                  filterable={false}
                  onItemSelect={this.handleBorderWidthChange}
                >
                  <Button
                    text={`width: ${
                      topicStyle.borderWidth ? topicStyle.borderWidth : '0px'
                    }`}
                  />
                </PxSelect>
              </SettingItem>
              <SettingItem>
                <PxSelect
                  items={borderStyleItems}
                  itemRenderer={renderItem('')}
                  filterable={false}
                  onItemSelect={this.handleBorderStyleChange}
                >
                  <Button
                    text={`style: ${
                      topicStyle.borderStyle ? topicStyle.borderStyle : 'none'
                    }`}
                  />
                </PxSelect>
              </SettingItem>
              <SettingItem>
                <PxSelect
                  items={borderRadiusItems}
                  itemRenderer={renderItem('px')}
                  filterable={false}
                  onItemSelect={this.handleBorderRadiusChange}
                >
                  <Button text={`radius: ${topicStyle.borderRadius}`} />
                </PxSelect>
              </SettingItem>
              <SettingItem>
                <Popover>
                  <WithBorder>
                    <div className={iconClassName(IconName.COLOR_PICKER)} />
                    <ColorBar color={topicStyle.borderColor} />
                  </WithBorder>
                  <div>
                    <SketchPicker
                      color={topicStyle.borderColor}
                      onChangeComplete={this.handleBorderColorChange}
                    />
                  </div>
                </Popover>
              </SettingItem>
            </div>
          </SettingGroup>
          <SettingGroup>
            <SettingTitle>Text Editor</SettingTitle>
            <Flex>
              <SettingItem>
                <Flex alignItems="center">
                  <Margin margin="0 5px 0 0">FontSize: </Margin>
                  <NumericInput {...fontSizeNumInputProps} />
                </Flex>
              </SettingItem>
              <SettingItem>
                <Flex alignItems="center">
                  <Margin margin="0 5px 0 0">LineHeight: </Margin>
                  <InputGroup {...lineHeightInputProps} />
                </Flex>
              </SettingItem>
              <SettingItem>
                <Popover>
                  <WithBorder>
                    <div className={iconClassName(IconName.COLOR_PICKER)} />
                    <ColorBar color={topicStyle.color} />
                  </WithBorder>
                  <div>
                    <SketchPicker
                      color={topicStyle.color}
                      onChangeComplete={this.handleColorChange}
                    />
                  </div>
                </Popover>
              </SettingItem>
            </Flex>
          </SettingGroup>
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
          <SettingGroup>
            <SettingTitle>Link</SettingTitle>
            <div>
              <SettingItem>
                <PxSelect
                  items={borderWidthItems}
                  itemRenderer={renderItem('px')}
                  filterable={false}
                  onItemSelect={this.handleLinkWidthChange}
                >
                  <Button
                    text={`width: ${linkStyle ? linkStyle.lineWidth : '0px'}`}
                  />
                </PxSelect>
              </SettingItem>
              <SettingItem>
                <Popover>
                  <WithBorder>
                    <div className={iconClassName(IconName.COLOR_PICKER)} />
                    <ColorBar color={topicStyle.background} />
                  </WithBorder>
                  <div>
                    <SketchPicker
                      color={topicStyle.background}
                      onChangeComplete={this.handleLinkColorChange}
                    />
                  </div>
                </Popover>
              </SettingItem>
            </div>
          </SettingGroup>
        </PopRoot>
      </StyleEditorRoot>
    );
  }
}
