import { BlockType, ViewModeMindMap } from '@blink-mind/core';
import debug from 'debug';
import React from 'react';
import { SaveRef } from '../../components/common';
import {
  DiagramRoot,
  EditorRootBreadcrumbs,
  MindMapSheet,
  RootWidget,
  TopicBlockContent,
  TopicCollapseIcon,
  TopicDesc,
  TopicNodeLastRow,
  TopicNodeWidget,
  TopicWidget,
  ViewPortViewer
} from '../../components/widgets';
import { PropKey } from '../../utils';
import { renderDrawer } from './drawer';
const log = debug('plugin:rendering');

export function RenderingPlugin() {
  let diagramProps;
  return {
    getDiagramProps() {
      return diagramProps;
    },
    renderDiagram(props) {
      const { docModel } = props;
      return (
        <SaveRef>
          {(saveRef, getRef, deleteRef) => {
            diagramProps = {
              ...props,
              saveRef,
              getRef,
              deleteRef
            };
            log('renderDiagram', docModel);
            return React.createElement(DiagramRoot, diagramProps);
          }}
        </SaveRef>
      );
    },

    renderDiagramCustomize(ctx) {
      return [];
    },

    renderSheet(props) {
      const { model } = props;
      if (model.config.viewMode === ViewModeMindMap)
        return React.createElement(MindMapSheet, props);
    },

    renderDrawer,

    getInitialSheetState(props) {
      return {
        rightTopPanel: { isOpen: false, selectedTabId: 'topic-style' }
      };
    },

    renderSheetCustomize(props) {
      const { controller, model } = props;
      const zIndex = controller.getValue(
        PropKey.DIAGRAM_CUSTOMIZE_BASE_Z_INDEX
      );
      const nProps = {
        ...props,
        zIndex,
        topicKey: model.focusKey,
        topic: model.getTopic(model.focusKey)
      };
      const breadcrumbs = controller.run('renderEditorRootBreadcrumbs', nProps);
      // const styleEditor = controller.run('renderStyleEditor', nProps);
      const rightTopPanel = controller.run('renderRightTopPanel', nProps);
      const dialog = controller.run('renderDialog', {
        ...nProps,
        zIndex: zIndex + 1
      });
      const drawer = controller.run('renderDrawer', {
        ...nProps,
        zIndex: zIndex + 1
      });
      const viewportViewer = controller.run('renderViewPortViewer', nProps);
      return [breadcrumbs, rightTopPanel, dialog, drawer, viewportViewer];
    },

    renderEditorRootBreadcrumbs(props) {
      return <EditorRootBreadcrumbs key="EditorRootBreadcrumbs" {...props} />;
    },

    renderDoc({ children }) {
      return children;
    },

    renderRootWidget(props) {
      return <RootWidget {...props} />;
    },

    renderTopicWidget(props) {
      return <TopicWidget {...props} />;
    },

    renderTopicNode(props) {
      return <TopicNodeWidget {...props} />;
    },

    renderTopicNodeRows(props) {
      const { controller } = props;
      return [controller.run('renderTopicNodeLastRow', props)];
    },

    renderTopicNodeLastRow(props) {
      return <TopicNodeLastRow key="last-row" {...props} />;
    },

    renderTopicCollapseIcon(props) {
      return <TopicCollapseIcon {...props} />;
    },

    renderTopicNodeLastRowOthers(props) {
      return [];
    },

    renderTopicBlocks(props) {
      const { topic, controller } = props;
      const blocks = topic.blocks;
      const res = [];
      let i = 0;
      blocks.forEach(block => {
        const b = controller.run('renderTopicBlock', {
          ...props,
          block,
          blockKey: `block-${i}`
        });
        if (b) {
          res.push(<React.Fragment key={`block-${i}`}>{b}</React.Fragment>);
          i++;
        }
      });
      return res;
    },

    renderTopicBlock(props) {
      const { controller, block } = props;
      switch (block.type) {
        case BlockType.CONTENT:
          return controller.run('renderTopicBlockContent', props);
        case BlockType.DESC:
          return controller.run('renderTopicBlockDesc', props);
        default:
          break;
      }
      return null;
    },

    renderTopicBlockContent(props) {
      return <TopicBlockContent {...props} />;
    },

    renderTopicBlockDesc(props) {
      return <TopicDesc {...props} />;
    },

    renderRootWidgetOtherChildren(props) {
      const { controller } = props;
      const zoomFactor = controller.run('getZoomFactor', props);
      props = { ...props, zoomFactor };
      return (
        <>
          {controller.run('renderRootSubLinks', props)}
          {controller.run('renderDragAndDropEffect', props)}
        </>
      );
    },

    renderViewPortViewer(props) {
      return <ViewPortViewer key="view-port-viewer" {...props} />;
    }
  };
}
