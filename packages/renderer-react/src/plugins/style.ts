import { OpType, TopicStyle, TopicVisualLevel } from '@blink-mind/core';
import debug from 'debug';
import { isEqual } from 'lodash';

const log = debug('plugin:StylePlugin');

export function StylePlugin() {
  const colorMap = new Map();
  let colorIndex = 0;
  return {
    getTopicStyle(props): TopicStyle {
      const { topicKey, model, controller } = props;
      log('getTopicStyle:', topicKey, model);
      const visualLevel = model.getTopicVisualLevel(topicKey);
      const theme = model.config.theme;
      let themeStyle;
      if (visualLevel === TopicVisualLevel.ROOT) themeStyle = theme.rootTopic;
      else if (visualLevel === TopicVisualLevel.PRIMARY)
        themeStyle = theme.primaryTopic;
      else themeStyle = theme.normalTopic;

      if (theme.randomColor) {
        const randomColor = controller.run('getRandomColor', props);
        themeStyle = {
          ...themeStyle,
          background: randomColor,
          borderColor: randomColor,
          subLinkStyle: {
            ...themeStyle.subLinkStyle,
            lineColor: randomColor
          }
        };
      }
      const topic = model.getTopic(topicKey);
      if (!topic.style) {
        return themeStyle;
      }
      const customStyle = JSON.parse(topic.style);

      return {
        ...themeStyle,
        ...customStyle,
        linkStyle: {
          ...themeStyle.linkStyle,
          ...customStyle.linkStyle
        },
        subLinkStyle: {
          ...themeStyle.subLinkStyle,
          ...customStyle.subLinkStyle
        }
      };
    },

    getLinkStyle(props): LinkStyle {
      const { topicKey, model, controller } = props;
      log('getLinkStyle', topicKey);
      const visualLevel = model.getTopicVisualLevel(topicKey);
      const theme = model.config.theme;
      let linkStyle = theme.linkStyle;
      let presetStyle;
      if (visualLevel === TopicVisualLevel.ROOT)
        presetStyle = theme.rootTopic.linkStyle;
      else if (visualLevel === TopicVisualLevel.PRIMARY)
        presetStyle = theme.primaryTopic.linkStyle;
      else presetStyle = theme.normalTopic.linkStyle;

      linkStyle = { ...linkStyle, ...presetStyle };

      const topic = model.getTopic(topicKey);
      // 获取父节点的color
      // if (theme.randomColor) {
      //   const randomColor = controller.run('getRandomColor', {
      //     ...props,
      //     topicKey:
      //       topic.parentKey !== model.editorRootTopicKey
      //         ? topic.parentKey
      //         : topicKey
      //   });
      //   log(randomColor);
      //   linkStyle = {
      //     ...linkStyle,
      //     lineColor: randomColor
      //   };
      // }

      if (topic.parentKey != null) {
        const parentSubLinkStyle = controller.run('getSubLinkStyle', {
          ...props,
          topicKey: topic.parentKey
        });

        linkStyle = {
          ...linkStyle,
          ...parentSubLinkStyle
        };
      }

      if (!topic.style) {
        return linkStyle;
      }
      const customStyle = JSON.parse(topic.style);

      return {
        ...linkStyle,
        ...customStyle.linkStyle
      };
    },

    getSubLinkStyle(props): LinkStyle {
      const { topicKey, model, controller } = props;
      log('getLinkStyle', topicKey);
      const visualLevel = model.getTopicVisualLevel(topicKey);
      const theme = model.config.theme;
      let subLinkStyle = theme.linkStyle;
      let presetStyle;
      if (visualLevel === TopicVisualLevel.ROOT)
        presetStyle = theme.rootTopic.subLinkStyle;
      else if (visualLevel === TopicVisualLevel.PRIMARY)
        presetStyle = theme.primaryTopic.subLinkStyle;
      else presetStyle = theme.normalTopic.subLinkStyle;

      subLinkStyle = { ...subLinkStyle, ...presetStyle };

      const topic = model.getTopic(topicKey);
      // 获取父节点的color
      if (theme.randomColor) {
        const randomColor = controller.run('getRandomColor', props);
        log(randomColor);
        subLinkStyle = {
          ...subLinkStyle,
          lineColor: randomColor
        };
      }

      if (!topic.style) {
        return subLinkStyle;
      }
      const customStyle = JSON.parse(topic.style);

      const res = {
        ...subLinkStyle,
        ...customStyle.subLinkStyle
      };
      // if (res.lineRadius == null) res.lineRadius = 5;
      return res;
    },

    setStyle(props) {
      const { topicKey, controller, style, model } = props;
      const topic = model.getTopic(topicKey);
      const topicStyle = topic.style;
      const styleObj = topicStyle ? JSON.parse(topicStyle) : {};
      const newStyleObj = {
        ...styleObj,
        ...style
      };
      if (!isEqual(styleObj, newStyleObj)) {
        const newStyleStr = JSON.stringify(newStyleObj);
        controller.run('operation', {
          ...props,
          opType: OpType.SET_STYLE,
          style: newStyleStr
        });
      }
    },

    setLinkStyle(props) {
      const { topicKey, controller, linkStyle, model } = props;
      const topic = model.getTopic(topicKey);
      const style = topic.style;
      const styleObj = style ? JSON.parse(style) : {};
      const newStyleObj = {
        ...styleObj,
        linkStyle: {
          ...styleObj.linkStyle,
          ...linkStyle
        }
      };
      if (!isEqual(styleObj, newStyleObj)) {
        const newStyleStr = JSON.stringify(newStyleObj);
        controller.run('operation', {
          ...props,
          opType: OpType.SET_STYLE,
          style: newStyleStr
        });
      }
    },

    setSubLinkStyle(props) {
      const { topicKey, controller, subLinkStyle, model } = props;
      const topic = model.getTopic(topicKey);
      const style = topic.style;
      const styleObj = style ? JSON.parse(style) : {};
      const newStyleObj = {
        ...styleObj,
        subLinkStyle: {
          ...styleObj.subLinkStyle,
          ...subLinkStyle
        }
      };
      if (!isEqual(styleObj, newStyleObj)) {
        const newStyleStr = JSON.stringify(newStyleObj);
        controller.run('operation', {
          ...props,
          opType: OpType.SET_STYLE,
          style: newStyleStr
        });
      }
    },

    getTopicThemeStyle(props): TopicStyle {
      const { topicKey, model } = props;
      const visualLevel = model.getTopicVisualLevel(topicKey);
      const theme = model.config.theme;
      if (visualLevel === TopicVisualLevel.ROOT) return theme.rootTopic;
      if (visualLevel === TopicVisualLevel.PRIMARY) return theme.primaryTopic;
      return theme.normalTopic;
    },

    getRandomColor(props) {
      const { topicKey } = props;
      if (colorMap.has(topicKey)) return colorMap.get(topicKey);
      const colors = [
        '#00CC99',
        '#FFEE88',
        '#A167A5',
        '#E5F993',
        '#F5C396',
        '#DB995A',
        '#83BCFF',
        '#ED7B84',
        '#F92A82',
        '#83BCFF'
      ];
      const color = colors[++colorIndex % colors.length];
      colorMap.set(topicKey, color);
      return color;
    },

    clearAllCustomStyle(props) {
      const { model, controller } = props;
      const newModel = model.withMutations(model => {
        model.topics.keySeq().forEach(key => {
          model.setIn(['topics', key, 'style'], null);
        });
      });
      controller.change(newModel);
    }
  };
}
