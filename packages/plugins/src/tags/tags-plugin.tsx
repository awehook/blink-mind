import * as React from 'react';
import { TagEditor } from './components/tag-editor';

import { Tab } from '@blueprintjs/core';
import { addNewTag, addTopicTag, removeTopicTag } from './op-function';
import {
  EXT_DATA_KEY_TAGS,
  OP_TYPE_ADD_TAG,
  OP_TYPE_ADD_TOPIC_TAG,
  OP_TYPE_REMOVE_TOPIC_TAG
} from './utils';

import { IControllerRunContext } from '@blink-mind/core';
import { List, Map } from 'immutable';
import { ExtDataTags, TagRecord } from './ext-data-tags';

export function TagsPlugin() {
  return {
    renderRightTopPanelTabs(props, next) {
      const res = next();
      const tProps = {
        id: 'tags-editor',
        key: 'tags-editor',
        title: 'Tags',
        panel: <TagEditor {...props} />
      };
      const tab = <Tab {...tProps} />;
      res.push(tab);
      return res;
    },
    getOpMap(props, next) {
      const opMap = next();
      opMap.set(OP_TYPE_ADD_TAG, addNewTag);
      opMap.set(OP_TYPE_ADD_TOPIC_TAG, addTopicTag);
      opMap.set(OP_TYPE_REMOVE_TOPIC_TAG, removeTopicTag);
      return opMap;
    },

    //TODO
    deserializeExtDataItem(props, next) {
      const { extDataKey, extDataItem } = props;
      if (extDataKey === EXT_DATA_KEY_TAGS) {
        let extDataTags = new ExtDataTags();
        for (const key in extDataItem.tags) {
          const item = extDataItem.tags[key];
          const { name, style, topicKeys } = item;
          const record = new TagRecord({
            name,
            style,
            topicKeys: List(topicKeys)
          });
          extDataTags = extDataTags.update('tags', tags =>
            tags.set(key, record)
          );
        }
        return extDataTags;
      }
      return next();
    },

    getTopicTags(props: IControllerRunContext) {
      const { model, topicKey } = props;
      const extData = model.getExtDataItem(EXT_DATA_KEY_TAGS, ExtDataTags);
      const res = [];
      extData.tags.forEach(v => {
        if (v.topicKeys.includes(topicKey)) {
          res.push(v);
        }
      });
      return res;
    },
    getTopicTagsCanBeAdded(props: IControllerRunContext) {
      const { model, topicKey } = props;
      const extData = model.getExtDataItem(EXT_DATA_KEY_TAGS, ExtDataTags);
      const res = [];
      extData.tags.forEach(v => {
        if (!v.topicKeys.includes(topicKey)) {
          res.push(v);
        }
      });
      return res;
    }
  };
}
