export function contentRefKey(key) {
  return `content-${key}`;
}

export function contentEditorRefKey(key) {
  return `content-editor-${key}`;
}

export function descEditorRefKey(key) {
  return `desc-editor-${key}`;
}

export function topicWidgetRefKey(key) {
  return `topic-widget-${key}`;
}

export function topicRefKey(key) {
  return `topic-${key}`;
}

export function linksRefKey(key) {
  return `links-${key}`;
}

export function linksSvgRefKey(key) {
  return `links-svg-${key}`;
}

export function collapseRefKey(key) {
  return `collapse-${key}`;
}

export function dropAreaRefKey(key, dir) {
  return `dropArea-${dir}-${key}`;
}

export const RefKey = {
  DIAGRAM_ROOT_KEY: 'DIAGRAM-ROOT',
  DRAG_SCROLL_WIDGET_KEY: 'DragScrollWidget',
  SVG_HIGHLIGHT_KEY: 'svg-highlight',
  FOCUS_HIGHLIGHT_KEY: 'focus-highlight',
  DROP_EFFECT_KEY: 'drop-effect'
};
export const EventKey = {
  CENTER_ROOT_TOPIC: 'CENTER_ROOT_TOPIC'
};

export const PropKey = {
  DIAGRAM_CUSTOMIZE_BASE_Z_INDEX: 'DIAGRAM_CUSTOMIZE_BASE_Z_INDEX',
  TOPIC_CONTEXT_MENU_ENABLED: 'TOPIC_CONTEXT_MENU_ENABLED',
  TOPIC_TITLE: 'TOPIC_TITLE',
  DRAG_DROP_STATE: 'DRAG_DROP_STATE',
  RIGHT_TOP_PANEL_STATE: 'RIGHT_TOP_PANEL_STATE'
};
