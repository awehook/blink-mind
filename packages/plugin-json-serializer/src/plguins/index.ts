import { Block, Config, Model, Topic } from '@blink-mind/core';
import debug from 'debug';
import { List, Map } from 'immutable';

const log = debug('plugin:json-serializer');

const DATA_VERSION = '0.0';

export function JsonSerializerPlugin() {
  return {
    serializeModel(props) {
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
        version: model.version
      };
      return obj;
    },

    deserializeModel(props) {
      const { obj, controller } = props;
      if (obj.version == null) {
        obj.version = '0.0';
      }
      const { rootTopicKey, topics, config, version } = obj;
      let model = new Model();
      model = model.merge({
        rootTopicKey,
        editorRootTopicKey: rootTopicKey,
        config: controller.run('deserializeConfig', {
          ...props,
          obj: config,
          version
        }),
        topics: controller.run('deserializeTopics', {
          ...props,
          obj: topics,
          version
        }),
        version: DATA_VERSION
      });
      log('deserializeModel', model);
      return model;
    },

    serializeConfig(props) {
      const { config } = props;
      return config.toJS();
    },

    deserializeConfig(props) {
      const { obj } = props;
      return new Config(obj);
    },

    serializeTopic(props) {
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

    deserializeTopic(props) {
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

    deserializeTopics(props) {
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

    serializeBlock(props) {
      const { block } = props;
      return block.toJS();
    },

    deserializeBlock(props) {
      const { obj } = props;
      return new Block(obj);
    },

    deserializeBlocks(props) {
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
