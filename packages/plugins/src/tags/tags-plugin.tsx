import { getI18nText, I18nKey } from '@blink-mind/renderer-react';
import * as React from 'react';
import { TagEditor } from './components/tag-editor';

import { Tab } from '@blueprintjs/core';
import {
  addNewTag,
  addTopicTag,
  deleteTag,
  removeTopicTag,
  updateTag
} from './op-function';
import {
  EXT_DATA_KEY_TAGS,
  EXT_KEY_TAGS,
  OP_TYPE_ADD_TAG,
  OP_TYPE_ADD_TOPIC_TAG,
  OP_TYPE_DELETE_TAG,
  OP_TYPE_REMOVE_TOPIC_TAG,
  OP_TYPE_UPDATE_TAG
} from './utils';

import { IControllerRunContext } from '@blink-mind/core';
import { List } from 'immutable';
import { TagWidget, TagWidgetProps } from './components/tag-widget';
import { ExtDataTags, TagRecord } from './ext-data-tags';

export function TagsPlugin() {
  const tabId = 'tags-editor';
  return {
    renderRightTopPanelTabs(props, next) {
      const res = next();
      const tProps = {
        id: tabId,
        key: tabId,
        title: getI18nText(props, I18nKey.TAGS),
        panel: <TagEditor {...props} />
      };
      const tab = <Tab {...tProps} />;
      res.push(tab);
      return res;
    },
    getOpMap(props, next) {
      const opMap = next();
      opMap.set(OP_TYPE_ADD_TAG, addNewTag);
      opMap.set(OP_TYPE_DELETE_TAG, deleteTag);
      opMap.set(OP_TYPE_UPDATE_TAG, updateTag);
      opMap.set(OP_TYPE_ADD_TOPIC_TAG, addTopicTag);
      opMap.set(OP_TYPE_REMOVE_TOPIC_TAG, removeTopicTag);
      return opMap;
    },

    renderTopicContentOthers(props, next) {
      const { controller } = props;
      const res = next();
      res.push(
        controller.run('renderTopicExtTag', {
          ...props,
          key: EXT_KEY_TAGS
        })
      );
      return res;
    },

    renderTopicExtTag(props) {
      const { controller, diagramState, setDiagramState } = props;
      const tags: TagRecord[] = controller.run('getTopicTags', props);
      const tagsWidget = tags.map(tag => {
        const tagProps: TagWidgetProps = {
          ...props,
          key: tag.name,
          onClick: () => e => {
            setDiagramState({
              ...diagramState,
              rightTopPanel: {
                ...diagramState.rightTopPanel,
                isOpen: true,
                selectedTabId: tabId
              }
            });
            controller.run('setRightTopPanelProps', {
              ...props,
              value: {
                isOpen: true,
                selectedTabId: tabId
              }
            });
          },
          isTopicTag: true,
          large: false,
          tag
        };
        return <TagWidget {...tagProps} />;
      });
      return tagsWidget;
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

    getTopicTags(props: IControllerRunContext): TagRecord[] {
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
