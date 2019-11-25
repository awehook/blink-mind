import debug from 'debug';
import * as React from 'react';
import styled from 'styled-components';
import { BaseProps } from '../../../components/base-props';
import { BaseWidget } from '../../../components/common';
import { contentRefKey } from '../../../utils';
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
    const { getRef, model, controller } = this.props;
    const targetProps = controller.run('getDragTargetProps', props);
    const { key, dropDir } = targetProps;
    log('layout', dropDir);

    if (key === null) {
      this.setState({
        content: null
      });
      return;
    }
    let dropAreaRefKey;
    if (dropDir === 'in') {
      dropAreaRefKey = contentRefKey(key);
    } else {
      dropAreaRefKey = `dropArea-${dropDir}-${key}`;
    }
    const contentRect = getRef(dropAreaRefKey).getBoundingClientRect();
    const svgRect = getRef('svg-drop-effect').getBoundingClientRect();
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
