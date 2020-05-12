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
import { BaseProps } from '@blink-mind/renderer-react';
import { List } from 'immutable';
import { TagWidget, TagWidgetProps } from './components/tag-widget';
import { ExtDataTags, TagRecord } from './ext-data-tags';

export function TagsPlugin() {
  const tabId = 'tags-editor';
  return {
    componentAreEqual(
      ctx: { prevProps: BaseProps; nextProps: BaseProps },
      next
    ) {
      const { docModel } = ctx.prevProps;
      const { docModel: nDocModel, topicKey } = ctx.nextProps;
      const extData: ExtDataTags = docModel.extData.get(EXT_DATA_KEY_TAGS);
      const nExtData: ExtDataTags = nDocModel.extData.get(EXT_DATA_KEY_TAGS);
      if (extData !== nExtData) {
        // console.log('extData !== nExtData');
        if (extData && extData.getTopicTags(topicKey).length) {
          return false;
        }
        if (nExtData && nExtData.getTopicTags(topicKey).length) {
          return false;
        }
      }
      return next();
    },
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

    topicExtDataToJson(ctx, next) {
      const { docModel, topicKey } = ctx;
      const res = next();
      const extData = docModel.getExtDataItem(EXT_DATA_KEY_TAGS, ExtDataTags);
      const tags = [];
      extData.tags.forEach((v, k) => {
        if (v.topicKeys.includes(topicKey)) {
          tags.push({
            name: v.name,
            style: v.style
          });
        }
      });
      res[EXT_DATA_KEY_TAGS] = tags;
      return res;
    },

    processTopicExtData(ctx, next) {
      let extData = next();
      let { topic } = ctx;
      if (topic.extData[EXT_DATA_KEY_TAGS]) {
        if (!extData.has(EXT_DATA_KEY_TAGS)) {
          let extDataTags = new ExtDataTags();
          extData = extData.set(EXT_DATA_KEY_TAGS, extDataTags);
        }
        let list = List();
        for (let tag of topic.extData[EXT_DATA_KEY_TAGS]) {
          extData = extData.updateIn([EXT_DATA_KEY_TAGS, 'tags'], tags => {
            return tags.has(tag.name)
              ? tags.updateIn([tag.name, 'topicKeys'], topicKeys =>
                  topicKeys.push(topic.key)
                )
              : tags.set(
                  tag.name,
                  new TagRecord({
                    name: tag.name,
                    style: tag.style,
                    topicKeys: List([topic.key])
                  })
                );
          });
        }
      }
      return extData;
    },

    renderTopicNodeLastRowOthers(props, next) {
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
          clickToUpdate: true,
          onClick: () => e => {
            setDiagramState({
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
      const { docModel, topicKey } = props;
      const extData = docModel.getExtDataItem(EXT_DATA_KEY_TAGS, ExtDataTags);
      const res = [];
      extData.tags.forEach(v => {
        if (v.topicKeys.includes(topicKey)) {
          res.push(v);
        }
      });
      return res;
    },
    getTopicTagsCanBeAdded(props: IControllerRunContext) {
      const { docModel, topicKey } = props;
      const extData = docModel.getExtDataItem(EXT_DATA_KEY_TAGS, ExtDataTags);
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
