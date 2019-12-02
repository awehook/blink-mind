import * as React from 'react';
import { Diagram } from '@blink-mind/renderer-react';
import { BaseDemo } from '../common/base-demo';
import { MenuItem, MenuDivider } from '@blueprintjs/core';
import { storiesOf } from '@storybook/react';
import * as marked from 'marked';
//@ts-ignore
import addTopicContextMenuMdEn from './add-topic-context-menu-en.md';
//@ts-ignore
import addTopicContextMenuMdZh from './add-topic-context-menu-zh.md';
//@ts-ignore
import changeDefaultTopicContextMenuMdZh from './change-default-topic-context-menu-zh.md';
//@ts-ignore
import changeDefaultTopicContextMenuMdEn from './change-default-topic-context-menu-en.md';

function onClickMyMenu(props) {
  return function() {
    const { topicKey, controller, model } = props;
    alert(`this topic key is ${topicKey}`);
    const topicStyle = controller.run('getTopicContentStyle', props);
    alert(`this topic content style is ${JSON.stringify(topicStyle)}`);
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
      defaultMenus.splice(0, 1);
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
    notes: {
      markdown: {
        en: addTopicContextMenuMdEn,
        zh: addTopicContextMenuMdZh
      }
    }
  })
  .add(
    'change-default-context-menu',
    () => <ChangeDefaultTopicContextMenuDemo />,
    {
      notes: {
        markdown: {
          en: changeDefaultTopicContextMenuMdEn,
          zh: changeDefaultTopicContextMenuMdZh
        }
      }
    }
  );
