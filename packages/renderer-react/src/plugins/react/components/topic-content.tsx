import debug from 'debug';
import * as React from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import styled from 'styled-components';
const log = debug('node:topic-content2');

const EditingRoot = styled.div`
  position: relative;
`;

const EditingWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: auto;
  z-index: 10;
`;
const cancelEvent = e => {
  log('cancelEvent');
  e.preventDefault();
  e.stopPropagation();
};
export function TopicContent(props) {
  const { controller, model, topicKey, getRef } = props;
  const readOnly = model.editingContentKey !== topicKey;
  const editor = controller.run('renderTopicContentEditor', {
    ...props,
    readOnly
  });
  let child;
  if (readOnly) {
    child = editor;
  } else {
    let wrapper;
    const wrapperRef = ref => {
      if (ref) {
        wrapper = ref;
        contentResizeObserver.observe(wrapper);
      }
    };
    let rect = { width: 50, height: 40 };
    const editorDiv = getRef(`content-editor-${topicKey}`);
    if (editorDiv) rect = editorDiv.getBoundingClientRect();
    const contentResizeCallback = (
      entries: ResizeObserverEntry[],
      observer: ResizeObserver
    ) => {
      const r = entries[0].contentRect;
      wrapper.style.left = (rect.width - r.width) / 2 + 'px';
      wrapper.style.top = (rect.height - r.height) / 2 + 'px';
    };
    const contentResizeObserver = new ResizeObserver(contentResizeCallback);
    log(rect);
    child = (
      <>
        <div style={{ width: rect.width, height: rect.height }}></div>
        {/*<Dialog isOpen>{editor}</Dialog>*/}
        <EditingWrapper ref={wrapperRef}>{editor}</EditingWrapper>
      </>
    );
  }
  return (
    <EditingRoot onDragEnter={cancelEvent} onDragOver={cancelEvent}>
      {child}
    </EditingRoot>
  );
}
