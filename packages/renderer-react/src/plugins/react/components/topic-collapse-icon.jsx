import * as React from 'react';
import styled from 'styled-components';

const Icon = styled.div`
  position: relative;
  top: -8px;
  left: 5px;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  text-align: center;
  background: ${props => props.background};
  cursor: pointer;
  padding: 0;
  font-size: 14px;
  line-height: 20px;
  border: 0;
`;

export function TopicCollapseIcon(props) {
  const { model, topicKey, topicStyle } = props;
  const topic = model.getTopic(topicKey);
  return topic.subKeys.size > 0 ? (
    <Icon background={topicStyle.background} />
  ) : null;
}
