import {
  BaseProps,
  getI18nText,
  I18nKey,
  SettingItemButton,
  SettingItemColorPicker,
  SettingItemColorPickerProps,
  SettingItemInput,
  SettingItemInputProps,
  SettingRow
} from '@blink-mind/renderer-react';
import * as React from 'react';
import { useState } from 'react';
import { ExtDataTags, TagRecord } from '../ext-data-tags';
import {
  EXT_DATA_KEY_TAGS,
  OP_TYPE_UPDATE_TAG,
  TAG_NAME_MAX_LEN
} from '../utils';

export interface UpdateTagWidgetProps extends BaseProps {
  tag: TagRecord;
}

export function UpdateTagWidget(props: UpdateTagWidgetProps) {
  const { controller, model, tag } = props;
  const style = JSON.parse(tag.style);
  const [tagName, setTagName] = useState(tag.name);
  const [background, setBackground] = useState(style.backgroundColor);
  const [color, setColor] = useState(style.color);

  const handleTagNameChange = e => {
    setTagName(e.target.value);
  };
  const nameProps: SettingItemInputProps = {
    title: getI18nText(props, I18nKey.TAG_NAME) + ':',
    value: tagName,
    onChange: handleTagNameChange,
    style: {
      width: 100
    }
  };
  const nameItem = <SettingItemInput {...nameProps} />;
  const bgColorProps: SettingItemColorPickerProps = {
    title: getI18nText(props, I18nKey.BACKGROUND) + ':',
    color: background,
    handleColorChange: color => {
      setBackground(color);
    }
  };
  const bgColorItem = <SettingItemColorPicker {...bgColorProps} />;

  const colorProps: SettingItemColorPickerProps = {
    title: getI18nText(props, I18nKey.COLOR) + ':',
    color: color,
    handleColorChange: color => {
      setColor(color);
    }
  };

  const colorItem = <SettingItemColorPicker {...colorProps} />;

  const extData = model.getExtDataItem(EXT_DATA_KEY_TAGS, ExtDataTags);
  const trimTagName = tagName.trim();
  const disabled =
    (extData.tags.has(trimTagName) && trimTagName !== tag.name) ||
    trimTagName === '' ||
    trimTagName.length > TAG_NAME_MAX_LEN;
  const getTagStyle = () => {
    const style = {
      backgroundColor: background,
      color
    };
    return JSON.stringify(style);
  };
  const btnProps = {
    title: getI18nText(props, I18nKey.UPDATE_TAG),
    disabled,
    onClick: () => {
      const newTag = new TagRecord({
        name: trimTagName,
        style: getTagStyle(),
        topicKeys: tag.topicKeys
      });
      controller.run('operation', {
        ...props,
        opType: OP_TYPE_UPDATE_TAG,
        oldTagName: tag.name,
        newTag: newTag
      });
    }
  };

  const btn = <SettingItemButton {...btnProps} />;
  return (
    <SettingRow>
      {nameItem}
      {bgColorItem}
      {colorItem}
      {btn}
    </SettingRow>
  );
}
