import * as React from 'react';
import { Menu } from '@blueprintjs/core';
import { BaseWidget } from '../../../components/common';

export class TopicContextMenu extends BaseWidget {
  render() {
    const { controller } = this.props;
    return (
      <Menu>{controller.run('customizeTopicContextMenu', this.props)}</Menu>
    );
  }
}
