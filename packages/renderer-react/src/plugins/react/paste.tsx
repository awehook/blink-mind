import { isAllSibiling, SheetModel } from '@blink-mind/core';
import { MenuItem } from '@blueprintjs/core';
import { KeyboardHotKeyWidget } from '../../components/widgets';
import * as React from 'react';
import { I18nKey, getI18nText, Icon, IconName } from '../../utils';
import { Topic } from '../../../../core/src/models';
import { createKey } from '../../../../core/src/utils';

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
          const json = JSON.stringify(topics, null, 2);
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
      const { controller, json, docModel } = ctx;
      const res = [];
      if (json) {
        if (Array.isArray(json)) {
          for (let item of json) {
            res.push(
              controller.run('topicsFromJson', {
                ...ctx,
                json: item,
                parentKey: null
              })
            );
          }
        } else {
          if (json.subTopics.length > 0) {
            const subTopics = controller.run('topicsFromJson', {
              ...ctx,
              json: json.subTopics,
              parentKey: json.key
            });
          } else {
            const { key, collapse, blocks, extData } = json;
            // let topic = Topic.create();
          }
        }
      }
      return null;
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
