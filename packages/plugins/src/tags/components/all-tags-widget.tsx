import { BaseProps, SettingBoxContainer } from '@blink-mind/renderer-react';
import { Alert } from '@blueprintjs/core';
import * as React from 'react';
import { useState } from 'react';
import { ExtDataTags } from '../ext-data-tags';
import { EXT_DATA_KEY_TAGS } from '../utils';
import { TagWidget } from './tag-widget';

export function AllTagsWidget(props: BaseProps) {
  const [showAlert, setShowAlert] = useState(false);
  const { controller, model } = props;
  const extData = model.getExtDataItem(EXT_DATA_KEY_TAGS, ExtDataTags);
  if (extData.tags.size === 0) return null;
  const tags = extData.tags.toArray().map(([name, tag]) => {
    const tagProps = {
      tag,
      onClick: tag => e => {},
      onRemove: tag => e => {}
    };
    return <TagWidget key={name} {...tagProps} />;
  });
  const alertProps = {
    isOpen: showAlert,

    onConfirm: e => {
      setShowAlert(false);
    },

    onClose: e => {
      setShowAlert(false);
    }
  };
  return (
    <>
      <SettingBoxContainer>{tags}</SettingBoxContainer>
      <Alert {...alertProps}></Alert>
    </>
  );
}
