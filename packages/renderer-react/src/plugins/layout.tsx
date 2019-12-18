import {
  DiagramLayoutType,
  KeyType,
  Model,
  ModelModifier,
  Topic
} from '@blink-mind/core';
import * as React from 'react';
import {
  getRelativeRect, getRelativeVector,
  linksRefKey,
  RefKey,
  topicWidgetRefKey
} from '../utils';

export type GetPartTopicsArg = {
  layout: DiagramLayoutType;
  model: Model;
  topicKey: KeyType;
};
export interface GetPartTopicsRes {
  [part: number]: KeyType[];
}

export function LayoutPlugin() {
  const _zoomFactor = 1;
  return {
    getPartTopics({
      layout,
      model,
      topicKey
    }: GetPartTopicsArg): GetPartTopicsRes {
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
          key: tKey,
          ref: saveRef(topicWidgetRefKey(tKey))
        };
        subTopics.push(controller.run('renderTopicWidget', topicProps));
      });
      return { subTopics };
    },

    layout(props) {
      const { getRef, model } = props;
      const links = getRef(linksRefKey(model.editorRootTopicKey));
      const highlight = getRef(RefKey.FOCUS_HIGHLIGHT_KEY);
      const dropEffect = getRef(RefKey.DROP_EFFECT_KEY);
      links && links.layout();
      highlight && highlight.layout();
      dropEffect && dropEffect.layout();

      const editorRootTopic = model.getTopic(model.editorRootTopicKey);
      layoutTopic(editorRootTopic);

      function layoutTopic(topic: Topic) {
        if (topic.key !== model.editorRootTopicKey) {
          const topicWidget = getRef(topicWidgetRefKey(topic.key));
          topicWidget && topicWidget.layoutLinks();
        }

        for (const subKey of topic.subKeys) {
          layoutTopic(model.getTopic(subKey));
        }
      }
    },

    setLayoutDir(props) {
      const { layoutDir, model, controller } = props;
      controller.change(ModelModifier.setLayoutDir({ model, layoutDir }));
    },

    getRelativeRect(props) {
      const { element, controller, getRef } = props;
      const zoomFactor = controller.run('getZoomFactor', props);
      const bigView = getRef(RefKey.DRAG_SCROLL_WIDGET_KEY).bigView;
      return getRelativeRect(element, bigView, zoomFactor);
    },

    getRelativeRectFromViewPort(props) {
      const { element, controller, getRef } = props;
      const zoomFactor = controller.run('getZoomFactor', props);
      const viewBox = getRef(RefKey.DRAG_SCROLL_WIDGET_KEY).viewBox;
      return getRelativeRect(element, viewBox, zoomFactor);
    },
    getRelativeVectorFromViewPort(props) {
      const { element, controller, getRef } = props;
      const zoomFactor = controller.run('getZoomFactor', props);
      const viewBox = getRef(RefKey.DRAG_SCROLL_WIDGET_KEY).viewBox;
      return getRelativeVector(element, viewBox);
    },

    addZoomFactorChangeEventListener(props) {
      const { controller } = props;
      controller.run('addTempValueChangeListener', {
        key: 'ZoomFactor',
        ...props
      });
    },

    removeZoomFactorChangeEventListener(props) {
      const { controller } = props;
      controller.run('removeTempValueChangeListener', {
        key: 'ZoomFactor',
        ...props
      });
    },

    setZoomFactor(props) {
      const { controller, zoomFactor } = props;
      return controller.run('setTempValue', {
        key: 'ZoomFactor',
        value: zoomFactor
      });
    },

    getZoomFactor(props) {
      const { controller } = props;
      return (
        controller.run('getTempValue', { key: 'ZoomFactor' }) || _zoomFactor
      );
    }
  };
}
