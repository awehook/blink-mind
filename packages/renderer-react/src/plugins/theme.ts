import { IControllerRunContext } from '@blink-mind/core';

export function ThemePlugin() {
  return {
    getThemeOfTopic(ctx: IControllerRunContext) {
      const { model } = ctx;
      const theme = model.config.theme;
      const { contentStyle, rootTopic, primaryTopic, normalTopic } = theme;
      return {
        rootTopic: {
          ...rootTopic,
          contentStyle: { ...contentStyle, ...rootTopic.contentStyle }
        },
        primaryTopic: {
          ...primaryTopic,
          contentStyle: { ...contentStyle, ...primaryTopic.contentStyle }
        },
        normalTopic: {
          ...normalTopic,
          contentStyle: { ...contentStyle, ...normalTopic.contentStyle }
        }
      };
    }
  };
}
