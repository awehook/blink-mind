import { ThemeType, defaultTheme, ModelModifier } from '@blink-mind/core';
import { theme1 } from '../themes';
import { theme2 } from '../themes';
import { theme3 } from '../themes';
import { theme4 } from '../themes';

export function ThemeSelectorPlugin() {
  const themeMap = new Map<string, ThemeType>([
    ['default', defaultTheme],
    ['theme1', theme1],
    ['theme2', theme2],
    ['theme3', theme3],
    ['theme4', theme4]
  ]);
  let currentThemeKey: string = null;
  return {
    getAllThemes(props) {
      return themeMap;
    },

    setTheme(props) {
      const { model, controller, themeKey } = props;
      currentThemeKey = themeKey;
      const allTheme = controller.run('getAllThemes', props);
      if (!allTheme.has(themeKey)) {
        throw new Error('setTheme: the theme key is not correct!');
      }
      const theme = allTheme.get(themeKey);
      const newModel = ModelModifier.setTheme({ model, theme });
      controller.change(newModel);
    }
  };
}
