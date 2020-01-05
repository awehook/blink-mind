import { StyledCheckbox } from '@blink-mind/renderer-react';
import * as React from 'react';
// useState 在vscode 运行报错 https://reactjs.org/docs/error-decoder.html/?invariant=321，
// 问题原因，在yarn link package的时候，webpack 会打包进去多个 react-dom.js
import { useState } from 'react';
export function TopicReferenceCheckbox(props) {
  const { topicKey, selectedTopicKeys } = props;
  const a = selectedTopicKeys.has(topicKey);
  const [checked, setChecked] = useState(a);
  const checkboxProps = {
    checked,
    onChange: () => {
      if (selectedTopicKeys.has(topicKey)) {
        selectedTopicKeys.delete(topicKey);
      } else {
        selectedTopicKeys.add(topicKey);
      }
      setChecked(!checked);
    }
  };
  return <StyledCheckbox {...checkboxProps} />;
}
