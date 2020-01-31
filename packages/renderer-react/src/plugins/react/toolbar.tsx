import * as React from 'react';
import {
  Toolbar,
  ToolbarItemAddCanvas,
  ToolbarItemLayout,
  ToolbarItemMore
} from '../../components/widgets';

import { ElementItemConfigs } from '../../types';

export function ToolbarPlugin() {
  return {
    renderToolbar(props) {
      return <Toolbar {...props} />;
    },

    renderToolbarItems(props) {
      const { controller } = props;
      const itemConfigs: ElementItemConfigs = controller.run(
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

    customizeToolbar(props): ElementItemConfigs {
      return [
        {
          order: 0,
          element: ToolbarItemMore
        },
        {
          order: 100,
          element: ToolbarItemLayout
        }
      ];
    },

    customizeToolbarItemMore(props): ElementItemConfigs {
      return [
        {
          order: 10,
          element: ToolbarItemAddCanvas
        }
      ];
    }
  };
}
