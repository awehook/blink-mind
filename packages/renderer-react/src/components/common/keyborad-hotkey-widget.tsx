import React from 'react';
import { isOSX } from '../../utils';

interface Props {
  hotkeys: string[];
}
const HotKeyChar = {
  Mod: isOSX ? '⌘' : 'Ctrl',
  Shift: isOSX ? '⇧' : 'Shift',
  Alt: isOSX ? '⌥' : 'Alt'
};
export function KeyboardHotKeyWidget(props: Props) {
  const { hotkeys } = props;
  if (hotkeys == null) return null;
  const res = [];
  for (let i = 0; i < hotkeys.length; i++) {
    const hotkey = hotkeys[i];
    res.push(<kbd key={i}>{HotKeyChar[hotkey] || hotkey}</kbd>);
  }
  return <div>{res}</div>;
}
