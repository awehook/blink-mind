import { Classes, Dialog } from '@blueprintjs/core';
import { ReactElement } from 'react';
import * as React from 'react';
import { BaseProps } from '../common';

export interface DialogProps {
  name?: string;
  title?: any;
  style?: any;
  onClose?: (event?: React.SyntheticEvent<HTMLElement>) => void;
}

interface Props extends BaseProps {
  dialogContent: ReactElement;
  dialogProps: DialogProps;
}

export function DialogWidget(props: Props) {
  const { dialogContent, dialogProps } = props;

  const _dialogProps = {
    isOpen: dialogContent != null,
    autoFocus: true,
    enforceFocus: true,
    usePortal: true,
    ...dialogProps
  };
  return (
    <Dialog {..._dialogProps}>
      <div className={Classes.DIALOG_BODY} style={{ minHeight: 0 }}>
        {dialogContent}
      </div>
    </Dialog>
  );
}
