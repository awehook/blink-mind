import { FocusMode } from '@blink-mind/core';
import * as React from 'react';
import styled from 'styled-components';
import { contentRefKey, getRelativeRect, RefKey } from '../../utils';
import { BaseProps, BaseWidget } from '../common';

const FocusHighlightSvg = styled.svg`
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

export class TopicHighlight extends BaseWidget<BaseProps, State> {
  state = {
    content: null
  };

  layout() {
    const { getRef, model, zoomFactor } = this.props;
    const focusKey = model.focusKey;
    const focusMode = model.focusMode;
    if (!focusKey || focusMode === FocusMode.EDITING_CONTENT) {
      this.setState({
        content: null
      });
      return;
    }
    const content = getRef(contentRefKey(focusKey));
    const bigView = getRef(RefKey.DRAG_SCROLL_WIDGET_KEY).bigView;
    const svg = getRef(RefKey.SVG_HIGHLIGHT_KEY);
    const contentRect = getRelativeRect(content, bigView, zoomFactor);
    const svgRect = getRelativeRect(svg, bigView, zoomFactor);
    const padding = 3;
    const x = contentRect.left - svgRect.left - padding;
    const y = contentRect.top - svgRect.top - padding;
    const width = contentRect.width + 2 * padding;
    const height = contentRect.height + 2 * padding;
    this.setState({
      content: (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="none"
          stroke={model.config.theme.highlightColor}
          strokeWidth={2}
        />
      )
    });
  }

  render() {
    const { saveRef } = this.props;
    return (
      <FocusHighlightSvg ref={saveRef(RefKey.SVG_HIGHLIGHT_KEY)}>
        {this.state.content}
      </FocusHighlightSvg>
    );
  }
}
