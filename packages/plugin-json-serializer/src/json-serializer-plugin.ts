import { Block, BlockType, Config, Model, Topic } from '@blink-mind/core';
import debug from 'debug';
import { List, Map } from 'immutable';

const log = debug('plugin:json-serializer');

export function JsonSerializerPlugin() {
  return {
    serializeModel(props, next) {
      const nextRes = next();
      if (nextRes) return nextRes;
      const { model, controller } = props;
      const obj = {
        rootTopicKey: model.rootTopicKey,
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
      if (nextRes) return nextRes;
      const { obj, controller } = props;
      if (obj.formatVersion == null) {
        obj.formatVersion = '0.0';
      }
      const { rootTopicKey, topics, config, formatVersion } = obj;
      let model = new Model();
      model = model.merge({
        rootTopicKey,
        editorRootTopicKey: rootTopicKey,
        config: controller.run('deserializeConfig', {
          ...props,
          obj: config,
          formatVersion
        }),
        topics: controller.run('deserializeTopics', {
          ...props,
          obj: topics,
          formatVersion
        }),
        formatVersion: obj.formatVersion
      });
      log('deserializeModel', model);
      return model;
    },

    serializeConfig(props, next) {
      const nextRes = next();
      if (nextRes) return nextRes;
      const { config } = props;
      return config.toJS();
    },

    deserializeConfig(props, next) {
      const nextRes = next();
      if (nextRes) return nextRes;
      const { obj } = props;
      return new Config(obj);
    },

    serializeTopic(props, next) {
      const nextRes = next();
      if (nextRes) return nextRes;
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
      if (nextRes) return nextRes;
      const { obj, controller } = props;
      const { key, parentKey, subKeys, blocks, style, collapse } = obj;
      let topic = new Topic();
      topic = topic.merge({
        key,
        parentKey,
        subKeys: List(subKeys),
        style,
        collapse,
        blocks: controller.run('deserializeBlocks', { ...props, obj: blocks })
      });
      return topic;
    },

    deserializeTopics(props, next) {
      const nextRes = next();
      if (nextRes) return nextRes;
      const { obj, controller } = props;
      let topics = Map();
      topics = topics.withMutations(topics => {
        obj.forEach(topic =>
          topics.set(
            topic.key,
            controller.run('deserializeTopic', { ...props, obj: topic })
          )
        );
      });
      return topics;
    },

    serializeBlock(props, next) {
      const nextRes = next();
      if (nextRes) return nextRes;
      const { block, controller } = props;
      const res = {
        type: block.type,
        data: controller.run('serializeBlockData', { ...props })
      };
      return res;
    },

    serializeBlockData(props, next) {
      const nextRes = next();
      if (nextRes) return nextRes;
      const { block } = props;
      return block.data;
    },

    deserializeBlock(props, next) {
      const nextRes = next();
      if (nextRes) return nextRes;
      const { obj, controller } = props;
      const { type, data } = obj;

      return new Block({
        type,
        data: controller.run('deserializeBlockData', { ...props, obj })
      });
    },

    deserializeBlockData(props, next) {
      const nextRes = next();
      if (nextRes) return nextRes;
      const { obj } = props;
      return obj.data;
    },

    deserializeBlocks(props, next) {
      const nextRes = next();
      if (nextRes) return nextRes;
      const { obj, controller } = props;
      let blocks = List();
      blocks = blocks.withMutations(blocks => {
        obj.forEach(block =>
          blocks.push(
            controller.run('deserializeBlock', { ...props, obj: block })
          )
        );
      });
      return blocks;
    }
  };
}
