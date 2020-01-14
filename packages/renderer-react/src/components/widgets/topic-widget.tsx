import { TopicDirection } from '@blink-mind/core';
import debug from 'debug';
import * as React from 'react';
import styled from 'styled-components';
import { linksRefKey, topicRefKey } from '../../utils';
import { BaseProps } from '../common';
import { TopicSubLinks } from './topic-sub-links';

const log = debug('node:topic-widget');

type NodeProps = {
  topicDirection: string;
};

const Node = styled.div<NodeProps>`
  display: flex;
  align-items: center;
  flex-direction: ${props =>
    props.topicDirection === TopicDirection.RIGHT ? 'row' : 'row-reverse'};
`;

interface NodeChildrenProps {
  dir: string;
  marginH: number;
}

// TODO
const NodeChildren = styled.div<NodeChildrenProps>`
  position: relative;
  padding: ${props =>
    props.dir === TopicDirection.RIGHT
      ? `0 0 0 ${props.marginH}px`
      : `0 ${props.marginH}px 0 0`};
`;

interface NodeTopicProps {
  topicDirection: string;
}

const NodeTopic = styled.div<NodeTopicProps>`
  display: flex;
  position: relative;
  align-items: center;

  flex-direction: ${props =>
    props.topicDirection === TopicDirection.RIGHT ? 'row' : 'row-reverse'};
`;

interface Props extends BaseProps {
  setViewBoxScroll?: (left: number, top: number) => void;
  setViewBoxScrollDelta?: (left: number, top: number) => void;
}

export class TopicWidget extends React.Component<Props> {
  renderSubTopics() {
    const props = this.props;
    const { controller, model, topicKey, dir } = props;
    const topics = model.getTopic(topicKey).subKeys.toArray();
    const res = controller.run('createSubTopics', { ...props, topics });
    if (!res) return null;
    const { subTopics } = res;
    const subLinks = controller.run('renderSubLinks', props);
    return (
      <NodeChildren dir={dir} marginH={model.config.theme.marginH}>
        {subTopics} {subLinks}
      </NodeChildren>
    );
  }

  // componentDidUpdate(): void {
  //   this.layoutLinks();
  // }
  //
  // componentDidMount(): void {
  //   this.layoutLinks();
  // }

  layoutLinks() {
    const { getRef, topicKey, model } = this.props;
    const topic = model.getTopic(topicKey);
    if (topic.subKeys.size === 0 || topic.collapse) return;
    log('layoutLinks', topicKey);
    const links: TopicSubLinks = getRef(linksRefKey(topicKey));
    links && links.layout();
  }

  render() {
    const props = this.props;
    const { controller, topicKey, dir, saveRef } = props;
    log('render', topicKey);
    const topicStyle = controller.run('getTopicContentStyle', props);
    const propsMore = {
      ...props,
      topicStyle
    };
    const topicContent = controller.run('renderTopicContent', propsMore);

    return (
      <Node topicDirection={dir}>
        <NodeTopic topicDirection={dir} ref={saveRef(topicRefKey(topicKey))}>
          {topicContent}
        </NodeTopic>
        {this.renderSubTopics()}
      </Node>
    );
  }
}
