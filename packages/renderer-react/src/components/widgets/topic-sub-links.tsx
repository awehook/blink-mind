import { LinkStyle, TopicDirection } from '@blink-mind/core';
import React from 'react';
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
    const { model, topic, getRef, topicKey, dir, controller } = props;
    const z = controller.run('getZoomFactor', props);
    const content = getRef(contentRefKey(topicKey));
    const svg = getRef(linksSvgRefKey(topicKey));
    const collapseIcon = getRef(collapseRefKey(topicKey));
    const bigView = getRef(RefKey.DRAG_SCROLL_WIDGET_KEY + model.id).bigView;
    const svgRect = getRelativeRect(svg, bigView, z);
    const collapseRect = getRelativeRect(collapseIcon, bigView, z);
    const contentRect = getRelativeRect(content, bigView, z);
    const mLinkStyle: LinkStyle = controller.run('getLinkStyle', props);
    log(topicKey);
    log('svgRect', svgRect);
    log('collapseRect', collapseRect);
    log('contentRect', contentRect);
    let p1: Point, p2: Point, p3: Point, p4: Point;

    // p2 折叠icon 右侧10个像素
    const marginCollapseIcon = 10;
    let y =
      (mLinkStyle.hasUnderline ? contentRect.bottom : centerY(contentRect)) -
      svgRect.top;
    if (dir === TopicDirection.RIGHT) {
      p1 = {
        x: 0,
        y
      };
      p2 = {
        x: collapseRect.right - svgRect.left + marginCollapseIcon,
        y
      };
    } else if (dir === TopicDirection.LEFT) {
      p1 = {
        x: svgRect.right - svgRect.left,
        y
      };
      p2 = {
        x: collapseRect.left - svgRect.left - marginCollapseIcon,
        y
      };
    }
    const curves = [];

    topic.subKeys.forEach(key => {
      let curve;
      const linkStyle: LinkStyle = controller.run('getLinkStyle', {
        ...props,
        topicKey: key
      });
      // log(key);
      const subContent = getRef(contentRefKey(key));
      if (!subContent) return;
      const rect = getRelativeRect(subContent, bigView, z);

      y = (linkStyle.hasUnderline ? rect.bottom : centerY(rect)) - svgRect.top;
      const x =
        (dir === TopicDirection.RIGHT ? rect.left : rect.right) - svgRect.left;
      p3 = { x, y };

      p4 = linkStyle.hasUnderline
        ? {
            x:
              (dir === TopicDirection.RIGHT ? rect.right : rect.left) -
              svgRect.left +
              (dir === TopicDirection.RIGHT ? 1 : -1),
            y: p3.y
          }
        : p3;

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
        if (
          (!linkStyle.hasUnderline && topic.subKeys.size === 1) ||
          Math.abs(p3.y - p1.y) <= 1
        ) {
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

      curve = `${curve} L ${p4.x} ${p4.y}`;

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
