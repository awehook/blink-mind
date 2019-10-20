import { Model, ModelModifier } from '../../src';
import {BlockType} from "../../src/types";
describe('Modifier test', () => {
  it('Model create test', () => {
    let model = Model.create({
      rootTopicKey: 'root',
      topics: [
        { key: 'root', content: 'MainTopic', subKeys: ['sub1', 'sub2'] },
        {
          key: 'sub1',
          parentKey: 'root',
          content: 'SubTopic1',
          collapse: false
        },
        {
          key: 'sub2',
          parentKey: 'root',
          content: 'SubTopic2'
        }
      ]
    });

    expect(model.rootTopicKey).toBe('root');
    expect(model.editorRootTopicKey).toBe('root');
    expect(model.topics.size).toBe(3);
    expect(model.rootTopic.subKeys.toArray()).toStrictEqual(['sub1','sub2']);
    const topicSub1 = model.getTopic('sub1');
    expect(topicSub1.parentKey).toBe('root');
    expect(topicSub1.subKeys.size).toBe(0);
    expect(topicSub1.blocks.size).toBe(1);
    expect(topicSub1.getBlock(BlockType.CONTENT).block.data).toBe('SubTopic1');
  });

  it("temp",()=>{
    const props = {
      key: 'key',
      subKeys: ['sub1','sub2'],
      topic: 'topic'
    };

    const temp = {
      ...props,
      topic: 'topic2'
    };
    console.log(temp);
  })
});
