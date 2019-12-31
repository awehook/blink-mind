import * as React from 'react';
import {useState} from "react";
import {Checkbox} from "@blueprintjs/core";

export function TopicReferenceCheckbox(props) {
  const { topicKey, selectedTopicKeys } = props;
  const [checked, setChecked] = useState(selectedTopicKeys.has(topicKey));
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
  return <Checkbox {...checkboxProps}></Checkbox>;
}
