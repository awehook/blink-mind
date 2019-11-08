import { TopicStyle, TopicVisualLevel } from '@blink-mind/core';
import debug from 'debug';

const log = debug('plugin:StylePlugin');

export function StylePlugin() {
  const colorMap = new Map();
  let colorIndex = 0;
  return {
    getTopicStyle(props): TopicStyle {
      log('getTopicStyle');
      const { topicKey, model, controller } = props;
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
          linkStyle: {
            ...themeStyle.linkStyle,
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
        }
      };
    },

    getLinkStyle(props): LinkStyle {
      const { topicKey, model, controller } = props;
      const visualLevel = model.getTopicVisualLevel(topicKey);
      const theme = model.config.theme;
      let linkStyle;
      if (visualLevel === TopicVisualLevel.ROOT)
        linkStyle = theme.rootTopic.linkStyle;
      else if (visualLevel === TopicVisualLevel.PRIMARY)
        linkStyle = theme.primaryTopic.linkStyle;
      else linkStyle = theme.normalTopic.linkStyle;

      const topic = model.getTopic(topicKey);
      if (theme.randomColor) {
        const randomColor = controller.run('getRandomColor', {
          ...props,
          topicKey:
            topic.parentKey !== model.editorRootTopicKey
              ? topic.parentKey
              : topicKey
        });
        linkStyle = {
          ...linkStyle,
          lineColor: randomColor
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
    }
  };
}
