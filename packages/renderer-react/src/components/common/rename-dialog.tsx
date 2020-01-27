import { AnchorButton, Button, Classes, Dialog } from '@blueprintjs/core';
import { useState } from 'react';
import * as React from 'react';
import { getI18nText, I18nKey } from '../../utils';
export function RenameDialog(props) {
  const { handleConfirm, handleClose, isOpen } = props;
  const [title, setTitle] = useState(props.title);
  const onChange = e => {
    setTitle(e.target.value);
  };
  return (
    <Dialog
      title={getI18nText(props, I18nKey.RENAME)}
      onClose={handleClose}
      isOpen={isOpen}
    >
      <div className={Classes.DIALOG_BODY}>
        <input
          className="bp3-input .modifier"
          type="text"
          value={title}
          onChange={onChange}
          placeholder="Text input"
          dir="auto"
        />
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={handleClose}>
            {getI18nText(props, I18nKey.CANCEL)}
          </Button>
          <AnchorButton onClick={handleConfirm(title)}>
            {getI18nText(props, I18nKey.CONFIRM)}
          </AnchorButton>
        </div>
      </div>
    </Dialog>
  );
}
