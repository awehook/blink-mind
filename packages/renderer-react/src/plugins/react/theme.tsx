import * as React from 'react';
import { ThemeProvider } from 'styled-components';

//TODO 是否需要themeProvider
export default function Theme({ theme, children }) {
  return (
    //@ts-ignore
    <ThemeProvider theme={theme}>
      <React.Fragment>{children}</React.Fragment>
    </ThemeProvider>
  );
}
