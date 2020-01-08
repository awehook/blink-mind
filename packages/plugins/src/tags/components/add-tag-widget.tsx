import {
  BaseProps,
  SettingItemButton,
  SettingItemColorPicker,
  SettingItemColorPickerProps,
  SettingItemInput,
  SettingItemInputProps,
  SettingRow
} from '@blink-mind/renderer-react';
import { Alert } from '@blueprintjs/core';
import * as React from 'react';
import { useState } from 'react';
import { ExtDataTags, TagRecord } from '../ext-data-tags';
import { EXT_DATA_KEY_TAGS, OP_TYPE_ADD_TAG, TAG_NAME_MAX_LEN } from '../utils';

export function AddTagWidget(props: BaseProps) {
  const [tagName, setTagName] = useState('');
  const [background, setBackground] = useState('grey');
  const [color, setColor] = useState('black');
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');

  const { controller, model } = props;
  const handleTagNameChange = e => {
    setTagName(e.target.value);
  };
  const nameProps: SettingItemInputProps = {
    title: 'TagName:',
    value: tagName,
    onChange: handleTagNameChange,
    style: {
      width: 100
    }
  };
  const nameItem = <SettingItemInput {...nameProps} />;
  const bgColorProps: SettingItemColorPickerProps = {
    title: 'Background:',
    color: background,
    handleColorChange: color => {
      setBackground(color);
    }
  };
  const bgColorItem = <SettingItemColorPicker {...bgColorProps} />;

  const colorProps: SettingItemColorPickerProps = {
    title: 'Color:',
    color: color,
    handleColorChange: color => {
      setColor(color);
    }
  };

  const colorItem = <SettingItemColorPicker {...colorProps} />;

  const extData = model.getExtDataItem(EXT_DATA_KEY_TAGS, ExtDataTags);
  const disabled = extData.tags.has(tagName) || tagName.trim() === '';
  const getTagStyle = () => {
    const style = {
      backgroundColor: background,
      color
    };
    return JSON.stringify(style);
  };
  const addTagBtnProps = {
    title: 'Add Tag',
    disabled,
    onClick: () => {
      if (tagName.trim().length > TAG_NAME_MAX_LEN) {
        setShowAlert(true);
        setAlertTitle('The length of tag name over the maximum length : 50 !');
        return;
      }
      const tag = new TagRecord({
        name: tagName,
        style: getTagStyle()
      });
      controller.run('operation', {
        ...props,
        opType: OP_TYPE_ADD_TAG,
        tag
      });
    }
  };

  const alertProps = {
    isOpen: showAlert,

    onClose: e => {
      setShowAlert(false);
    }
  };
  const alert = showAlert && (
    <Alert {...alertProps}>
      <p>{alertTitle}</p>
    </Alert>
  );
  const addTagBtn = <SettingItemButton {...addTagBtnProps} />;
  return (
    <SettingRow>
      {nameItem}
      {bgColorItem}
      {colorItem}
      {addTagBtn}
      {alert}
    </SettingRow>
  );
}
