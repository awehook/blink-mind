import * as React from 'react';
import { BaseProps } from '../../common';

export function Toolbar(props: BaseProps) {
  const { controller } = props;
  return (
    <div className="bm-toolbar">
      {controller.run('renderToolbarItems', props)}
    </div>
  );
}
