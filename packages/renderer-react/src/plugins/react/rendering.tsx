import { BlockType } from '@blink-mind/core';
import debug from 'debug';
import * as React from 'react';
import styled from 'styled-components';
import { SaveRef } from '../../components/common';
import { linksRefKey, PropKey, RefKey } from '../../utils';
import { EditorRootBreadcrumbs } from './components/editor-root-breadcrumbs';
import { MindDragScrollWidget } from './components/mind-drag-scroll-widget';
import { Modals } from './components/modals';
import { RootSubLinks } from './components/root-sublinks';
import { RootWidget } from './components/root-widget';
import { TopicCollapseIcon } from './components/topic-collapse-icon';
import { TopicContent } from './components/topic-content';
import { TopicContentWidget } from './components/topic-content-widget';
import { TopicDesc } from './components/topic-desc';
import { TopicHighlight } from './components/topic-highlight';
import { TopicSubLinks } from './components/topic-sub-links';
import { TopicWidget } from './components/topic-widget';
import { ViewPortViewer } from './components/view-port-util';
import { renderDrawer } from './drawer';
import Theme from './theme';
const log = debug('plugin:rendering');

export function RenderingPlugin() {
  const DiagramRoot = styled.div`
    width: 100%;
    height: 100%;
    background: ${props => props.theme.background};
    position: relative;
  `;
  let diagramProps;
  return {
    getDiagramProps() {
      return diagramProps;
    },
    renderDiagram(props) {
      const { model, controller } = props;
      return (
        <SaveRef>
          {(saveRef, getRef, deleteRef) => {
            diagramProps = {
              ...props,
              saveRef,
              getRef,
              deleteRef
            };

            log('renderDiagram', model);
            return (
              <Theme theme={model.config.theme}>
                <DiagramRoot ref={saveRef(RefKey.DIAGRAM_ROOT_KEY)}>
                  <MindDragScrollWidget {...diagramProps} />
                  {controller.run('renderDiagramCustomize', diagramProps)}
                </DiagramRoot>
              </Theme>
            );
          }}
        </SaveRef>
      );
    },
    renderDrawer,

    renderDiagramCustomize(props) {
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
      const { saveRef } = props;
      return (
        <TopicHighlight ref={saveRef(RefKey.FOCUS_HIGHLIGHT_KEY)} {...props} />
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
