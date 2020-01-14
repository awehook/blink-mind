import {
  Block,
  Config,
  ExtData,
  FocusMode,
  IControllerRunContext,
  Model,
  Topic
} from '@blink-mind/core';
import debug from 'debug';
import { isImmutable, List, Map } from 'immutable';

const log = debug('plugin:json-serializer');

export function JsonSerializerPlugin() {
  return {
    serializeModel(props: IControllerRunContext, next) {
      const nextRes = next();
      if (nextRes != null) return nextRes;
      const { model, controller } = props;
      const obj = {
        rootTopicKey: model.rootTopicKey,
        editorRootTopicKey: model.editorRootTopicKey,
        focusKey: model.focusKey,
        extData: controller.run('serializeExtData', {
          ...props,
          extData: model.extData
        }),
        topics: model.topics
          .valueSeq()
          .toArray()
          .map(topic => controller.run('serializeTopic', { ...props, topic })),
        config: controller.run('serializeConfig', {
          ...props,
          config: model.config
        }),
        formatVersion: model.formatVersion
      };
      return obj;
    },

    deserializeModel(props, next) {
      const nextRes = next();
      if (nextRes != null) return nextRes;
      const { obj, controller } = props;
      if (obj.formatVersion == null) {
        obj.formatVersion = '0.0';
      }
      const {
        rootTopicKey,
        editorRootTopicKey,
        focusKey,
        topics,
        config,
        extData,
        formatVersion
      } = obj;
      let res = new Model();
      res = res.merge({
        rootTopicKey,
        editorRootTopicKey:
          editorRootTopicKey == null ? rootTopicKey : editorRootTopicKey,
        focusKey,
        extData: controller.run('deserializeExtData', {
          ...props,
          extData,
          formatVersion
        }),
        config: controller.run('deserializeConfig', {
          ...props,
          config,
          formatVersion
        }),
        topics: controller.run('deserializeTopics', {
          ...props,
          topics,
          formatVersion
        }),
        formatVersion: obj.formatVersion
      });
      if (res.focusKey == null) {
        res = res.set('focusKey', res.rootTopicKey);
      }
      if (res.focusMode == null) {
        res = res.set('focusMode', FocusMode.NORMAL);
      }
      log('deserializeModel', res);
      return res;
    },

    serializeExtData(
      props: IControllerRunContext & { extData: ExtData },
      next
    ) {
      const nextRes = next();
      if (nextRes != null) return nextRes;
      const { extData, controller } = props;
      const res = {};
      extData.forEach((v, k) => {
        res[k] = controller.run('serializeExtDataItem', {
          props,
          extDataKey: k,
          extDataItem: v
        });
      });
      return res;
    },

    deserializeExtData(props, next) {
      const nextRes = next();
      if (nextRes != null) return nextRes;
      const { extData, controller } = props;
      let res = Map();
      for (const extDataKey in extData) {
        res = res.set(
          extDataKey,
          controller.run('deserializeExtDataItem', {
            ...props,
            extDataKey,
            extDataItem: extData[extDataKey]
          })
        );
      }
      return res;
    },

    serializeExtDataItem(props, next) {
      const nextRes = next();
      if (nextRes != null) return nextRes;
      const { extDataItem } = props;
      if (isImmutable(extDataItem)) {
        return extDataItem.toJS();
      }
      return extDataItem;
    },

    deserializeExtDataItem(props, next) {
      const nextRes = next();
      if (nextRes != null) return nextRes;
      const { extDataItem } = props;
      return extDataItem;
    },

    serializeConfig(props, next) {
      const nextRes = next();
      if (nextRes != null) return nextRes;
      const { config } = props;
      return config.toJS();
    },

    deserializeConfig(props, next) {
      const nextRes = next();
      if (nextRes != null) return nextRes;
      const { config } = props;
      return new Config(config);
    },

    serializeTopic(props, next) {
      const nextRes = next();
      if (nextRes != null) return nextRes;
      const { topic, controller } = props;
      return {
        key: topic.key,
        parentKey: topic.parentKey,
        subKeys: topic.subKeys.toArray(),
        collapse: topic.collapse,
        style: topic.style,
        blocks: topic.blocks.map(block =>
          controller.run('serializeBlock', { ...props, block })
        )
      };
    },

    deserializeTopic(props, next) {
      const nextRes = next();
      if (nextRes != null) return nextRes;
      const { topic, controller } = props;
      const { key, parentKey, subKeys, blocks, style, collapse } = topic;
      let res = new Topic();
      res = res.merge({
        key,
        parentKey,
        subKeys: List(subKeys),
        style,
        collapse,
        blocks: controller.run('deserializeBlocks', { ...props, blocks })
      });
      return res;
    },

    deserializeTopics(props, next) {
      const nextRes = next();
      if (nextRes != null) return nextRes;
      const { topics, controller } = props;
      let res = Map();
      res = res.withMutations(r => {
        topics.forEach(topic =>
          r.set(
            topic.key,
            controller.run('deserializeTopic', { ...props, topic })
          )
        );
      });
      return res;
    },

    serializeBlock(props, next) {
      const nextRes = next();
      if (nextRes != null) return nextRes;
      const { block, controller } = props;
      const res = {
        type: block.type,
        data: controller.run('serializeBlockData', { ...props })
      };
      return res;
    },

    serializeBlockData(props, next) {
      const nextRes = next();
      if (nextRes != null) return nextRes;
      const { block } = props;
      return block.data;
    },

    deserializeBlock(props, next) {
      const nextRes = next();
      if (nextRes != null) return nextRes;
      const { block, controller } = props;
      const { type } = block;

      return new Block({
        type,
        data: controller.run('deserializeBlockData', { ...props, block })
      });
    },

    deserializeBlockData(props, next) {
      const nextRes = next();
      if (nextRes != null) return nextRes;
      const { block } = props;
      return block.data;
    },

    deserializeBlocks(props, next) {
      const nextRes = next();
      if (nextRes != null) return nextRes;
      const { blocks, controller } = props;
      let res = List();
      res = res.withMutations(res => {
        blocks.forEach(block =>
          res.push(controller.run('deserializeBlock', { ...props, block }))
        );
      });
      return res;
    }
  };
}
