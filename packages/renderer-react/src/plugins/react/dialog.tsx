import React from 'react';
import { DialogWidget } from '../../components/widgets';

export function DialogPlugin() {
  return {
    renderDialog(ctx) {
      const { controller } = ctx;
      const dialog = controller.run('customizeDialog', ctx);
      if (dialog == null) return null;
      const { dialogContent, dialogProps } = dialog;
      const props = {
        ...ctx,
        dialogContent,
        dialogProps
      };
      return <DialogWidget key="dialog" {...props} />;
    },

    customizeDialog(ctx) {
      return null;
    }
  };
}
