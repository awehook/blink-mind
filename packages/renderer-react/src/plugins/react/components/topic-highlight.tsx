import * as React from 'react';
import styled from 'styled-components';
import { BaseWidget } from '../../../components/common';
import { contentRefKey } from '../../../utils';
import { BaseProps } from '../../../components/base-props';
import { FocusMode } from '@blink-mind/core';

const SVG = styled.svg`
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
    const { getRef, model } = this.props;
    const focusKey = model.focusKey;
    const focusMode = model.focusMode;
    if (!focusKey || focusMode === FocusMode.EDITING_CONTENT) {
      this.setState({
        content: null
      });
      return;
    }
    const contentRect = getRef(contentRefKey(focusKey)).getBoundingClientRect();
    const svgRect = getRef('svg-highlight').getBoundingClientRect();
    let padding = 3;
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
    return <SVG ref={saveRef('svg-highlight')}>{this.state.content}</SVG>;
  }
}
