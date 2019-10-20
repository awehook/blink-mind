import * as React from 'react';
import { DiagramLayoutDirection, Model, KeyType } from '@blink-mind/core';
import { TopicWidget } from '../components/topic-widget';
import { getLinkKey } from '../utils';

export function LayoutPlugin() {
  type _GetPartTopicsArg = {
    dir: DiagramLayoutDirection;
    model: Model;
    topicKey: KeyType;
  };
  function getPartTopics({ dir, model, topicKey }: _GetPartTopicsArg) {
    const topic = model.getTopic(topicKey);
    const subTopicCount = topic.subKeys.size;
    const topics = topic.subKeys.toArray();
    switch (dir) {
      case DiagramLayoutDirection.LEFT_TO_RIGHT:
        return [[], topics];
      case DiagramLayoutDirection.RIGHT_TO_LEFT:
        return [topics, []];
      case DiagramLayoutDirection.LEFT_AND_RIGHT:
        return [
          topics.slice(Math.ceil(subTopicCount / 2), subTopicCount),
          topics.slice(0, Math.ceil(subTopicCount / 2))
        ];
    }
  }

  function createSubTopicsAndSubLinks({ props, topics }) {
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
}
