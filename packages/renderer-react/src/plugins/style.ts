import { TopicStyle, TopicVisualLevel } from '@blink-mind/core';

export function StylePlugin() {
  return {
    getTopicStyle(props): TopicStyle {
      const { topicKey, model } = props;
      const visualLevel = model.getTopicVisualLevel(topicKey);
      const theme = model.config.theme;
      let themeStyle;
      if (visualLevel === TopicVisualLevel.ROOT) themeStyle = theme.rootTopic;
      else if (visualLevel === TopicVisualLevel.PRIMARY)
        themeStyle = theme.primaryTopic;
      else themeStyle = theme.normalTopic;

      const topic = model.getTopic(topicKey);
      if (!topic.style) return themeStyle;
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

    getTopicThemeStyle(props): TopicStyle {
      const { topicKey, model } = props;
      const visualLevel = model.getTopicVisualLevel(topicKey);
      const theme = model.config.theme;
      if (visualLevel === TopicVisualLevel.ROOT) return theme.rootTopic;
      if (visualLevel === TopicVisualLevel.PRIMARY) return theme.primaryTopic;
      return theme.normalTopic;
    }
  };
}
