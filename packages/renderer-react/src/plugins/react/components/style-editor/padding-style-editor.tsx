import * as React from 'react';
import { paddingCss } from '../../../../utils';
import {
  SettingGroup,
  SettingItemNumericInput,
  SettingRow,
  SettingTitle
} from '../right-top-panel';
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
    title: 'top',
    value: top,
    onValueChange: setPadding('top')
  };
  const rightProps = {
    ...commonProps,
    title: 'right',
    value: right,
    onValueChange: setPadding('right')
  };
  const bottomProps = {
    ...commonProps,
    title: 'bottom',
    value: bottom,
    onValueChange: setPadding('bottom')
  };
  const leftProps = {
    ...commonProps,
    title: 'left',
    value: left,
    onValueChange: setPadding('left')
  };
  return (
    <SettingGroup>
      <SettingTitle>Padding</SettingTitle>
      <SettingRow>
        <SettingItemNumericInput {...topProps} />
        <SettingItemNumericInput {...rightProps} />
        <SettingItemNumericInput {...bottomProps} />
        <SettingItemNumericInput {...leftProps} />
      </SettingRow>
    </SettingGroup>
  );
}
