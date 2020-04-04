import { BlockType } from '@blink-mind/core';
import htmlToText from 'html-to-text';
import React from 'react';
import { TopicContentEditor } from './topic-content-editor';

export function TopicContentEditorPlugin() {
  return {
    getTopicTitle(ctx) {
      const {
        topicKey,
        maxLength,
        usePlainText = true,
        sheetId,
        docModel
      } = ctx;
      const model = sheetId ? docModel.getSheetModel(sheetId) : ctx.model;
      const topic = model.getTopic(topicKey);
      const block = topic.getBlock(BlockType.CONTENT).block;
      let text = usePlainText
        ? htmlToText.fromString(block.data, { preserveNewlines: true })
        : block.data;
      if (maxLength != null) {
        text =
          text.length > maxLength ? text.substr(0, maxLength) + '...' : text;
      }
      return text;
    },

    renderTopicContentEditor(props) {
      return <TopicContentEditor {...props} />;
    },

    serializeBlockData(props, next) {
      const { block } = props;
      if (block.type === BlockType.CONTENT) {
        return typeof block.data === 'string'
          ? block.data
          : block.data.getCurrentContent().getPlainText();
      }
      return next();
    }
  };
}
