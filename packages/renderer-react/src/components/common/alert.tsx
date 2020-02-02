import { Alert as BpAlert } from '@blueprintjs/core';
import * as React from 'react';
import { getI18nText, I18nKey } from '../../utils';

export function Alert(props) {
  const { content, onClose: _onClose, onCancel, ...rest } = props;
  const onClose = _onClose || onCancel;
  const alertProps = {
    cancelButtonText: getI18nText(props, I18nKey.CANCEL),
    confirmButtonText: getI18nText(props, I18nKey.CONFIRM),
    canEscapeKeyCancel: true,
    ...rest,
    onClose,
    onCancel
  };
  return (
    <BpAlert {...alertProps}>
      <p>{content}</p>
    </BpAlert>
  );
}
