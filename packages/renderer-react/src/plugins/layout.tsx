import * as React from 'react';
import {
  DiagramLayoutType,
  Model,
  KeyType,
  TopicDirection
} from '@blink-mind/core';
import { TopicWidget } from './react/components/topic-widget';
import { getLinkKey } from '../utils';

type _GetPartTopicsArg = {
  layout: DiagramLayoutType;
  model: Model;
  topicKey: KeyType;
};
interface _GetPartTopicsRes {
  [part: number]: KeyType[];
}

export function LayoutPlugin() {
  return {
    getPartTopics({
      layout,
      model,
      topicKey
    }: _GetPartTopicsArg): _GetPartTopicsRes {
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

    createSubTopicsAndSubLinks({ props, topics }) {
      const { model, topicKey, controller } = props;
      const topic = model.getTopic(topicKey);
      if (topics.size === 0 || topic.collapse) return null;
      const subTopics = [],
        subLinks = [],
        subLinksKeys = [];
      topics.forEach(tKey => {
        const subTopicProps = { ...props, topicKey: tKey };
        subTopics.push(<TopicWidget key={tKey} {...subTopicProps} />);
        let linkKey = getLinkKey(topicKey, tKey);
        const subLinkProps = { ...props, fromKey: topicKey, toKey: tKey };
        subLinks.push(controller.run('renderLink', { ...subLinkProps }));
        subLinksKeys.push(linkKey);
      });
      return { subTopics, subLinks, subLinksKeys };
    }
  };
}
