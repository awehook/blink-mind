import * as React from 'react';
import { ThemeProvider } from 'styled-components';

export default function Theme({ theme, children }) {
  return (
    //@ts-ignore
    <ThemeProvider theme={theme}>
      <React.Fragment>{children}</React.Fragment>
    </ThemeProvider>
  );
}
