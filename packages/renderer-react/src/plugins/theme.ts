import { IControllerRunContext } from '@blink-mind/core';
import { Classes } from '@blueprintjs/core';

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
    },

    setDarkMode(ctx) {
      const { darkMode } = ctx;
      if (darkMode) {
        if (!document.body.classList.contains(Classes.DARK)) {
          document.body.classList.add(Classes.DARK);
        }
      } else {
        if (document.body.classList.contains(Classes.DARK)) {
          document.body.classList.remove(Classes.DARK);
        }
      }
    },

    toggleDarkMode(ctx) {
      document.body.classList.toggle(Classes.DARK);
    }
  };
}
