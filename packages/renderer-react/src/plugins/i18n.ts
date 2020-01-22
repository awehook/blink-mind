import { I18nKey } from '../utils';

export function I18nPlugin() {
  const i18nTextMap = new Map([
    [I18nKey.CONFIRM, 'Confirm'],
    [I18nKey.CANCEL, 'Cancel'],
    [I18nKey.DEFAULT, 'Default'],
    [I18nKey.SEARCH, 'Search'],
    [I18nKey.LEFT_AND_RIGHT, 'Left And Right'],
    [I18nKey.ONLY_LEFT, 'Only Left'],
    [I18nKey.ONLY_RIGHT, 'Only Right'],

    [I18nKey.EDIT, 'Edit'],
    [I18nKey.ADD_CHILD, 'Add Child'],
    [I18nKey.ADD_SIBLING, 'Add Sibling'],
    [I18nKey.EDIT_NOTES, 'Edit Notes'],
    [I18nKey.DELETE, 'Delete'],
    [I18nKey.SET_AS_EDITOR_ROOT, 'Set as Editor Root'],
    [I18nKey.EDIT_TOPOLOGY_DIAGRAM, 'Edit Topology Diagram'],
    [I18nKey.SET_TOPIC_REFERENCES, 'Set Topic References'],

    [I18nKey.TOPIC_STYLE, 'TopicStyle'],
    [I18nKey.STYLE, 'Style'],
    [I18nKey.TEXT_EDITOR, 'Text Editor'],
    [I18nKey.LINK, 'Link'],
    [I18nKey.LINK_TO_PARENT, 'LinkToParent'],
    [I18nKey.SUB_LINKS, 'SubLinks'],
    [I18nKey.COPY_STYLE, 'Copy Style'],
    [I18nKey.PASTE_STYLE, 'Paste Style'],
    [I18nKey.CLEAR_TOPIC_STYLE, 'Clear Topic Style'],
    [I18nKey.CLEAR_ALL_CUSTOM_STYLE, 'Clear All Custom Style'],
    [I18nKey.LINE_TYPE, 'LineType'],

    [I18nKey.THEME, 'Theme'],
    [I18nKey.GLOBAL, 'Global'],
    [I18nKey.HIGHLIGHT, 'Highlight'],
    [I18nKey.RANDOM_COLOR, 'Random Color'],
    [I18nKey.NORMAL_TOPIC, 'NormalTopic'],
    [I18nKey.PRIMARY_TOPIC, 'PrimaryTopic'],
    [I18nKey.ROOT_TOPIC, 'RootTopic'],
    [I18nKey.EXPORT_THEME, 'Export Theme'],
    [I18nKey.IMPORT_THEME, 'Import Theme'],

    [I18nKey.TAGS, 'Tags'],
    [I18nKey.TAGS_MANAGER, 'Tags Manager'],
    [I18nKey.TAG_NAME, 'Tag Name'],
    [I18nKey.ADD_TAG, 'Add Tag'],
    [I18nKey.UPDATE_TAG, 'Update Tag'],
    [I18nKey.ALREADY_ADDED, 'Already Added'],
    [I18nKey.CAN_BE_ADDED, 'Can be Added'],
    [I18nKey.TOPICS_THAT_USE_THIS_TAG, 'Topics that Use this Tag'],

    [I18nKey.BACKGROUND, 'Background'],
    [I18nKey.COLOR, 'Color'],
    [I18nKey.BORDER, 'Border'],
    [I18nKey.WIDTH, 'Width'],
    [I18nKey.RADIUS, 'Radius'],
    [I18nKey.FONT_SIZE, 'FontSize'],
    [I18nKey.LINE_HEIGHT, 'LineHeight'],
    [I18nKey.PADDING, 'Padding'],
    [I18nKey.TOP, 'Top'],
    [I18nKey.BOTTOM, 'Bottom'],
    [I18nKey.LEFT, 'Left'],
    [I18nKey.RIGHT, 'Right'],
    [I18nKey.NONE, 'None'],
    [I18nKey.SOLID, 'Solid'],
    [I18nKey.DOTTED, 'Dotted'],
    [I18nKey.DASHED, 'Dashed'],
    [I18nKey.DOUBLE, 'Double'],

    [I18nKey.ROUND, 'Round'],
    [I18nKey.CURVE, 'Curve'],
    [I18nKey.LINE, 'Line'],

    [I18nKey.COLLAPSE_ALL, 'Collapse All'],
    [I18nKey.EXPAND_ALL, 'Expand All'],
    [I18nKey.CENTER_ROOT_TOPIC, 'Center Root Topic'],
    [I18nKey.ZOOM, 'zoom'],
    [I18nKey.ZOOM_IN, 'Zoom In'],
    [I18nKey.ZOOM_OUT, 'Zoom Out'],
    [I18nKey.RESET, 'Reset'],
    [I18nKey.RESET_ZOOM, 'Reset Zoom'],

    [I18nKey.NOTE_PLACEHOLDER,'Write topic notes here'],

    [I18nKey.TOPOLOGY_DIAGRAM_EDITOR, 'Topology Diagram Editor'],
    [I18nKey.BASIC, 'Basic'],
    [I18nKey.FLOW_GRAPH, 'Flow Graph'],
    [I18nKey.ACTIVITY_DIAGRAM, 'Activity Diagram'],
    [I18nKey.SEQUENCE_DIAGRAM, 'Sequence Diagram'],
    [I18nKey.CLASS_DIAGRAM, 'Class Diagram'],

    [I18nKey.REFERENCE_TOPICS, 'Reference Topics'],
    [I18nKey.REFERENCED_TOPICS, 'Referenced Topics'],

    [
      I18nKey.SELECT_REF_TOPICS_TIP,
      'Please select the topics you want to reference. After selection, click the confirm button.'
    ],
    [
      I18nKey.TAG_NAME_OVER_MAX_TIP,
      'The length of tag name over the maximum length: 50!'
    ],
    [
      I18nKey.DELETE_TAG_TIP,
      'All the relationship about this tag will be lost if you delete this tag! Are you confirm?'
    ],
    [
      I18nKey.DELETE_TOPOLOGY_TIP,
      'Are you confirm to delete this topology diagram?'
    ]
  ]);

  return {
    getI18nTextMap() {
      return i18nTextMap;
    },
    getI18nText(ctx) {
      const { controller, key } = ctx;
      const m = controller.run('getI18nTextMap', ctx);
      if (!m.has(key)) {
        throw new Error(`i18n key ${key} is not exist`);
      }
      return m.get(key);
    }
  };
}
