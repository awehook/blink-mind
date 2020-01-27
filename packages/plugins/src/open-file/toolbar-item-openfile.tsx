import {
  browserOpenFile,
  iconClassName,
  IconName,
  ToolbarItem
} from '@blink-mind/renderer-react';
import * as React from 'react';
export function ToolbarItemOpenFile(props) {
  const onClickOpenFile = () => {
    const { controller } = props;
    browserOpenFile('.json,.blinkmind,.bm').then(txt => {
      const obj = JSON.parse(txt);
      const newDocModel = controller.run('deserializeDocModel', { controller, obj });
      controller.run('openNewDocModel', { ...props, newDocModel });
    });
  };

  return (
    <ToolbarItem
      className={iconClassName(IconName.OPEN_FILE)}
      onClick={onClickOpenFile}
      {...props}
    />
  );
}
