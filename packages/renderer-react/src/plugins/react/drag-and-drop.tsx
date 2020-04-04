import {
  FocusMode,
  getRelationship,
  OpType,
  TopicRelationship
} from '@blink-mind/core';
import debug from 'debug';
import * as React from 'react';
import styled from 'styled-components';
import { TopicDropEffect } from '../../components/widgets';
import { contentRefKey, dropAreaRefKey, RefKey } from '../../utils';
const log = debug('plugin:drag-and-drop');
const DropArea = styled.div`
  height: ${props => `${props.height}px`};
  width: 100%;
  margin: 1px 0;
  padding: 2px 0;
`;

export function DragAndDropPlugin() {
  // let dragTargetKey: KeyType = null;
  // let dragTargetDir: string = null;

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
          // height={model.config.theme.marginV / 2}
          height={8}
          ref={saveRef(dropAreaRefKey(topicKey, dropDir))}
          {...eventHandlers}
        />
      );
    },

    renderDragAndDropEffect(props) {
      log('renderDragAndDropEffect');
      const { saveRef, model } = props;
      return (
        <TopicDropEffect
          ref={saveRef(RefKey.DROP_EFFECT_KEY + model.id)}
          {...props}
        />
      );
    },

    handleTopicDragStart(props) {
      log('handleTopicDragStart');
      const { controller, ev } = props;
      ev.stopPropagation();
      controller.run('operation', {
        ...props,
        opType: OpType.FOCUS_TOPIC,
        focusMode: FocusMode.DRAGGING
      });
    },

    canDrop(props) {
      const { controller, srcKey, dstKey, dropDir } = props;
      const model = controller.model;
      if (
        srcKey === model.editorRootTopicKey ||
        srcKey === dstKey ||
        getRelationship(model, srcKey, dstKey) === TopicRelationship.ANCESTOR
      )
        return false;
      if (dstKey === model.editorRootTopicKey && dropDir !== 'in') return false;

      const srcTopic = model.getTopic(srcKey);
      return !(srcTopic.parentKey === dstKey && dropDir === 'in');
    },

    handleTopicDragEnter(props) {
      const { dropDir, topicKey, controller, setDiagramState } = props;
      const model = controller.model;
      log('handleTopicDragEnter:', topicKey, dropDir);
      const canDrop = controller.run('canDrop', {
        ...props,
        srcKey: model.focusKey,
        dstKey: topicKey
      });
      if (canDrop) {
        setDiagramState({
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
      setDiagramState({ dragDrop: null });
    },

    handleTopicDrop(props) {
      log('handleTopicDrop');
      const { controller, topicKey, diagramState, setDiagramState } = props;
      const model = controller.model;
      props = { ...props, srcKey: model.focusKey, dstKey: topicKey };

      setDiagramState({ dragDrop: null });
      if (controller.run('canDrop', props)) {
        controller.run('operation', {
          ...props,
          opType: OpType.DRAG_AND_DROP
        });
      }
    }
  };
}
