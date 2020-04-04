import { TopicDirection } from '@blink-mind/core';
import debug from 'debug';
import * as React from 'react';
import styled from 'styled-components';
import { linksRefKey, topicWidgetRootRefKey } from '../../utils';
import { BaseProps } from '../common';
import { TopicSubLinks } from './topic-sub-links';

const log = debug('node:topic-widget');

type TopicWidgetRootProps = {
  topicDirection: string;
};

const TopicWidgetRoot = styled.div<TopicWidgetRootProps>`
  display: flex;
  align-items: stretch;
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

const SubNodes = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

interface Props extends BaseProps {
  setViewBoxScroll?: (left: number, top: number) => void;
  setViewBoxScrollDelta?: (left: number, top: number) => void;
}

export class TopicWidget extends React.Component<Props> {
  renderSubTopics(props) {
    const { controller, model, topicKey, dir } = props;
    const topics = model.getTopic(topicKey).subKeys.toArray();
    const res = controller.run('createSubTopics', { ...props, topics });
    if (!res) return null;
    const { subTopics } = res;
    const subLinks = controller.run('renderSubLinks', props);
    return (
      <NodeChildren dir={dir} marginH={model.config.theme.marginH}>
        <SubNodes>{subTopics}</SubNodes>
        {subLinks}
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
    const { controller, topic, topicKey, dir, saveRef } = props;
    log('render', topicKey);
    const topicStyle = controller.run('getTopicContentStyle', props);
    const linkStyle = controller.run('getLinkStyle', props);
    const propsMore = {
      ...props,
      topic,
      topicStyle,
      linkStyle
    };
    const topicNode = controller.run('renderTopicNode', propsMore);

    return (
      <TopicWidgetRoot
        topicDirection={dir}
        ref={saveRef(topicWidgetRootRefKey(topicKey))}
      >
        {topicNode}
        {this.renderSubTopics(propsMore)}
      </TopicWidgetRoot>
    );
  }
}
