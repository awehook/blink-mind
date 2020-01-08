import * as React from 'react';
import { Toolbar, ToolbarItemLayout } from '../../components/widgets/toolbar';

import { ToolbarItemConfigs } from '../../types';

export function ToolbarPlugin() {
  return {
    renderToolbar(props) {
      return <Toolbar {...props} />;
    },

    renderToolbarItems(props) {
      const { controller } = props;
      const itemConfigs: ToolbarItemConfigs = controller.run(
        'customizeToolbar',
        props
      );
      //TODO 这里要判断 order不重复
      itemConfigs.sort((a, b) => a.order - b.order);

      return itemConfigs.map(item =>
        React.createElement(item.element, {
          ...props,
          key: item.order.toString()
        })
      );
    },

    customizeToolbar(props): ToolbarItemConfigs {
      return [
        {
          order: 100,
          element: ToolbarItemLayout
        }
      ];
    }
  };
}
