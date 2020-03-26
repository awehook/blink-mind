import { Controller } from '@blink-mind/core';

export function op(controller: Controller, args) {
  controller.run('operation', args);
}
