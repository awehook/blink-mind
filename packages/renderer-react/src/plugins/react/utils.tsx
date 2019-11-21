import debug from 'debug';
const log = debug('plugin:utils');
export function UtilsPlugin() {
  const tempValueMap = new Map();
  return {
    getTempValue(props) {
      const { key } = props;
      log('getTempValue', key);
      return tempValueMap.get(key);
    },

    setTempValue(props) {
      const { key, value } = props;
      log('setTempValue', key);
      tempValueMap.set(key, value);
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
