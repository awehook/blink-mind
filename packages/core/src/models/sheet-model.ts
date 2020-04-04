import { Map, Record } from 'immutable';
import isPlainObject from 'is-plain-object';
import { FocusMode, KeyType } from '../types';
import { createKey } from '../utils';
import { Config } from './config';
import { Topic } from './topic';

type ModelRecordType = {
  id: KeyType;
  title: string;
  topics: Map<KeyType, Topic>;
  config: Config;
  rootTopicKey: KeyType;
  editorRootTopicKey?: KeyType;
  focusKey?: KeyType;
  focusMode?: string;
  selectedKeys?: Array<KeyType>;
  zoomFactor: number;
  formatVersion?: string;
};

const defaultModelRecord: ModelRecordType = {
  id: null,
  title: null,
  topics: Map(),
  config: new Config(),
  rootTopicKey: null,
  editorRootTopicKey: null,
  focusKey: null,
  focusMode: null,
  zoomFactor: 1,
  selectedKeys: null,
  formatVersion: null
};

export class SheetModel extends Record(defaultModelRecord) {
  static isModel(obj) {
    return obj instanceof SheetModel;
  }
  static create(attrs: any = null): SheetModel {
    if (attrs == null) return SheetModel.createEmpty();
    let res: SheetModel;
    if (SheetModel.isModel(attrs)) {
      res = attrs;
    }

    if (isPlainObject(attrs)) {
      res = SheetModel.fromJSON(attrs);
    }
    if (res) {
      if (res.focusKey == null) {
        res = res.set('focusKey', res.rootTopicKey);
      }
      if (res.focusMode == null) {
        res = res.set('focusMode', FocusMode.NORMAL);
      }
      return res;
    }

    throw new Error(
      `\`Value.create\` only accepts objects or values, but you passed it: ${attrs}`
    );
  }

  static createEmpty(arg?): SheetModel {
    const model = new SheetModel();
    const rootTopic = Topic.create({ key: createKey(), content: 'RootTopic' });
    return model
      .set('id', createKey())
      .update('topics', topics => topics.set(rootTopic.key, rootTopic))
      .set('rootTopicKey', rootTopic.key)
      .set('editorRootTopicKey', rootTopic.key)
      .set('focusKey', rootTopic.key)
      .set('focusMode', FocusMode.NORMAL)
      .merge(arg);
  }

  static fromJSON(object) {
    let model = new SheetModel();
    const { topics = [], config = {}, rootTopicKey } = object;
    let { editorRootTopicKey } = object;

    if (editorRootTopicKey === undefined) editorRootTopicKey = rootTopicKey;

    model = model.merge({
      rootTopicKey,
      editorRootTopicKey
    });

    model = model.withMutations(model => {
      topics.forEach(topic => {
        model.update('topics', topics =>
          topics.set(topic.key, Topic.fromJSON(topic))
        );
      });
      model.set('config', Config.fromJSON(config));
    });

    return model;
  }

  toJS() {
    return {
      id: this.id,
      title: this.title,
      rootTopicKey: this.rootTopicKey,
      topics: Object.values(this.topics.toJS()),
      config: this.config,
      zoomFactor: this.zoomFactor
    };
  }

  get id(): KeyType {
    return this.get('id');
  }

  get title(): string {
    return this.get('title');
  }

  get topics(): Map<KeyType, Topic> {
    return this.get('topics');
  }

  get config(): Config {
    return this.get('config');
  }

  get formatVersion(): string {
    return this.get('formatVersion');
  }

  get rootTopicKey(): KeyType {
    return this.get('rootTopicKey');
  }

  get editorRootTopicKey(): KeyType {
    return this.get('editorRootTopicKey');
  }

  get focusKey(): KeyType {
    return this.get('focusKey');
  }

  get focusMode(): string {
    return this.get('focusMode');
  }

  get editingContentKey(): KeyType {
    return [FocusMode.EDITING_CONTENT, FocusMode.SHOW_POPUP].includes(
      this.focusMode
    )
      ? this.focusKey
      : null;
  }

  get editingDescKey(): KeyType {
    return this.focusMode === FocusMode.EDITING_DESC ? this.focusKey : null;
  }

  get selectedKeys(): Array<KeyType> {
    return this.get('selectedKeys');
  }

  get focusOrSelectedKeys(): Array<KeyType> {
    return this.selectedKeys || [this.focusKey];
  }

  getTopic(key: KeyType): Topic {
    return this.topics.get(key);
  }

  getParentTopic(key: KeyType): Topic {
    const topic = this.getTopic(key);
    return topic.parentKey ? this.getTopic(topic.parentKey) : null;
  }

  getParentKey(key: KeyType): KeyType {
    return this.getTopic(key).parentKey;
  }

  getPreviousSiblingKey(key: KeyType): KeyType {
    const p = this.getParentTopic(key);
    const index = p.subKeys.indexOf(key);
    if (index === 0) return null;
    return p.subKeys.get(index - 1);
  }

  getNextSiblingKey(key: KeyType): KeyType {
    const p = this.getParentTopic(key);
    const index = p.subKeys.indexOf(key);
    if (index === p.subKeys.size - 1) return null;
    return p.subKeys.get(index + 1);
  }

  getVisualDepth(key: KeyType): number {
    let topic = this.getTopic(key);
    let depth = 0;
    while (topic && topic.key !== this.editorRootTopicKey) {
      depth++;
      topic = this.getParentTopic(topic.key);
    }
    return depth;
  }

  getDepth(key: KeyType) {
    let topic = this.getTopic(key);
    let depth = 0;
    while (topic && topic.key !== this.rootTopicKey) {
      depth++;
      topic = this.getParentTopic(topic.key);
    }
    return depth;
  }

  get rootTopic() {
    return this.getTopic(this.rootTopicKey);
  }

  get currentFocusTopic() {
    return this.getTopic(this.focusKey);
  }

  // 暂时没有用到
  get zoomFactor() {
    return this.get('zoomFactor');
  }

  isEditorRootKey(topicKey: KeyType) {
    return topicKey === this.editorRootTopicKey;
  }
}
