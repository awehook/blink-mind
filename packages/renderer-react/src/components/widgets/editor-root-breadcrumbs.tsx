import { OpType } from '@blink-mind/core';
import {
  Breadcrumb,
  Breadcrumbs,
  PopoverPosition,
  Tooltip
} from '@blueprintjs/core';
import * as React from 'react';
import styled from 'styled-components';
import { PropKey } from '../../utils';
import { BaseWidget, ZIndex } from '../common';

const EditorRootBreadcrumbsRoot = styled(ZIndex)`
  position: absolute;
  width: 20%;
  padding: 0 5px;
  background: white;
  left: 30px;
  top: 20px;
  border-radius: 2px;
`;

const TooltipContent = styled.div`
  max-width: 600px;
`;

const BreadcrumbTitle = styled.span``;

export class EditorRootBreadcrumbs extends BaseWidget {
  constructor(props) {
    super(props);
  }

  setEditorRootTopicKey = topicKey => () => {
    const { model, controller } = this.props;
    if (model.editorRootTopicKey !== topicKey) {
      controller.run('operation', {
        ...this.props,
        opType: OpType.SET_EDITOR_ROOT,
        topicKey
      });
    }
  };

  breadcrumbRenderer = props => {
    const { text, ...breadProps } = props;
    const needTooltip = text.length > 8;
    const title = needTooltip ? text.substr(0, 8) + '...' : text;
    //TODO

    const content = <TooltipContent>{text}</TooltipContent>;
    const tooltipProps = {
      content,
      position: PopoverPosition.BOTTOM_RIGHT
    };
    const breadcrumb = (
      <Breadcrumb {...breadProps}>
        <BreadcrumbTitle>{title}</BreadcrumbTitle>
      </Breadcrumb>
    );
    return needTooltip ? (
      <Tooltip {...tooltipProps}>{breadcrumb}</Tooltip>
    ) : (
      breadcrumb
    );
  };

  render() {
    const props = this.props;
    const { model, controller, zIndex } = props;
    const editingRootKey = model.editorRootTopicKey;
    if (editingRootKey === model.rootTopicKey) return null;

    const items = [];
    let topic = model.getTopic(editingRootKey);
    while (topic != null) {
      const title = controller.getValue(PropKey.TOPIC_TITLE, {
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
      <EditorRootBreadcrumbsRoot zIndex={zIndex}>
        <Breadcrumbs {...breadcrumbProps} />
      </EditorRootBreadcrumbsRoot>
    );
  }
}
