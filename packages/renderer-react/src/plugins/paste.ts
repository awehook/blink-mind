import { isAllSibiling, SheetModel } from '../../../core/src/models';
import { BlockType } from '../../../core/src/types';

const log = require('debug')('plugin:paste');

export function PastePlugin() {
  let pasteType;
  return {
    setPasteType(ctx) {
      pasteType = ctx.pasteType;
    },
    getPasteType(ctx) {
      return pasteType;
    },

    selectedKeysToClipboardData(ctx) {
      const { controller } = ctx;
      const model: SheetModel = controller.model;
      if (model.selectedKeys) {
        // 首先要normalize selectedKeys
        if (isAllSibiling(model, model.selectedKeys)) {
          const topics = model.selectedKeys.map(topicKey => {
            return controller.run('topicToClipboard', {
              ...ctx,
              model,
              topicKey
            });
          });
          const json = JSON.stringify(topics, null, 2);
          log('selectedKeysToClipboardData', json);
          return json;
        }
      }
      return null;
    },

    topicToClipboard(ctx) {
      const { controller, model, topicKey } = ctx;
      const topic = model.getTopic(topicKey);
      const blocks = controller.run('serializeBlocks', { ...ctx, topic });
      const { collapse } = topic;
      return {
        collapse,
        blocks,
        subTopics: topic.subKeys
          .toArray()
          .map(subKey =>
            controller.run('topicToClipboard', { ...ctx, topicKey: subKey })
          )
      };
    },

    handleCopy(ctx) {
      const { controller, ev } = ctx;
      const model: SheetModel = controller.model;
      if (model.selectedKeys) {
        ev.preventDefault();
        // navigator.clipboard.writeText('test clipboard');
        ev.nativeEvent.clipboardData.setData(
          'text/bmind',
          controller.run('selectedKeysToClipboardData', ctx)
        );
      }
    }
  };
}
