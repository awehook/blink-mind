import * as React from 'react';
import styled from 'styled-components';
import {
  centerPointX,
  centerPointY,
  centerX,
  centerY,
  getRelativeRect,
  Point,
  RefKey
} from '../../utils';
import { BaseProps, BaseWidget } from '../common';

import debug from 'debug';
import { contentRefKey, linksSvgRefKey } from '../../utils';
const RootLinksSvg = styled.svg`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  pointer-events: none;
`;

const log = debug('node:root-sub-links');

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
    const { model, getRef, topicKey, zoomFactor, controller } = props;
    const topic = model.getTopic(topicKey);
    const content = getRef(contentRefKey(topicKey));
    const svg = getRef(linksSvgRefKey(topicKey));
    const bigView = getRef(RefKey.DRAG_SCROLL_WIDGET_KEY).bigView;
    const contentRect = getRelativeRect(content, bigView, zoomFactor);
    const svgRect = getRelativeRect(svg, bigView, zoomFactor);
    let p1: Point, p2: Point;

    p1 = {
      x: centerX(contentRect) - svgRect.left,
      y: centerY(contentRect) - svgRect.top
    };
    const curves = [];
    topic.subKeys.forEach(key => {
      const linkStyle = controller.run('getLinkStyle', {
        ...props,
        topicKey: key
      });
      const lineType = linkStyle.lineType;
      const subTopicContent = getRef(contentRefKey(key));
      const rect = getRelativeRect(subTopicContent, bigView, zoomFactor);
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
      let curve;
      if (lineType === 'curve') {
        curve = `M ${p1.x} ${p1.y} C ${p1.x} ${centerPointY(
          p1,
          p2
        )} ${centerPointX(p1, p2)} ${p2.y} ${p2.x} ${p2.y}`;
      } else if (lineType === 'line') {
        curve = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
      } else if (lineType === 'round') {
        const vDir = p2.y > p1.y ? 1 : -1;
        const hDir = p2.x > p1.x ? 1 : -1;
        const radius = linkStyle.lineRadius;
        if (radius == null) {
          throw new Error(
            'link line type is round, but lineRadius is not provided!'
          );
        }
        if (p2.y === p1.y) {
          curve = `M ${p1.x} ${p1.y} H ${p2.x}`;
        } else {
          // 0 表示逆时针 1 表示顺时针
          curve = `M ${p1.x} ${p1.y}  V ${p2.y -
            vDir * radius} A ${radius} ${radius} 0 0 ${
            vDir * hDir === 1 ? 0 : 1
          } ${p1.x + radius * hDir} ${p2.y} H ${p2.x}`;
        }
      }
      curves.push(
        <path
          key={`link-${key}`}
          d={curve}
          strokeWidth={linkStyle.lineWidth}
          stroke={linkStyle.lineColor}
          fill="none"
        />
      );
    });
    this.setState({
      curves
    });
  }

  render() {
    log('render');
    const { topicKey, saveRef } = this.props;
    return (
      <RootLinksSvg ref={saveRef(linksSvgRefKey(topicKey))}>
        <g>{this.state.curves}</g>
      </RootLinksSvg>
    );
  }
}
