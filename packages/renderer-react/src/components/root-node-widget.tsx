import * as React from 'react';
import styled from 'styled-components';
import {
  Controller,
  Model,
  KeyType,
  TopicWidgetDirection,
  DiagramLayoutDirection
} from '@blink-mind/core';
import debug from 'debug';
import { BaseProps } from './BaseProps';

const log = debug('RootNode');

const LayerPart = styled.div`
  display: flex;
  position: relative;

  align-items: ${props =>
    //@ts-ignore
    props.dir === NodeWidgetDirection.LEFT ? 'flex-end' : 'flex-start'};
  flex-direction: column;

  padding: ${props =>
    //@ts-ignore
    props.dir === NodeWidgetDirection.LEFT
      ? '15px 60px 15px 0px'
      : '15px 0px 15px 60px'};
`;

const Topic = styled.div`
  display: flex;
  position: relative;
  align-items: center;
`;

interface Props extends BaseProps {
  setViewBoxScroll?: (left: number, top: number) => void;
  setViewBoxScrollDelta?: (left: number, top: number) => void;
}

export class RootNodeWidget extends React.Component<Props> {
  renderPartTopics(topics: KeyType[], dir: TopicWidgetDirection) {
    const { controller, saveRef } = this.props;
    const res = controller.run('createSubTopicsAndSubLinks', {
      props: { ...this.props, dir, isRoot: true },
      topics
    });
    if (!res) return null;
    const { subTopics } = res;
    const cxName = `bm-layer-${
      dir === TopicWidgetDirection.LEFT ? 'left' : 'right'
    }`;
    return (
      //@ts-ignore
      <LayerPart dir={dir} ref={saveRef(cxName)}>
        {subTopics}
      </LayerPart>
    );
  }

  render() {
    log('render');
    const props = this.props;
    const { model, topicKey, saveRef, getRef, controller } = props;
    const config = model.config;
    const topicContent = controller.run('renderTopicContent', { props });
    return (
      <>
        <Topic ref={saveRef(`topic-${topicKey}`)}>{topicContent}</Topic>
      </>
    );
  }
}
