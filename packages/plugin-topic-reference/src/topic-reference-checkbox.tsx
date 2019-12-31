import { KeyType } from '@blink-mind/core';
import { BaseProps } from '@blink-mind/renderer-react';
import { Checkbox } from '@blueprintjs/core';
import * as React from 'react';
// TODO useState 在vscode 运行报错 https://reactjs.org/docs/error-decoder.html/?invariant=321，暂时不知道如何解决
// import { useState } from 'react';
// export function TopicReferenceCheckbox(props) {
//   const { topicKey, selectedTopicKeys } = props;
//   const a = selectedTopicKeys.has(topicKey);
//   const [checked, setChecked] = useState(a);
//   const checkboxProps = {
//     checked,
//     onChange: () => {
//       if (selectedTopicKeys.has(topicKey)) {
//         selectedTopicKeys.delete(topicKey);
//       } else {
//         selectedTopicKeys.add(topicKey);
//       }
//       setChecked(!checked);
//     }
//   };
//   return <Checkbox {...checkboxProps}></Checkbox>;
// }

interface Props extends BaseProps {
  selectedTopicKeys: Set<KeyType>;
}

interface State {
  checked: boolean;
}

export class TopicReferenceCheckbox extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    const { topicKey, selectedTopicKeys } = props;
    this.state = {
      checked: selectedTopicKeys.has(topicKey)
    };
  }
  render() {
    const { selectedTopicKeys, topicKey } = this.props;

    const checkboxProps = {
      checked: this.state.checked,
      onChange: () => {
        if (selectedTopicKeys.has(topicKey)) {
          selectedTopicKeys.delete(topicKey);
        } else {
          selectedTopicKeys.add(topicKey);
        }
        this.setState({ checked: !this.state.checked });
      }
    };
    return <Checkbox {...checkboxProps}></Checkbox>;
  }
}
