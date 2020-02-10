import { Map, Record } from 'immutable';
import isPlainObject from 'is-plain-object';
import { FocusMode, KeyType } from '../types';
import { createKey } from '../utils';
import { Config } from './config';
import { Topic } from './topic';

export type ExtData = Map<string, any>;

type ModelRecordType = {
  id: KeyType;
  title: string;
  topics: Map<KeyType, Topic>;
  extData: ExtData; //用于插件做数据扩展
  config: Config;
  rootTopicKey: KeyType;
  editorRootTopicKey?: KeyType;
  focusKey?: KeyType;
  focusMode?: string;
  zoomFactor: number;
  formatVersion?: string;
};

const defaultModelRecord: ModelRecordType = {
  id: null,
  title: null,
  topics: Map(),
  extData: Map(),
  config: new Config(),
  rootTopicKey: null,
  editorRootTopicKey: null,
  focusKey: null,
  viewMode: null,
  formatVersion: null,
  zoomFactor: 1
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

  static createEmpty(): SheetModel {
    const model = new SheetModel();
    const rootTopic = Topic.create({ key: createKey(), content: 'RootTopic' });
    return model
      .set('id',createKey())
      .update('topics', topics => topics.set(rootTopic.key, rootTopic))
      .set('rootTopicKey', rootTopic.key)
      .set('editorRootTopicKey', rootTopic.key)
      .set('focusKey', rootTopic.key)
      .set('focusMode', FocusMode.NORMAL);
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
    return  {
      id: this.id,
      title: this.title,
      rootTopicKey: this.rootTopicKey,
      topics: Object.values(this.topics.toJS()),
      config: this.config,
      extData: this.extData,
      zoomFactor: this.zoomFactor
    };
  }

  get id(): KeyType {
    return this.get('id');
  }

  get title(): string {
    return this.get('title');
  }

  get extData(): Map<string, any> {
    return this.get('extData');
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
    return this.focusMode === FocusMode.EDITING_CONTENT ? this.focusKey : null;
  }

  get editingDescKey(): KeyType {
    return this.focusMode === FocusMode.EDITING_DESC ? this.focusKey : null;
  }

  getTopic(key: KeyType): Topic {
    return this.topics.get(key);
  }

  getExtDataItem<T>(key: string, c: new () => T): T {
    return this.extData.get(key) || new c();
  }

  getParentTopic(key: KeyType): Topic {
    const topic = this.getTopic(key);
    return topic.parentKey ? this.getTopic(topic.parentKey) : null;
  }

  getTopicVisualLevel(key: KeyType): number {
    let topic = this.getTopic(key);
    let level = 0;
    while (topic && topic.key !== this.editorRootTopicKey) {
      level++;
      topic = this.getParentTopic(topic.key);
    }
    return level;
  }

  get rootTopic() {
    return this.getTopic(this.rootTopicKey);
  }

  get zoomFactor() {
    return this.get('zoomFactor');
  }
}
