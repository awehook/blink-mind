import { ModelModifier } from '@blink-mind/core';
import {
  Breadcrumb,
  Breadcrumbs,
  IBreadcrumbProps,
  Tooltip
} from '@blueprintjs/core';
import * as React from 'react';
import styled from 'styled-components';
import { BaseWidget } from '../../../components/common';

const EditorRootBreadcrumbsRoot = styled.div`
  position: absolute;
  width: 20%;
  padding: 0 5px;
  background: white;
  left: 30px;
  top: 20px;
  border-radius: 2px;
  z-index: 4;
`;

const BreadcrumbTitle = styled.span``;

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

  breadcrumbRenderer = props => {
    const { text, ...breadProps } = props;
    const title = text.length > 8 ? text.substr(0, 8) + '...' : text;
    return (
      <li>
        <Tooltip content={text}>
          <Breadcrumb {...breadProps}>
            <BreadcrumbTitle>{title}</BreadcrumbTitle>
          </Breadcrumb>
        </Tooltip>
      </li>
    );
  };

  render() {
    const props = this.props;
    const { model, controller } = props;
    const editingRootKey = model.editorRootTopicKey;
    if (editingRootKey === model.rootTopicKey) return null;

    const items = [];
    let topic = model.getTopic(editingRootKey);
    while (topic != null) {
      const title = controller.run('getTopicTitle', {
        ...props,
        topicKey: topic.key
      });
      items.unshift({
        text: title,
        onClick: this.setEditorRootTopicKey(topic.key)
      });
      topic = model.getTopic(topic.parentKey);
    }
    const breadcrumbProps = {
      items,
      breadcrumbRenderer: this.breadcrumbRenderer
    };
    return (
      <EditorRootBreadcrumbsRoot>
        <Breadcrumbs {...breadcrumbProps} />
      </EditorRootBreadcrumbsRoot>
    );
  }
}
