import * as React from 'react';
import styled from 'styled-components';
import { OpType } from '@blink-mind/renderer-react';
import {
  FocusMode,
  getRelationship,
  TopicRelationship
} from '@blink-mind/core';
import debug from 'debug';
import { TopicDropEffect } from './react/components/topic-drop-effect';
import { contentRefKey } from '../utils';
const log = debug('plugin:drag-and-drop');
const DropArea = styled.div`
  height: 20px;
  width: 100%;
  margin: 5px 0px;
`;

const DropEffects = styled.svg``;
export function DragAndDrop() {
  let dragTargetKey: KeyType = null;
  let dragTargetDir: string = null;

  return {
    renderTopicDropArea(props) {
      const { topicKey, dropDir, saveRef, controller } = props;
      const onDragEnter = ev => {
        log('onDragEnter', topicKey, dropDir);
        controller.run('handleTopicDragEnter', { ...props, ev, dropDir });
      };
      const onDragLeave = ev => {
        log('onDragLeave', topicKey, dropDir);
        controller.run('handleTopicDragLeave', { ...props, ev, dropDir });
      };
      const onDragOver = ev => {
        ev.preventDefault();
      };
      const onDrop = ev => {
        log('onDrop', topicKey, dropDir);
        controller.run('handleTopicDrop', { ...props, ev, dropDir });
      };
      const eventHandlers = {
        onDragEnter,
        onDragLeave,
        onDragOver,
        onDrop
      };
      return (
        <DropArea
          ref={saveRef(`dropArea-${dropDir}-${topicKey}`)}
          {...eventHandlers}
        />
      );
    },

    renderDragAndDropEffect(props) {
      log('renderDragAndDropEffect');
      const { saveRef } = props;
      return (
        <TopicDropEffect
          ref={saveRef('drop-effect')}
          {...props}
        ></TopicDropEffect>
      );
    },

    // getTopicDropEventHandlers(props) {
    //   const { dropDir, controller, topicKey } = props;
    //   const onDragEnter = ev => {
    //     log('onDragEnter', topicKey, dropDir);
    //     controller.run('handleTopicDragEnter', { ...props, ev, dropDir });
    //   };
    //   const onDragLeave = ev => {
    //     log('onDragLeave', topicKey, dropDir);
    //     controller.run('handleTopicDragLeave', { ...props, ev, dropDir });
    //   };
    //   const onDragOver = ev => {
    //     ev.preventDefault();
    //   };
    //   const onDrop = ev => {
    //     log('onDrop', topicKey, dropDir);
    //     controller.run('handleTopicDrop', { ...props, ev, dropDir });
    //   };
    //   const eventHandlers = {
    //     onDragEnter,
    //     onDragLeave,
    //     onDragOver,
    //     onDrop
    //   };
    //   return eventHandlers;
    // },

    getDragTargetProps(props) {
      return {
        key: dragTargetKey,
        dropDir: dragTargetDir
      };
    },

    handleTopicDragStart(props) {
      const { controller, ev } = props;
      ev.stopPropagation();
      controller.run('operation', {
        ...props,
        opType: OpType.FOCUS_TOPIC,
        focusMode: FocusMode.DRAGGING
      });
    },

    canDrop(props) {
      const { srcKey, dstKey, model, dropDir } = props;
      if (
        srcKey === model.editorRootTopicKey ||
        srcKey === dstKey ||
        getRelationship(model, srcKey, dstKey) === TopicRelationship.ANCESTOR
      )
        return false;
      if (dstKey === model.editorRootTopicKey && dropDir !== 'in') return false;

      const srcTopic = model.getTopic(srcKey);
      if (srcTopic.parentKey === dstKey && dropDir === 'in') return false;
      return true;
    },

    handleTopicDragEnter(props) {
      const { dropDir, topicKey, controller, model, ev } = props;
      log('handleTopicDragEnter:', topicKey, dropDir);
      const canDrop = controller.run('canDrop', {
        ...props,
        srcKey: model.focusKey,
        dstKey: topicKey
      });
      if (canDrop) {
        dragTargetKey = topicKey;
        dragTargetDir = dropDir;
        controller.change(model);
      }
    },

    handleTopicDragLeave(props) {
      const { controller, model, topicKey, dropDir, getRef, ev } = props;
      const relatedTarget = ev.nativeEvent.relatedTarget;
      log('handleTopicDragLeave:', topicKey, dropDir);
      const content = getRef(contentRefKey(topicKey));
      if (content == relatedTarget || content.contains(relatedTarget)) {
        return;
      }
      dragTargetKey = null;
      dragTargetDir = null;
      controller.change(model);
    },

    handleTopicDrop(props) {
      log('handleTopicDrop');
      const { controller, topicKey, model } = props;
      props = { ...props, srcKey: model.focusKey, dstKey: topicKey };

      dragTargetKey = null;
      dragTargetDir = null;
      if (controller.run('canDrop', props)) {
        controller.run('operation', {
          ...props,
          opType: OpType.DRAG_AND_DROP
        });
      }
    }
  };
}
