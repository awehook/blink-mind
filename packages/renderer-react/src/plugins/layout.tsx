import {
  DiagramLayoutType,
  FocusMode,
  getRelationship,
  IControllerRunContext,
  KeyType,
  OpType,
  SheetModel,
  Topic,
  TopicRelationship
} from '@blink-mind/core';
import {
  RootSubLinks,
  TopicDropEffect,
  TopicWidget
} from '../components/widgets';

import { MoveTopicDir } from '../types';
import {
  getRelativeRect,
  getRelativeVector,
  linksRefKey,
  RefKey,
  topicNodeRefKey,
  topicWidgetRefKey,
  tvZoomFactorKey
} from '../utils';

export type GetPartTopicsArg = {
  layout: DiagramLayoutType;
  model: SheetModel;
  topicKey: KeyType;
};

export function LayoutPlugin() {
  const _zoomFactor = 1;
  return {
    getPartTopics({ layout, model, topicKey }: GetPartTopicsArg) {
      const topic = model.getTopic(topicKey);
      const subTopicCount = topic.subKeys.size;
      const topics = topic.subKeys.toArray();
      switch (layout) {
        case DiagramLayoutType.LEFT_TO_RIGHT:
          return { R: topics };
        case DiagramLayoutType.RIGHT_TO_LEFT:
          return { L: topics };
        case DiagramLayoutType.LEFT_AND_RIGHT:
          return {
            L: topics.slice(Math.ceil(subTopicCount / 2), subTopicCount),
            R: topics.slice(0, Math.ceil(subTopicCount / 2))
          };
        case DiagramLayoutType.TOP_TO_BOTTOM:
          return {
            B: topics
          };
      }
    },

    createSubTopics(props) {
      const { model, topicKey, controller, topics, saveRef } = props;
      const topic = model.getTopic(topicKey);
      if (topics.size === 0 || topic.collapse) return null;
      const subTopics = [];
      topics.forEach(tKey => {
        const topicProps = {
          ...props,
          topicKey: tKey,
          topic: model.getTopic(tKey),
          key: tKey,
          ref: saveRef(topicWidgetRefKey(tKey))
        };
        subTopics.push(controller.run('renderTopicWidget', topicProps));
      });
      return { subTopics };
    },

    layout(props) {
      const { getRef, model } = props;
      const links = getRef(
        linksRefKey(model.editorRootTopicKey)
      ) as RootSubLinks;
      const dropEffect = getRef(
        RefKey.DROP_EFFECT_KEY + model.id
      ) as TopicDropEffect;
      links && links.layout();
      dropEffect && dropEffect.layout();

      const editorRootTopic = model.getTopic(model.editorRootTopicKey);
      layoutTopic(editorRootTopic);

      function layoutTopic(topic: Topic) {
        if (topic.key !== model.editorRootTopicKey) {
          const topicWidget = getRef(
            topicWidgetRefKey(topic.key)
          ) as TopicWidget;
          topicWidget && topicWidget.layoutLinks();
        }
        if (!topic.collapse) {
          for (const subKey of topic.subKeys) {
            layoutTopic(model.getTopic(subKey));
          }
        }
      }
    },

    getRelativeRect(props) {
      const { element, controller, getRef, model } = props;
      const zoomFactor = controller.run('getZoomFactor', props);
      const bigView = getRef(RefKey.DRAG_SCROLL_WIDGET_KEY + model.id).bigView;
      return getRelativeRect(element, bigView, zoomFactor);
    },

    getRelativeRectFromViewPort(props) {
      const { element, controller, getRef, model } = props;
      const zoomFactor = controller.run('getZoomFactor', props);
      const viewBox = getRef(RefKey.DRAG_SCROLL_WIDGET_KEY + model.id).viewBox;
      return getRelativeRect(element, viewBox, zoomFactor);
    },
    getRelativeVectorFromViewPort(props) {
      const { element, getRef, model } = props;
      const viewBox = getRef(RefKey.DRAG_SCROLL_WIDGET_KEY + model.id).viewBox;
      return getRelativeVector(element, viewBox);
    },

    addZoomFactorChangeEventListener(props) {
      const { controller, model } = props;
      controller.run('addTempValueChangeListener', {
        key: tvZoomFactorKey(model),
        ...props
      });
    },

    removeZoomFactorChangeEventListener(props) {
      const { controller, model } = props;
      controller.run('removeTempValueChangeListener', {
        key: tvZoomFactorKey(model),
        ...props
      });
    },

    setZoomFactor(props) {
      const { controller, model, zoomFactor } = props;
      return controller.run('setTempValue', {
        key: tvZoomFactorKey(model),
        value: zoomFactor
      });
    },

    getZoomFactor(props) {
      const { controller, model } = props;
      return (
        controller.run('getTempValue', { key: tvZoomFactorKey(model) }) ||
        _zoomFactor
      );
    },

    setZoomFactorOnWheel(ctx) {
      const { controller, ev } = ctx;
      if (controller.run('isCommandOrControl', ctx)) {
        let zoomFactor = controller.run('getZoomFactor', ctx);
        zoomFactor = zoomFactor - (ev.nativeEvent.deltaY > 0 ? 0.1 : -0.1);
        if (zoomFactor < 0.5) zoomFactor = 0.5;
        if (zoomFactor > 4) zoomFactor = 4;
        // console.log('zoomFactor=>', zoomFactor);
        controller.run('setZoomFactor', { ...ctx, zoomFactor });
      }
    },

    moveTopicToCenter(ctx: IControllerRunContext & { moveDir?: number }) {
      const { controller, getRef, moveDir = MoveTopicDir.CENTER } = ctx;
      const model = controller.model;
      const topicKey = ctx.topicKey || model.focusKey;
      if (
        model.editorRootTopicKey !== topicKey &&
        getRelationship(model, topicKey, model.editorRootTopicKey) !==
          TopicRelationship.DESCENDANT
      ) {
        throw new Error(
          `moveTopicToCenter error: topicKey ${topicKey} is not the DESCENDANT of editor root topic`
        );
      }
      const topic = getRef(topicNodeRefKey(topicKey));
      const dragScroll = getRef(RefKey.DRAG_SCROLL_WIDGET_KEY + model.id);
      const viewBox = dragScroll.viewBox;
      if (!topic || !viewBox) {
        throw new Error(`moveTopicToCenter error: topic or viewBox is null`);
      }
      const vector = getRelativeVector(topic, viewBox);
      //TODO
      if (moveDir === MoveTopicDir.CENTER)
        dragScroll.setViewBoxScrollDelta(vector[0], vector[1]);
      else if (moveDir === MoveTopicDir.LEFT_CENTER) {
        const boxRect = viewBox.getBoundingClientRect();
        const topicRect = topic.getBoundingClientRect();
        const delta = (boxRect.width - topicRect.width) / 2;
        dragScroll.setViewBoxScrollDelta(vector[0] + delta - 200, vector[1]);
      }
    },

    focusTopicAndMoveToCenter(props) {
      const { controller, topicKey, sheetId } = props;
      const opArray: Array<any> = [
        {
          opType: OpType.FOCUS_TOPIC,
          topicKey,
          focusMode: FocusMode.NORMAL
        },
        {
          opType: OpType.EXPAND_TO,
          topicKey
        }
      ];
      if (sheetId && sheetId !== controller.model.id) {
        opArray.unshift({ opType: OpType.SET_CURRENT_SHEET, sheetId });
      }
      controller.run('operation', {
        ...props,
        opType: OpType.SET_FOCUS_MODE,
        focusMode: FocusMode.NORMAL
      });
      controller.run('operation', {
        ...props,
        opArray,
        allowUndo: false,
        callback: docModel => () => {
          controller.run('moveTopicToCenter', { ...props, docModel, topicKey });
        }
      });
    }
  };
}
