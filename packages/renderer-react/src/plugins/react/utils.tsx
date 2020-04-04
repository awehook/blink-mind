import debug from 'debug';
const log = debug('plugin:utils');
export function UtilsPlugin() {
  const tempValueMap = new Map<string, any>();
  const eventListenerMap = new Map<string, any>();
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
        const res = eventListenerMap.get(key).filter(l => l !== listener);
        eventListenerMap.set(key, res);
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
