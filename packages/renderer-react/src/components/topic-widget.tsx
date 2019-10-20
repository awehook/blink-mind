import * as React from 'react';
import styled from 'styled-components';
import { Controller, Model, TopicWidgetDirection } from '@blink-mind/core';
import { BaseProps } from './BaseProps';

type NodeProps = {
  dir: TopicWidgetDirection;
};

const Node = styled.div<NodeProps>`
  display: flex;
  align-items: center;
  padding: 0px 10px;
  flex-direction: ${props =>
    props.dir === TopicWidgetDirection.RIGHT ? 'row' : 'row-reverse'};
`;

const NodeChildren = styled.div`
  position: relative;
  padding: 11px 0px;
`;

const NodeTopic = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  flex-direction: ${props =>
    //@ts-ignore
    props.dir === TopicWidgetDirection.RIGHT ? 'row' : 'row-reverse'};
`;

interface Props extends BaseProps {
  setViewBoxScroll?: (left: number, top: number) => void;
  setViewBoxScrollDelta?: (left: number, top: number) => void;
}

export class TopicWidget extends React.Component<Props> {
  renderSubTopics() {
    const props = this.props;
    const { controller, model, topicKey, dir, saveRef, getRef } = props;
    const topics = model.getTopic(topicKey).subKeys.toArray();
    const res = controller.run('createSubTopicsAndSubLinks', { props, topics });
    if (!res) return null;
    // const { su };
  }
  render() {
    const { controller, model, topicKey, dir, saveRef, getRef } = this.props;
    const topicContent = controller.run('renderTopicContent', this.props);
    return (
      //@ts-ignore
      <Node dir={dir}>
        //@ts-ignore
        <NodeTopic dir={dir} ref={saveRef(`topic-${topicKey}`)}>
          {topicContent}
        </NodeTopic>
      </Node>
    );
  }
}
