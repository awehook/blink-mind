import {
  FocusMode,
  getRelationship,
  OpType,
  TopicRelationship
} from '@blink-mind/core';
import debug from 'debug';
import * as React from 'react';
import styled from 'styled-components';
import { TopicDropEffect } from '../../components/widgets/topic-drop-effect';
import { contentRefKey, dropAreaRefKey, RefKey } from '../../utils';
const log = debug('plugin:drag-and-drop');
const DropArea = styled.div`
  height: ${props => `${props.height}px`};
  width: 100%;
  margin: 5px 0px;
`;

export function DragAndDropPlugin() {
  // let dragTargetKey: KeyType = null;
  // let dragTargetDir: string = null;

  return {
    renderTopicDropArea(props) {
      const { topicKey, dropDir, saveRef, controller, model } = props;
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
          height={model.config.theme.marginV / 2}
          ref={saveRef(dropAreaRefKey(topicKey, dropDir))}
          {...eventHandlers}
        />
      );
    },

    renderDragAndDropEffect(props) {
      log('renderDragAndDropEffect');
      const { saveRef } = props;
      return (
        <TopicDropEffect
          ref={saveRef(RefKey.DROP_EFFECT_KEY)}
          {...props}
        ></TopicDropEffect>
      );
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
      const {
        dropDir,
        topicKey,
        controller,
        model,
        diagramState,
        setDiagramState
      } = props;
      log('handleTopicDragEnter:', topicKey, dropDir);
      const canDrop = controller.run('canDrop', {
        ...props,
        srcKey: model.focusKey,
        dstKey: topicKey
      });
      if (canDrop) {
        setDiagramState({
          ...diagramState,
          dragDrop: {
            targetKey: topicKey,
            targetDir: dropDir
          }
        });
      }
    },

    handleTopicDragLeave(props) {
      const {
        topicKey,
        dropDir,
        getRef,
        ev,
        diagramState,
        setDiagramState
      } = props;
      const relatedTarget = ev.nativeEvent.relatedTarget;
      log('handleTopicDragLeave:', topicKey, dropDir);
      const content = getRef(contentRefKey(topicKey));
      if (content == relatedTarget || content.contains(relatedTarget)) {
        return;
      }
      setDiagramState({ ...diagramState, dragDrop: null });
    },

    handleTopicDrop(props) {
      log('handleTopicDrop');
      const {
        controller,
        topicKey,
        model,
        diagramState,
        setDiagramState
      } = props;
      props = { ...props, srcKey: model.focusKey, dstKey: topicKey };

      setDiagramState({ ...diagramState, dragDrop: null });
      if (controller.run('canDrop', props)) {
        controller.run('operation', {
          ...props,
          opType: OpType.DRAG_AND_DROP
        });
      }
    }
  };
}
