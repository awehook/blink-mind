import * as React from 'react';
import { getI18nText, I18nKey, paddingCss } from '../../../utils';
import {
  SettingGroup,
  SettingItemNumericInput,
  SettingRow,
  SettingTitle
} from '../../common';
import { ContentStyleEditorProps } from './types';

const expand = require('css-shorthand-expand');

export function PaddingStyleEditor(props: ContentStyleEditorProps) {
  const { contentStyle, setContentStyle } = props;
  const padding = expand('padding', contentStyle.padding || '0');
  const commonProps = {
    layout: 'v',
    min: 0,
    max: 99,
    style: {
      width: 38
    }
  };
  const top = parseInt(padding['padding-top']);
  const right = parseInt(padding['padding-right']);
  const bottom = parseInt(padding['padding-bottom']);
  const left = parseInt(padding['padding-left']);
  const p = {
    top,
    right,
    bottom,
    left
  };

  const setPadding = dir => v => {
    setContentStyle({ padding: paddingCss({ ...p, [dir]: v }) });
  };
  const topProps = {
    ...commonProps,
    title: getI18nText(props,I18nKey.TOP),
    value: top,
    onValueChange: setPadding('top')
  };
  const rightProps = {
    ...commonProps,
    title: getI18nText(props,I18nKey.RIGHT),
    value: right,
    onValueChange: setPadding('right')
  };
  const bottomProps = {
    ...commonProps,
    title: getI18nText(props,I18nKey.BOTTOM),
    value: bottom,
    onValueChange: setPadding('bottom')
  };
  const leftProps = {
    ...commonProps,
    title: getI18nText(props,I18nKey.LEFT),
    value: left,
    onValueChange: setPadding('left')
  };
  return (
    <SettingGroup>
      <SettingTitle>{getI18nText(props, I18nKey.PADDING)}</SettingTitle>
      <SettingRow>
        <SettingItemNumericInput {...topProps} />
        <SettingItemNumericInput {...rightProps} />
        <SettingItemNumericInput {...bottomProps} />
        <SettingItemNumericInput {...leftProps} />
      </SettingRow>
    </SettingGroup>
  );
}
