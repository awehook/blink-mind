import {
  Alert,
  BaseProps,
  getI18nText,
  I18nKey,
  SettingBoxContainer
} from '@blink-mind/renderer-react';
import * as React from 'react';
import { useState } from 'react';
import { ExtDataTags, TagRecord } from '../ext-data-tags';
import { EXT_DATA_KEY_TAGS, OP_TYPE_DELETE_TAG } from '../utils';
import { StyledTagWidget as TagWidget, TagWidgetProps } from './tag-widget';

let currentTag: TagRecord;
export function AllTagsWidget(props: BaseProps) {
  const [showAlert, setShowAlert] = useState(false);
  const { controller, docModel } = props;
  const extData = docModel.getExtDataItem(EXT_DATA_KEY_TAGS, ExtDataTags);
  if (extData.tags.size === 0) return null;
  const tags = extData.tags.toArray().map(([name, tag]) => {
    const tagProps: TagWidgetProps = {
      ...props,
      key: name,
      clickToUpdate: true,
      tag,
      onClick: tag => e => {
        currentTag = tag;
      },
      onRemove: tag => e => {
        currentTag = tag;
        setShowAlert(true);
      }
    };
    return <TagWidget {...tagProps} />;
  });
  const alertProps = {
    ...props,
    isOpen: showAlert,
    content: getI18nText(props, I18nKey.DELETE_TAG_TIP),
    onConfirm: e => {
      controller.run('operation', {
        ...props,
        opType: OP_TYPE_DELETE_TAG,
        tagName: currentTag.name
      });
      currentTag = null;
      setShowAlert(false);
    },

    onCancel: e => {
      setShowAlert(false);
    }
  };
  return (
    <>
      <SettingBoxContainer>{tags}</SettingBoxContainer>
      <Alert {...alertProps} />
    </>
  );
}
