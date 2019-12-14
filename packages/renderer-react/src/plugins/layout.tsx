import {
  DiagramLayoutType,
  KeyType,
  Model,
  ModelModifier
} from '@blink-mind/core';
import * as React from 'react';
import { linksRefKey } from '../utils';
import { TopicWidget } from './react/components/topic-widget';

export type GetPartTopicsArg = {
  layout: DiagramLayoutType;
  model: Model;
  topicKey: KeyType;
};
export interface GetPartTopicsRes {
  [part: number]: KeyType[];
}

export function LayoutPlugin() {
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

    createSubTopics({ props, topics }) {
      const { model, topicKey } = props;
      const topic = model.getTopic(topicKey);
      if (topics.size === 0 || topic.collapse) return null;
      const subTopics = [];
      topics.forEach(tKey => {
        const subTopicProps = { ...props, topicKey: tKey };
        subTopics.push(<TopicWidget key={tKey} {...subTopicProps} />);
      });
      return { subTopics };
    },

    layout(props) {
      const { getRef, topicKey } = props;
      const links = getRef(linksRefKey(topicKey));
      const highlight = getRef('focus-highlight');
      const dropEffect = getRef('drop-effect');
      links && links.layout();
      highlight && highlight.layout();
      dropEffect && dropEffect.layout();
    },

    setLayoutDir(props) {
      const { layoutDir, model, controller } = props;
      controller.change(ModelModifier.setLayoutDir({ model, layoutDir }));
    },

    setZoomFactor(props) {
      const { zoomFactor, model, controller } = props;
      const newModel = ModelModifier.setZoomFactor({ model, zoomFactor });
      if (newModel !== model) controller.change(newModel);
    }
  };
}
