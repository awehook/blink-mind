import * as React from 'react';
import { Diagram, OpType } from '@blink-mind/renderer-react';
import { BaseDemo } from '../common/base-demo';
import { MenuItem, MenuDivider } from '@blueprintjs/core';
import { storiesOf } from '@storybook/react';
//@ts-ignore
import addTopicContextMenuMd from './add-topic-context-menu.md';
//@ts-ignore
import changeDefaultTopicContextMenuMd from './change-default-topic-context-menu.md';

function onClickMyMenu(props) {
  return function() {
    const { topicKey, controller, model } = props;
    alert(`this topic key is ${topicKey}`);
    const topicStyle = controller.run('getTopicStyle', props);
    alert(`this topic style is ${JSON.stringify(topicStyle)}`);
  };
}

function HotKeyPlugin() {
  return {
    customizeHotKeys(props, next) {
      const hotKeysMap = next();
      hotKeysMap.set('MY_CUSTOM', {
        label: 'MY_CUSTOM',
        combo: 'shift + a',
        onKeyDown: e => {
          onClickMyMenu(props)();
        }
      });
      return hotKeysMap;
    }
  };
}

function AddTopicContextMenuPlugin() {
  return {
    customizeTopicContextMenu(props, next) {
      return (
        <>
          {next()}
          <MenuDivider />
          <MenuItem
            icon="group-objects"
            label="Shift + A"
            text="my customize menu"
            onClick={onClickMyMenu(props)}
          />
        </>
      );
    }
  };
}
const plugins = [AddTopicContextMenuPlugin(), HotKeyPlugin()];
export class AddTopicContextMenuDemo extends BaseDemo {
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

function ChangeDefaultTopicContextMenuPlugin() {
  return {
    customizeTopicContextMenu(props, next) {
      let defaultMenus = next();
      console.log(defaultMenus);
      defaultMenus.splice(0, 1);
      console.log(defaultMenus);
      defaultMenus.splice(
        1,
        0,
        <MenuItem
          icon="group-objects"
          label="Shift + A"
          text="my customize menu"
          onClick={onClickMyMenu(props)}
        />
      );
      console.log(defaultMenus);
      return <>{defaultMenus}</>;
    }
  };
}

const changeDefaultContextMenuPlugins = [
  ChangeDefaultTopicContextMenuPlugin(),
  HotKeyPlugin()
];
export class ChangeDefaultTopicContextMenuDemo extends BaseDemo {
  renderDiagram() {
    return (
      <Diagram
        model={this.state.model}
        onChange={this.onChange}
        plugins={changeDefaultContextMenuPlugins}
      />
    );
  }
}

storiesOf('customize-topic-context-menu-demo', module)
  .add('add-topic-context-menu', () => <AddTopicContextMenuDemo />, {
    readme: { sidebar: addTopicContextMenuMd }
  })
  .add(
    'change-default-context-menu',
    () => <ChangeDefaultTopicContextMenuDemo />,
    {
      readme: {
        sidebar: changeDefaultTopicContextMenuMd
      }
    }
  );
