import {
  browserDownloadFile,
  iconClassName,
  IconName,
  ToolbarItem
} from '@blink-mind/renderer-react';
import { Dialog, Menu, MenuDivider, MenuItem } from '@blueprintjs/core';
import * as React from 'react';
import { useState } from 'react';

export function ToolbarItemExport(props) {
  const [showDialog, setShowDialog] = useState(false);
  const onClickExport = () => {
    const { controller } = props;
    const json = controller.run('serializeModel', props);
    const jsonStr = JSON.stringify(json, null, 2);
    const url = `data:text/plain,${encodeURIComponent(jsonStr)}`;
    browserDownloadFile(url, 'example.json');
    setShowDialog(false);
  };
  return (
    <>
      <ToolbarItem
        className={iconClassName(IconName.EXPORT)}
        onClick={() => setShowDialog(true)}
      ></ToolbarItem>
      <Dialog
        onClose={() => {
          setShowDialog(false);
        }}
        isOpen={showDialog}
        autoFocus
        enforceFocus
        usePortal
        title="Please select export file format"
      >
        <Menu>
          <MenuItem text="JSON(.json)" onClick={onClickExport} />
          <MenuDivider />
        </Menu>
      </Dialog>
    </>
  );
}
