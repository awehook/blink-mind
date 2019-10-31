import * as React from 'react';
import styled from 'styled-components';
import { TopicDirection } from '@blink-mind/core';
import { BaseProps } from '../../../components/BaseProps';

type NodeProps = {
  topicDirection: string;
};

const Node = styled.div<NodeProps>`
  display: flex;
  align-items: center;
  padding: 0px 10px;
  flex-direction: ${props =>
    props.topicDirection === TopicDirection.RIGHT ? 'row' : 'row-reverse'};
`;

// TODO
const NodeChildren = styled.div`
  position: relative;
  padding: 11px 0px;
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
    const { controller, model, topicKey, dir, saveRef, getRef } = props;
    const topics = model.getTopic(topicKey).subKeys.toArray();
    const res = controller.run('createSubTopicsAndSubLinks', { props, topics });
    if (!res) return null;
    const { subTopics } = res;
    return <NodeChildren>{subTopics}</NodeChildren>;
  }
  render() {
    const props = this.props;
    const { controller, model, topicKey, dir, saveRef, getRef } = props;
    const topicStyle = controller.run('getTopicStyle', props);
    const topicContent = controller.run('renderTopicContent',
{ ...props, topicStyle }
    );

    const collapseIcon = controller.run('renderTopicCollapseIcon',)

    return (
      <Node topicDirection={dir}>
        <NodeTopic topicDirection={dir} ref={saveRef(`topic-${topicKey}`)}>
          {topicContent}
        </NodeTopic>

        {this.renderSubTopics()}
      </Node>
    );
  }
}
