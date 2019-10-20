import * as React from "react";
import { storiesOf } from "@storybook/react";

import { SimpleDemo } from "./SimpleDemo";

storiesOf("blink-mind",module)
  .add('SimpleDemo',()=><SimpleDemo/>);