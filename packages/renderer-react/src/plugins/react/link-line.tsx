import * as React from 'react';
import { RootSubLinks, TopicSubLinks } from '../../components/widgets';
import { linksRefKey } from '../../utils';

export function LinkLinePlugin() {
  return {
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
    }

    // renderLinkPath(props) {
    //   const {linkStyle,contentRect,svgRect,dir,subContentRect} = props;
    // }
  };
}
