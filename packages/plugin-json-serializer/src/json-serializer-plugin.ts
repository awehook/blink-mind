import {
  Block,
  SheetModel,
  Config,
  createKey,
  DocModel,
  ExtData,
  FocusMode,
  IControllerRunContext,
  Topic
} from '@blink-mind/core';
import debug from 'debug';
import { isImmutable, List, Map } from 'immutable';

const log = debug('plugin:json-serializer');

export function JsonSerializerPlugin() {
  return {
    migrateDocModel(ctx, next) {
      const { controller, obj, formatVersion } = ctx;
      switch (formatVersion) {
        case '0.0':
          return controller.run('migrateDocModel', {
            ...ctx,
            obj: {
              sheetModels: [obj],
              currentSheetIndex: 0,
              formatVersion: '0.1'
            },
            formatVersion: '0.1'
          });
        case '0.1':
          return obj;
      }
    },

    serializeDocModel(ctx: IControllerRunContext, next) {
      const { docModel, controller } = ctx;
      return {
        sheetModels: docModel.sheetModels
          .toArray()
          .map(model =>
            controller.run('serializeSheetModel', { ...ctx, model })
          ),
        currentSheetIndex: docModel.currentSheetIndex,
        formatVersion: docModel.formatVersion
      };
    },

    deserializeDocModel(ctx, next) {
      const nextRes = next();
      if (nextRes != null) return nextRes;
      let { obj } = ctx;
      const { controller } = ctx;
      let formatVersion = obj.formatVersion || '0.0';

      obj = controller.run('migrateDocModel', { ...ctx, obj, formatVersion });

      formatVersion = obj.formatVersion;

      const sheetModels = obj.sheetModels.map(sheetModel =>
        controller.run('deserializeSheetModel', {
          ...ctx,
          sheetModel,
          formatVersion
        })
      );

      return new DocModel({
        sheetModels: List(sheetModels),
        currentSheetIndex: obj.currentSheetIndex,
        formatVersion
      });
    },

    serializeSheetModel(ctx: IControllerRunContext, next) {
      const nextRes = next();
      if (nextRes != null) return nextRes;
      const { model, controller } = ctx;
      const obj = {
        title: model.title,
        rootTopicKey: model.rootTopicKey,
        editorRootTopicKey: model.editorRootTopicKey,
        focusKey: model.focusKey,
        extData: controller.run('serializeExtData', {
          ...ctx,
          extData: model.extData
        }),
        topics: model.topics
          .valueSeq()
          .toArray()
          .map(topic => controller.run('serializeTopic', { ...ctx, topic })),
        config: controller.run('serializeConfig', {
          ...ctx,
          config: model.config
        })
      };
      return obj;
    },

    deserializeSheetModel(ctx, next) {
      const nextRes = next();
      if (nextRes != null) return nextRes;
      const { sheetModel, controller, formatVersion } = ctx;
      const {
        id,
        title,
        rootTopicKey,
        editorRootTopicKey,
        focusKey,
        topics,
        config,
        extData
      } = sheetModel;
      let res = new SheetModel();
      res = res.merge({
        id: id || createKey(),
        title,
        rootTopicKey,
        editorRootTopicKey:
          editorRootTopicKey == null ? rootTopicKey : editorRootTopicKey,
        focusKey,
        extData: controller.run('deserializeExtData', {
          ...ctx,
          extData,
          formatVersion
        }),
        config: controller.run('deserializeConfig', {
          ...ctx,
          config,
          formatVersion
        }),
        topics: controller.run('deserializeTopics', {
          ...ctx,
          topics,
          formatVersion
        }),
        formatVersion: sheetModel.formatVersion
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

    serializeExtData(ctx: IControllerRunContext & { extData: ExtData }, next) {
      const nextRes = next();
      if (nextRes != null) return nextRes;
      const { extData, controller } = ctx;
      const res = {};
      extData.forEach((v, k) => {
        res[k] = controller.run('serializeExtDataItem', {
          ctx,
          extDataKey: k,
          extDataItem: v
        });
      });
      return res;
    },

    deserializeExtData(ctx, next) {
      const nextRes = next();
      if (nextRes != null) return nextRes;
      const { extData, controller } = ctx;
      let res = Map();
      for (const extDataKey in extData) {
        res = res.set(
          extDataKey,
          controller.run('deserializeExtDataItem', {
            ...ctx,
            extDataKey,
            extDataItem: extData[extDataKey]
          })
        );
      }
      return res;
    },

    serializeExtDataItem(ctx, next) {
      const nextRes = next();
      if (nextRes != null) return nextRes;
      const { extDataItem } = ctx;
      if (isImmutable(extDataItem)) {
        return extDataItem.toJS();
      }
      return extDataItem;
    },

    deserializeExtDataItem(ctx, next) {
      const nextRes = next();
      if (nextRes != null) return nextRes;
      const { extDataItem } = ctx;
      return extDataItem;
    },

    serializeConfig(ctx, next) {
      const nextRes = next();
      if (nextRes != null) return nextRes;
      const { config } = ctx;
      return config.toJS();
    },

    deserializeConfig(ctx, next) {
      const nextRes = next();
      if (nextRes != null) return nextRes;
      const { config } = ctx;
      return new Config(config);
    },

    serializeTopic(ctx, next) {
      const nextRes = next();
      if (nextRes != null) return nextRes;
      const { topic, controller } = ctx;
      return {
        key: topic.key,
        parentKey: topic.parentKey,
        subKeys: topic.subKeys.toArray(),
        collapse: topic.collapse,
        style: topic.style,
        blocks: topic.blocks.map(block =>
          controller.run('serializeBlock', { ...ctx, block })
        )
      };
    },

    deserializeTopic(ctx, next) {
      const nextRes = next();
      if (nextRes != null) return nextRes;
      const { topic, controller } = ctx;
      const { key, parentKey, subKeys, blocks, style, collapse } = topic;
      let res = new Topic();
      res = res.merge({
        key,
        parentKey,
        subKeys: List(subKeys),
        style,
        collapse,
        blocks: controller.run('deserializeBlocks', { ...ctx, blocks })
      });
      return res;
    },

    deserializeTopics(ctx, next) {
      const nextRes = next();
      if (nextRes != null) return nextRes;
      const { topics, controller } = ctx;
      let res = Map();
      res = res.withMutations(r => {
        topics.forEach(topic =>
          r.set(
            topic.key,
            controller.run('deserializeTopic', { ...ctx, topic })
          )
        );
      });
      return res;
    },

    serializeBlock(ctx, next) {
      const nextRes = next();
      if (nextRes != null) return nextRes;
      const { block, controller } = ctx;
      const res = {
        type: block.type,
        data: controller.run('serializeBlockData', { ...ctx })
      };
      return res;
    },

    serializeBlockData(ctx, next) {
      const nextRes = next();
      if (nextRes != null) return nextRes;
      const { block } = ctx;
      return block.data;
    },

    deserializeBlock(ctx, next) {
      const nextRes = next();
      if (nextRes != null) return nextRes;
      const { block, controller } = ctx;
      const { type } = block;

      return new Block({
        type,
        data: controller.run('deserializeBlockData', { ...ctx, block })
      });
    },

    deserializeBlockData(ctx, next) {
      const nextRes = next();
      if (nextRes != null) return nextRes;
      const { block } = ctx;
      return block.data;
    },

    deserializeBlocks(ctx, next) {
      const nextRes = next();
      if (nextRes != null) return nextRes;
      const { blocks, controller } = ctx;
      let res = List();
      res = res.withMutations(res => {
        blocks.forEach(block =>
          res.push(controller.run('deserializeBlock', { ...ctx, block }))
        );
      });
      return res;
    }
  };
}
