import { Classes, Dialog } from '@blueprintjs/core';
import { ReactElement } from 'react';
import * as React from 'react';
import { BaseProps } from '../common';

export interface ActiveDialogContent {
  props: ActiveDialogProps;
  content: ReactElement;
}

export interface ActiveDialogProps {
  name: string;
  title: any;
  style: any;
  onClose: (event?: React.SyntheticEvent<HTMLElement>) => void;
}

interface Props extends BaseProps {
  content: ActiveDialogContent;
}

export function DialogWidget(props: Props) {
  const { content } = props;

  const dialogProps = {
    isOpen: content != null,
    autoFocus: true,
    enforceFocus: true,
    usePortal: true,
    ...content.props
  };
  return (
    <Dialog {...dialogProps}>
      <div className={Classes.DIALOG_BODY} style={{ minHeight: 0 }}>
        {content}
      </div>
    </Dialog>
  );
}
