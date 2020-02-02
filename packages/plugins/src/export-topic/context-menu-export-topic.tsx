import {
  BaseProps,
  getI18nText,
  I18nKey,
  Icon,
  IconName,
  RefKey,
  topicWidgetRootRefKey
} from '@blink-mind/renderer-react';
import { MenuItem } from '@blueprintjs/core';
import { saveAs } from 'file-saver';
import { toBlob, toSvgDataURL } from 'html-to-image';
import * as React from 'react';
import { EXT_KEY_EXPORT_TOPIC } from './utils';
export function ContextMenuExportTopic(props: BaseProps) {
  const { controller, model, topicKey, getRef } = props;

  const exportTo = (type: 'PNG' | 'JPG' | 'SVG') => () => {
    const options = {
      backgroundColor: model.config.theme.background
    };
    const title = controller.run('getTopicTitle', { ...props, maxLength: 40 });
    const topicWidgetEle =
      topicKey === model.editorRootTopicKey
        ? getRef(RefKey.NODE_LAYER + model.id)
        : getRef(topicWidgetRootRefKey(topicKey));
    switch (type) {
      case 'PNG':
      case 'JPG':
        toBlob(topicWidgetEle, options).then(blob => {
          saveAs(blob, `${title}.${type}`);
        });
        break;
      case 'SVG':
        toSvgDataURL(topicWidgetEle, options).then(dataUrl => {
          saveAs(dataUrl, `${title}.svg`);
        });
        break;
    }
  };

  return (
    <MenuItem
      key={EXT_KEY_EXPORT_TOPIC}
      icon={Icon(IconName.EXPORT)}
      text={getI18nText(props, I18nKey.EXPORT)}
    >
      <MenuItem text="PNG" onClick={exportTo('PNG')} />
      <MenuItem text="JPG" onClick={exportTo('JPG')} />
      <MenuItem text="SVG" onClick={exportTo('SVG')} />
    </MenuItem>
  );
}
