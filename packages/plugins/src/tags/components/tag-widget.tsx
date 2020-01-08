import * as React from 'react';
import { TagRecord } from '../ext-data-tags';
import { StyledTag } from './styled';

export interface TagWidgetProps {
  tag: TagRecord;
  onClick?: (tag: TagRecord) => (e) => void;
  onRemove?: (tag: TagRecord) => (e) => void;
}

export function TagWidget(props: TagWidgetProps) {
  const { tag, onRemove, onClick } = props;

  const tagProps = {
    key: tag.name,
    style: JSON.parse(tag.style),
    onClick: onClick ? onClick(tag) : null,
    onRemove: onRemove ? onRemove(tag) : null,
    interactive: true,
    large: true
  };
  return <StyledTag {...tagProps}>{tag.name}</StyledTag>;
}
