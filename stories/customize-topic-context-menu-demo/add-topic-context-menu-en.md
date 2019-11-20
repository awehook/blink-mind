### Add topic context menus to default 📧context menus by writing a plugin.

The following example demonstrates adding a menu item. Clicking on the menu pops up the key and style of the current topic.

```jsx
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
```
