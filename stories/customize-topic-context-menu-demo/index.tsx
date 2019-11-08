import * as React from 'react';
import { Diagram } from '@blink-mind/renderer-react';
import { BaseDemo } from '../common/base-demo';
import { MenuItem, MenuDivider } from '@blueprintjs/core';

function CustomizeTopicContextMenuPlugin() {
  return {
    customizeTopicContextMenu(props) {
      function onClickMyMenu() {
        const {topicKey} = props;
        alert(`this topic key is ${topicKey}`);
      }
      return (
        <>
          <MenuDivider />
          <MenuItem icon="group-objects" text="my customize menu"  onClick={onClickMyMenu}/>
        </>
      );
    }
  };
}
const plugins = [CustomizeTopicContextMenuPlugin()];
export class CustomizeTopicContextMenuDemo extends BaseDemo {
  renderDiagram() {
    return (
      <Diagram
        model={this.state.model}
        onChange={this.onChange}
        plugins={plugins}
      />
    );
  }
}
