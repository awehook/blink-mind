import { ModelModifier } from '@blink-mind/core';
import { Breadcrumbs } from '@blueprintjs/core';
import * as React from 'react';
import styled from 'styled-components';
import { BaseWidget } from '../../../components';

const EditorRootBreadcrumbsRoot = styled.div`
  position: absolute;
  padding: 0 5px;
  background: white;
  left: 30px;
  top: 20px;
  border-radius: 2px;
  z-index: 4;
`;

export class EditorRootBreadcrumbs extends BaseWidget {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }

  setEditorRootTopicKey = topicKey => () => {
    const { model, controller } = this.props;
    if (model.editorRootTopicKey !== topicKey) {
      controller.change(
        ModelModifier.setEditorRootTopicKey({
          model,
          topicKey
        })
      );
    }
  };

  render() {
    const props = this.props;
    const { model, controller } = props;
    const editingRootKey = model.editorRootTopicKey;
    if (editingRootKey === model.rootTopicKey) return null;

    const items = [];
    let topic = model.getTopic(editingRootKey);
    while (topic != null) {
      items.unshift({
        text: controller.run('getTopicTitle', {
          ...props,
          topicKey: topic.key
        }),
        onClick: this.setEditorRootTopicKey(topic.key)
      });
      topic = model.getTopic(topic.parentKey);
    }
    const breadcrumbProps = {
      items
    };
    return (
      <EditorRootBreadcrumbsRoot>
        <Breadcrumbs {...breadcrumbProps} />
      </EditorRootBreadcrumbsRoot>
    );
  }
}
