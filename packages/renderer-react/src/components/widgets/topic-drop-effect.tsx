import debug from 'debug';
import * as React from 'react';
import styled from 'styled-components';
import {
  contentRefKey,
  dropAreaRefKey,
  getRelativeRect,
  RefKey
} from '../../utils';
import { BaseProps, BaseWidget } from '../common';
const log = debug('node:topic-drop-effect');

const DropEffectSvg = styled.svg`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  pointer-events: none;
`;

interface State {
  content: any;
}

export class TopicDropEffect extends BaseWidget<BaseProps, State> {
  state = {
    content: null
  };

  layout() {
    const props = this.props;
    const { getRef, model, zoomFactor, diagramState } = props;
    const dragDrop = diagramState.dragDrop;
    if (dragDrop == null) {
      this.setState({
        content: null
      });
      return;
    }
    const { targetKey, targetDir } = dragDrop;
    log('layout', targetDir);

    if (targetKey == null) {
      this.setState({
        content: null
      });
      return;
    }
    let refKey;
    if (targetDir === 'in') {
      refKey = contentRefKey(targetKey);
    } else {
      refKey = dropAreaRefKey(targetKey, targetDir);
    }
    const content = getRef(refKey);
    const svg = getRef('svg-drop-effect');
    const bigView = getRef(RefKey.DRAG_SCROLL_WIDGET_KEY).bigView;
    const contentRect = getRelativeRect(content, bigView, zoomFactor);
    const svgRect = getRelativeRect(svg, bigView, zoomFactor);
    const padding = 3;
    const x = contentRect.left - svgRect.left - padding;
    const y = contentRect.top - svgRect.top - padding;
    const width = contentRect.width + 2 * padding;
    const height = contentRect.height + 2 * padding;

    this.setState({
      content: (
        <g>
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            fill="none"
            stroke={model.config.theme.highlightColor}
            strokeDasharray="5,5"
            strokeWidth={2}
          />
        </g>
      )
    });
  }

  render() {
    const { saveRef } = this.props;
    return (
      <DropEffectSvg ref={saveRef('svg-drop-effect')}>
        {this.state.content}
      </DropEffectSvg>
    );
  }
}
