import { TopicDirection } from '@blink-mind/core';
import React from 'react';
import styled, { css } from 'styled-components';
import { collapseRefKey, iconClassName } from '../../utils';

const Icon = styled.div`
  position: absolute;
  top: ${props =>
    props.hasUnderline ? 'calc(100% - 8px)' : 'calc(50% - 8px)'};
  ${({ dir }) => {
    if (dir === TopicDirection.RIGHT)
      return css`
        right: -25px;
      `;
    if (dir === TopicDirection.LEFT)
      return css`
        left: -25px;
      `;
  }};
  border-radius: 50%;
  width: 16px;
  height: 16px;
  text-align: center;
  box-shadow: 0 1px 2px rgba(0,0,0,0.3);
  //@ts-ignore
  //background: ${props => props.background};
  background: #fff;
  color: #888;
  cursor: pointer;
  padding: 0;
  //font-size: 16px !important;
  line-height: 16px;
  border: 0;
  z-index: 2;
  
  &:before {
    transform: scale(0.8, 0.8);
  }
`;

export function TopicCollapseIcon(props) {
  const { topic, topicKey, dir, saveRef, onClickCollapse, linkStyle } = props;
  const hasUnderline = linkStyle.hasUnderline;
  return topic.subKeys.size > 0 ? (
    <Icon
      ref={saveRef(collapseRefKey(topicKey))}
      onClick={onClickCollapse}
      // background={topicStyle.background}
      dir={dir}
      hasUnderline={hasUnderline}
      className={iconClassName(topic.collapse ? 'plus' : 'minus')}
    />
  ) : null;
}
