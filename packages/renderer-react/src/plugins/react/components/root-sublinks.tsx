import * as React from 'react';
import styled from 'styled-components';
import { TopicDirection, TopicStyle } from '@blink-mind/core';
import { BaseWidget } from '../../../components/common';
import { BaseProps } from '../../../components/base-props';
import {
  Point,
  centerX,
  centerY,
  centerPointX,
  centerPointY
} from '../../../utils';

import debug from 'debug';
import { contentRefKey, linksSvgRefKey } from '../../../utils';
const SVG = styled.svg`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  pointer-events: none;
`;

const log = debug('node:topic-sub-links');

interface Props extends BaseProps {}

interface State {
  curves: any[];
}

export class RootSubLinks extends BaseWidget<Props, State> {
  state = {
    curves: []
  };

  layout() {
    const props = this.props;
    const { model, getRef, topicKey, dir, controller } = props;
    const topic = model.getTopic(topicKey);
    const contentRect = getRef(contentRefKey(topicKey)).getBoundingClientRect();
    const svgRect: ClientRect = getRef(
      linksSvgRefKey(topicKey)
    ).getBoundingClientRect();
    let p1: Point, p2: Point;

    p1 = {
      x: centerX(contentRect) - svgRect.left,
      y: centerY(contentRect) - svgRect.top
    };
    const curves = [];
    topic.subKeys.forEach(key => {
      const style = controller.run('getTopicStyle', {
        ...props,
        topicKey: key
      });
      let rect = getRef(contentRefKey(key)).getBoundingClientRect();
      if (rect.left > contentRect.right) {
        p2 = {
          x: rect.left,
          y: centerY(rect)
        };
      } else {
        p2 = {
          x: rect.right,
          y: centerY(rect)
        };
      }
      p2 = { x: p2.x - svgRect.left, y: p2.y - svgRect.top };
      const curve = `M ${p1.x} ${p1.y} C ${p1.x} ${centerPointY(
        p1,
        p2
      )} ${centerPointX(p1, p2)} ${p2.y} ${p2.x} ${p2.y}`;
      curves.push(
        <path
          key={`link-${key}`}
          d={curve}
          strokeWidth={style.linkStyle.lineWidth}
          stroke={style.linkStyle.lineColor}
          fill="none"
        />
      );
    });
    this.setState({
      curves
    });
  }

  render() {
    const { topicKey, saveRef } = this.props;
    return (
      <SVG ref={saveRef(linksSvgRefKey(topicKey))}>
        <g>{this.state.curves}</g>
      </SVG>
    );
  }
}
