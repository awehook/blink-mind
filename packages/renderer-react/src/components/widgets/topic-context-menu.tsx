import { Menu } from '@blueprintjs/core';
import * as React from 'react';
import { BaseWidget } from '../common';

export class TopicContextMenu extends BaseWidget {
  render() {
    const { controller } = this.props;
    return (
      <Menu>{controller.run('customizeTopicContextMenu', this.props)}</Menu>
    );
  }
}
