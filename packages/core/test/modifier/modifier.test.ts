import { Model, ModelModifier } from '../../src';
import { getAllSubTopicKeys } from '../../src/models/utils';

const { addChild, addSibling, toggleCollapse, deleteTopic } = ModelModifier;

describe('Modifier test', () => {
  beforeAll(() => {});
  beforeEach(() => {});
  it('addChild', () => {
    let model = Model.create();
    const topicKey = model.rootTopicKey;
    model = addChild({ model, topicKey });
    let childKey = model.focusKey;
    expect(childKey).toBe(model.rootTopic.subKeys.last());

    model = addChild({ model, topicKey });
    childKey = model.focusKey;
    expect(childKey).toBe(model.rootTopic.subKeys.last());
    expect(model.rootTopic.subKeys.size).toBe(2);

    model = addChild({ model, topicKey: childKey });
    expect(model.getTopic(childKey).subKeys.size).toBe(1);

    expect(model.topics.size).toBe(4);
  });

  it('addSibling', () => {
    let model = Model.create();
    const topicKey = model.rootTopicKey;
    model = addChild({ model, topicKey });
    const key1 = model.focusKey;
    model = addChild({ model, topicKey });

    model = addSibling({ model, topicKey: key1 });
    const key2 = model.focusKey;

    expect(model.rootTopic.subKeys.indexOf(key2)).toBe(1);
    expect(model.getTopic(key2).parentKey).toBe(model.rootTopic.key);
  });

  it('deleteTopic', () => {
    let model = Model.create();
    const topicKey = model.rootTopicKey;
    model = addChild({ model, topicKey });
    model = addChild({ model, topicKey });
    const key = model.focusKey;
    model = addChild({ model, topicKey: model.focusKey });
    model = addChild({ model, topicKey: model.focusKey });

    expect(model.topics.size).toBe(5);
    expect(getAllSubTopicKeys(model, key).length).toBe(2);
    model = deleteTopic({ model, topicKey: key });
    expect(model.topics.size).toBe(2);
  });

  it('toggleCollapse', () => {
    let model = Model.create();
    const topicKey = model.rootTopicKey;
    model = addChild({ model, topicKey });
    const childKey = model.focusKey;
    model = addChild({ model, topicKey: childKey });
    expect(model.getTopic(childKey).collapse).toBe(false);
    model = toggleCollapse({ model, topicKey: childKey });
    expect(model.getTopic(childKey).collapse).toBe(true);
    model = toggleCollapse({ model, topicKey: childKey });
    expect(model.getTopic(childKey).collapse).toBe(false);
  });
});
