import { Model } from '@blink-mind/core';

export function CreateModelPlugin() {
  return {
    createNewModel(props) {
      return Model.createEmpty();
    }
  };
}
