import { TopicDirection } from '@blink-mind/core';
import * as React from 'react';
import styled from 'styled-components';
import {
  centerPointX,
  centerPointY,
  centerY,
  collapseRefKey,
  contentRefKey,
  getRelativeRect,
  linksSvgRefKey,
  Point,
  RefKey
} from '../../utils';
import { BaseProps, BaseWidget } from '../common';

const TopicLinksSvg = styled.svg`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  pointer-events: none;
`;
import debug from 'debug';
const log = debug('node:topic-sub-links');

interface Props extends BaseProps {}

interface State {
  curves: any[];
}

export class TopicSubLinks extends BaseWidget<Props, State> {
  state = {
    curves: []
  };
  layout() {
    const props = this.props;
    const { model, getRef, topicKey, dir, controller } = props;
    const z = controller.run('getZoomFactor', props);
    const topic = model.getTopic(topicKey);
    const content = getRef(contentRefKey(topicKey));
    const svg = getRef(linksSvgRefKey(topicKey));
    const collapseIcon = getRef(collapseRefKey(topicKey));
    const bigView = getRef(RefKey.DRAG_SCROLL_WIDGET_KEY).bigView;
    const svgRect = getRelativeRect(svg, bigView, z);
    const collapseRect = getRelativeRect(collapseIcon, bigView, z);
    const contentRect = getRelativeRect(content, bigView, z);
    log(topicKey);
    log('svgRect', svgRect);
    log('collapseRect', collapseRect);
    log('contentRect', contentRect);
    let p1: Point, p2: Point, p3: Point;

    if (dir === TopicDirection.RIGHT) {
      p1 = {
        x: 0,
        y: centerY(contentRect) - svgRect.top
      };
      p2 = {
        x: collapseRect.right - svgRect.left + 10,
        y: p1.y
      };
    } else if (dir === TopicDirection.LEFT) {
      p1 = {
        x: svgRect.right - svgRect.left,
        y: centerY(contentRect) - svgRect.top
      };
      p2 = {
        x: collapseRect.left - svgRect.left - 10,
        y: p1.y
      };
    }
    const curves = [];

    topic.subKeys.forEach(key => {
      let curve;
      const linkStyle = controller.run('getLinkStyle', {
        ...props,
        topicKey: key
      });
      // log(key);
      const subContent = getRef(contentRefKey(key));
      if (!subContent) return;
      const rect = getRelativeRect(subContent, bigView, z);

      if (dir === TopicDirection.RIGHT) {
        p3 = {
          x: rect.left - svgRect.left,
          y: centerY(rect) - svgRect.top
        };
      }
      if (dir === TopicDirection.LEFT) {
        p3 = {
          x: rect.right - svgRect.left,
          y: centerY(rect) - svgRect.top
        };
      }
      const { lineType } = linkStyle;

      if (lineType === 'curve') {
        curve = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} C ${p2.x} ${centerPointY(
          p2,
          p3
        )} ${centerPointX(p2, p3)} ${p3.y} ${p3.x} ${p3.y}`;
      } else if (lineType === 'round') {
        const vDir = p3.y > p1.y ? 1 : -1;
        const hDir = p3.x > p1.x ? 1 : -1;
        const radius = linkStyle.lineRadius;
        // if (p3.y === p1.y) { //这样判断不可靠
        if (topic.subKeys.size === 1 || Math.abs(p3.y - p1.y) <= 1) {
          curve = `M ${p1.x} ${p1.y} L ${p3.x} ${p3.y}`;
        } else {
          // 0 表示逆时针 1 表示顺时针
          curve = `M ${p1.x} ${p1.y} H ${p2.x} V ${p3.y -
            vDir * radius} A ${radius} ${radius} 0 0 ${
            vDir * hDir === 1 ? 0 : 1
          } ${p2.x + radius * hDir} ${p3.y} H ${p3.x}`;
        }
      } else if (lineType === 'line') {
        curve = `M ${p1.x} ${p1.y} H ${p2.x} L ${p3.x} ${p3.y}`;
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
    const { topicKey, saveRef } = this.props;
    return (
      <TopicLinksSvg ref={saveRef(linksSvgRefKey(topicKey))}>
        <g>{this.state.curves}</g>
      </TopicLinksSvg>
    );
  }
}
