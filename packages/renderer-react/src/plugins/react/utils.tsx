import debug from 'debug';
const log = debug('plugin:utils');
export function UtilsPlugin() {
  const tempValueMap = new Map();
  const eventListenerMap = new Map();
  return {
    addTempValueChangeListener(props) {
      const { key, listener } = props;
      if (!eventListenerMap.has(key)) {
        eventListenerMap.set(key, []);
      }
      eventListenerMap.get(key).push(listener);
    },

    removeTempValueChangeListener(props) {
      const { key, listener } = props;
      if (eventListenerMap.has(key)) {
        eventListenerMap[key] = eventListenerMap.get(key).filter(
          l => l !== listener
        );
      }
    },

    getTempValue(props) {
      const { key } = props;
      log('getTempValue', key);
      return tempValueMap.get(key);
    },

    setTempValue(props) {
      const { key, value } = props;
      log('setTempValue', key);
      tempValueMap.set(key, value);
      if (eventListenerMap.has(key)) {
        const listeners = eventListenerMap.get(key);
        for (const listener of listeners) {
          listener(value);
        }
      }
    },

    deleteTempValue(props) {
      const { key } = props;
      log('deleteTempValue', key);
      const value = tempValueMap.get(key);
      tempValueMap.delete(key);
      return value;
    }
  };
}
