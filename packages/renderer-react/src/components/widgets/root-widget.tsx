import { DiagramLayoutType, KeyType, TopicDirection } from '@blink-mind/core';
import debug from 'debug';
import * as React from 'react';
import styled from 'styled-components';
import { topicRefKey } from '../../utils';
import { BaseProps } from '../common';

const log = debug('RootNode');

const LayerPart = styled.div`
  display: flex;
  position: relative;

  align-items: ${props =>
    //@ts-ignore
    props.topicDirection === TopicDirection.LEFT ? 'flex-end' : 'flex-start'};
  flex-direction: column;

  padding: ${props =>
    //@ts-ignore
    props.topicDirection === TopicDirection.LEFT
      ? '15px 60px 15px 0px'
      : '15px 0px 15px 60px'};
`;

const Topic = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  z-index: 3;
`;

interface Props extends BaseProps {
  setViewBoxScroll?: (left: number, top: number) => void;
  setViewBoxScrollDelta?: (left: number, top: number) => void;
}

export class RootWidget extends React.Component<Props> {
  renderPartTopics(topics: KeyType[], dir: string) {
    const { controller, saveRef } = this.props;
    const res = controller.run('createSubTopics', {
      ...this.props,
      dir,
      isRoot: true,
      topics
    });
    if (!res) return null;
    const { subTopics } = res;
    const cxName = `bm-layer-${dir === TopicDirection.LEFT ? 'left' : 'right'}`;
    return (
      //@ts-ignore
      <LayerPart topicDirection={dir} ref={saveRef(cxName)}>
        {subTopics}
      </LayerPart>
    );
  }

  render() {
    log('render');
    const props = this.props;
    const { model, topicKey, saveRef, controller } = props;
    const topicStyle = controller.run('getTopicContentStyle', props);
    const config = model.config;
    const topicContent = controller.run('renderTopicContent', {
      ...props,
      topicStyle,
      dir: TopicDirection.MAIN
    });
    const partTopics = controller.run('getPartTopics', {
      layout: config.layoutDir,
      model,
      topicKey
    });
    const rootTopic = (
      <Topic ref={saveRef(topicRefKey(topicKey))}>{topicContent}</Topic>
    );
    const children = controller.run('renderRootWidgetOtherChildren', props);
    switch (config.layoutDir) {
      case DiagramLayoutType.LEFT_AND_RIGHT:
        return (
          <>
            {this.renderPartTopics(partTopics.L, 'L')}
            {rootTopic}
            {this.renderPartTopics(partTopics.R, 'R')}
            {children}
          </>
        );
      case DiagramLayoutType.LEFT_TO_RIGHT:
        return (
          <>
            {rootTopic}
            {this.renderPartTopics(partTopics.R, 'R')}
            {children}
          </>
        );
      case DiagramLayoutType.RIGHT_TO_LEFT:
        return (
          <>
            {this.renderPartTopics(partTopics.L, 'L')}
            {rootTopic}
            {children}
          </>
        );
      case DiagramLayoutType.TOP_TO_BOTTOM:
        return (
          <>
            {rootTopic}
            {this.renderPartTopics(partTopics.B, 'B')}
            {children}
          </>
        );
    }
    return null;
  }
}
