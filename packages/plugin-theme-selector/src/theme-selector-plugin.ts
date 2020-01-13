import { defaultTheme, Model, OpType, ThemeType } from '@blink-mind/core';
import { themeRandomColorSquare } from './themes';
import { theme1 } from './themes';
import { theme2 } from './themes';
import { theme3 } from './themes';
import { theme4 } from './themes';

export type ThemeMap = Map<string, ThemeType>;

export function ThemeSelectorPlugin() {
  const themeMap = new Map<string, ThemeType>([
    ['default', defaultTheme],
    ['random-color-square', themeRandomColorSquare],
    ['theme1', theme1],
    ['theme2', theme2],
    ['theme3', theme3],
    ['theme4', theme4]
  ]);
  return {
    getAllThemes(props) {
      return themeMap;
    },

    getTheme(props) {
      const { controller, themeKey } = props;
      return controller.run('getAllThemes', props).get(themeKey);
    },

    setTheme(ctx) {
      const { controller, themeKey } = ctx;
      const allThemes: ThemeMap = controller.run('getAllThemes', ctx);
      if (!allThemes.has(themeKey)) {
        throw new Error(`the theme key ${themeKey} is not exist!`);
      }
      controller.run('operation', {
        ...ctx,
        opType: OpType.SET_THEME,
        theme: allThemes.get(themeKey)
      });
    },

    createNewModel(props, next) {
      let model: Model = next();
      model = model.setIn(['config', 'theme'], themeRandomColorSquare);
      return model;
    }
  };
}
