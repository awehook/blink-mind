export function UtilsPlugin() {
  let descValue;
  return {
    getTopicDescTempValue(props) {
      return descValue;
    },

    setTopicDescTempValue(props) {
      descValue = props.value;
    }
  };
}
