import { isAllSibiling, SheetModel } from '@blink-mind/core';
import { createKey, Topic, OpType } from '@blink-mind/core';
import { MenuItem } from '@blueprintjs/core';
import * as React from 'react';
import { KeyboardHotKeyWidget } from '../../components';
import { getI18nText, I18nKey, Icon, IconName } from '../../utils';

const log = require('debug')('plugin:paste');

export function PastePlugin() {
  let pasteType;

  const processTopicJson = (topicJson, parentKey) => {
    const res = [];
    topicJson.parentKey = parentKey;
    topicJson.key = createKey();
    topicJson.subTopics.forEach(t => {
      res.push(...processTopicJson(t, topicJson.key));
    });
    topicJson.subKeys = topicJson.subTopics.map(s => s.key);
    res.push(topicJson);
    return res;
  };

  return {
    setPasteType(ctx) {
      pasteType = ctx.pasteType;
    },
    getPasteType(ctx) {
      return pasteType;
    },

    // customizeTopicContextMenu(ctx, next) {
    //   function onClickPastePlainText(e) {
    //     pasteType = 'PASTE_PLAIN_TEXT';
    //     document.execCommand('paste');
    //   }
    //   function onClickPasteWithStyle(e) {
    //     pasteType = 'PASTE_WITH_STYLE';
    //     document.execCommand('paste');
    //   }
    //
    //   const res = next();
    //   res.push(
    //     <MenuItem
    //       key="paste-plain-text"
    //       icon={Icon(IconName.PASTE_AS_TEXT)}
    //       text={getI18nText(ctx, I18nKey.PASTE_AS_PLAIN_TEXT)}
    //       labelElement={<KeyboardHotKeyWidget hotkeys={['Meta', 'V']} />}
    //       onClick={onClickPastePlainText}
    //     />,
    //     <MenuItem
    //       key="paste-with-style"
    //       icon={Icon(IconName.PASTE)}
    //       text={getI18nText(ctx, I18nKey.PASTE_WITH_STYLE)}
    //       labelElement={
    //         <KeyboardHotKeyWidget hotkeys={['Meta', 'Shift', 'V']} />
    //       }
    //       onClick={onClickPasteWithStyle}
    //     />
    //   );
    //   return res;
    // },

    selectedKeysToClipboardData(ctx) {
      const { controller } = ctx;
      const model: SheetModel = controller.model;
      if (model.selectedKeys) {
        // 首先要normalize selectedKeys
        if (isAllSibiling(model, model.selectedKeys)) {
          const topics = model.selectedKeys.map(topicKey => {
            return controller.run('topicToJson', {
              ...ctx,
              model,
              topicKey
            });
          });
          const obj = { topics };
          const json = JSON.stringify(obj, null, 2);
          log('selectedKeysToClipboardData', json);
          return json;
        }
      }
      return null;
    },

    topicToJson(ctx) {
      const { controller, model, topicKey } = ctx;
      const topic = model.getTopic(topicKey);
      const blocks = controller.run('serializeBlocks', { ...ctx, topic });
      const extData = controller.run('topicExtDataToJson', ctx);
      const { collapse } = topic;
      return {
        collapse,
        blocks,
        extData,
        subTopics: topic.subKeys
          .toArray()
          .map(subKey =>
            controller.run('topicToJson', { ...ctx, topicKey: subKey })
          )
      };
    },

    pasteFromJson(ctx) {
      const { controller, json, docModel, topicKey } = ctx;
      let extData = docModel.extData;
      const res = [];
      if (json) {
        // 这一步生成随机的key, 并且将树状结构变成平铺结构
        const flattenTopics = [];
        json.topics.forEach(topic => {
          flattenTopics.push(...processTopicJson(topic, topicKey));
        });

        for (const item of flattenTopics) {
          res.push(
            controller.run('topicFromJson', {
              ...ctx,
              json: item
            })
          );

          extData = controller.run('processTopicExtData', {
            ...ctx,
            extData,
            topic: item
          });
        }
        controller.run('operation', {
          ...ctx,
          opType: OpType.ADD_MULTI_CHILD_WITH_EXTDATA,
          topicArray: res,
          extData
        });
      }
      return null;
    },

    processTopicExtData(ctx) {
      let { extData } = ctx;
      return extData;
    },

    topicFromJson(ctx) {
      const { controller, json } = ctx;
      return controller.run('deserializeTopic', { ...ctx, topic: json });
    },

    topicExtDataToJson(ctx) {
      return {};
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
