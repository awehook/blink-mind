import { BlockType } from '@blink-mind/core';
import debug from 'debug';
import * as React from 'react';
import { SaveRef } from '../../components/common';
import { Canvas } from '../../components/widgets/canvas';
import { DiagramRoot } from '../../components/widgets/diagram-root';
import { EditorRootBreadcrumbs } from '../../components/widgets/editor-root-breadcrumbs';
import { Modals } from '../../components/widgets/modals';
import { RootSubLinks } from '../../components/widgets/root-sublinks';
import { RootWidget } from '../../components/widgets/root-widget';
import { TopicCollapseIcon } from '../../components/widgets/topic-collapse-icon';
import { TopicContent } from '../../components/widgets/topic-content';
import { TopicContentWidget } from '../../components/widgets/topic-content-widget';
import { TopicDesc } from '../../components/widgets/topic-desc';
import { TopicHighlight } from '../../components/widgets/topic-highlight';
import { TopicSubLinks } from '../../components/widgets/topic-sub-links';
import { TopicWidget } from '../../components/widgets/topic-widget';
import { ViewPortViewer } from '../../components/widgets/view-port-util';
import { linksRefKey, PropKey, RefKey } from '../../utils';
import { renderDrawer } from './drawer';
import Theme from './theme';
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

    renderCanvas(props) {
      return React.createElement(Canvas, props);
    },

    renderDrawer,

    getInitialCanvasState(props) {
      return {
        rightTopPanel: { isOpen: false, selectedTabId: 'topic-style' }
      };
    },

    renderCanvasCustomize(props) {
      const { controller, model } = props;
      const zIndex = controller.getValue(
        PropKey.DIAGRAM_CUSTOMIZE_BASE_Z_INDEX
      );
      const nProps = {
        ...props,
        zIndex,
        topicKey: model.focusKey
      };
      const breadcrumbs = controller.run('renderEditorRootBreadcrumbs', nProps);
      // const styleEditor = controller.run('renderStyleEditor', nProps);
      const rightTopPanel = controller.run('renderRightTopPanel', nProps);
      const modals = controller.run('renderModals', {
        ...nProps,
        zIndex: zIndex + 1
      });
      const drawer = controller.run('renderDrawer', {
        ...nProps,
        zIndex: zIndex + 1
      });
      const viewportViewer = controller.run('renderViewPortViewer', nProps);
      return [breadcrumbs, rightTopPanel, modals, drawer, viewportViewer];
    },

    renderEditorRootBreadcrumbs(props) {
      return <EditorRootBreadcrumbs key="EditorRootBreadcrumbs" {...props} />;
    },

    renderModals(props) {
      return <Modals key="modals" {...props} />;
    },

    renderModal(props) {
      return null;
    },

    getActiveModalProps(props) {
      return null;
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

    renderTopicContent(props) {
      return <TopicContentWidget {...props} />;
    },

    renderTopicCollapseIcon(props) {
      return <TopicCollapseIcon {...props} />;
    },

    renderTopicContentOthers(props) {
      return [];
    },

    renderTopicBlocks(props) {
      const { model, topicKey, controller } = props;
      const topic = model.getTopic(topicKey);
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
      return <TopicContent {...props} />;
    },

    renderTopicBlockDesc(props) {
      return <TopicDesc {...props} />;
    },

    renderSubLinks(props) {
      const { saveRef, topicKey, model } = props;
      const topic = model.getTopic(topicKey);
      if (topic.subKeys.size === 0 || topic.collapse) return null;
      return <TopicSubLinks ref={saveRef(linksRefKey(topicKey))} {...props} />;
    },

    renderRootSubLinks(props) {
      // log('renderRootSubLinks');
      const { saveRef, topicKey } = props;
      // 这里逻辑有问题,会导致layout 错误
      // const topic = model.getTopic(topicKey);
      // if (topic.subKeys.size === 0) return null;
      return <RootSubLinks ref={saveRef(linksRefKey(topicKey))} {...props} />;
    },

    renderFocusItemHighlight(props) {
      const { saveRef, model } = props;
      return (
        <TopicHighlight
          ref={saveRef(RefKey.FOCUS_HIGHLIGHT_KEY + model.id)}
          {...props}
        />
      );
    },

    renderRootWidgetOtherChildren(props) {
      const { controller } = props;
      const zoomFactor = controller.run('getZoomFactor', props);
      props = { ...props, zoomFactor };
      return (
        <>
          {controller.run('renderRootSubLinks', props)}
          {controller.run('renderFocusItemHighlight', props)}
          {controller.run('renderDragAndDropEffect', props)}
        </>
      );
    },

    renderViewPortViewer(props) {
      return <ViewPortViewer key="view-port-viewer" {...props} />;
    }
  };
}
