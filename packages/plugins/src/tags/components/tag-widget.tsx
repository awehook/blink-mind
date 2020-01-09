import { BaseProps } from '@blink-mind/renderer-react';
import { ContextMenuTarget, Divider, Menu } from '@blueprintjs/core';
import * as React from 'react';
import { TagRecord } from '../ext-data-tags';
import { StyledTag } from './styled';
import { TagTopicList } from './tag-topic-list';
import { UpdateTagWidget } from './update-tag-widget';

export interface TagWidgetProps extends BaseProps {
  isTopicTag?: boolean;
  tag: TagRecord;
  large?: boolean;
  onClick?: (tag: TagRecord) => (e) => void;
  onRemove?: (tag: TagRecord) => (e) => void;
}
@ContextMenuTarget
export class TagWidget extends React.PureComponent<TagWidgetProps> {
  constructor(props) {
    super(props);
  }
  public renderContextMenu() {
    const props = this.props;
    return props.isTopicTag ? null : (
      <Menu>
        <UpdateTagWidget {...props} />
        <Divider />
        <TagTopicList {...props} />
      </Menu>
    );
  }

  onClickUpdateTag = e => {};

  render() {
    const { tag, large = true, onRemove, onClick } = this.props;

    const tagProps = {
      key: tag.name,
      style: JSON.parse(tag.style),
      onClick: onClick ? onClick(tag) : null,
      onRemove: onRemove ? onRemove(tag) : null,
      interactive: true,
      large
    };
    return (
      <span>
        <StyledTag {...tagProps}>{tag.name}</StyledTag>
      </span>
    );
  }
}
