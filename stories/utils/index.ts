import { Model } from '@blink-mind/core';

export function generateSimpleModel() {
  return Model.create({
    rootTopicKey: 'root',
    topics: [
      { key: 'root', content: 'MainTopic', subKeys: ['sub1', 'sub2'] },
      {
        key: 'sub1',
        parentKey: 'root',
        content: 'SubTopic1',
        subKeys: ['sub1_1', 'sub1_2'],
        collapse: false
      },
      {
        key: 'sub1_1',
        parentKey: 'sub1',
        content: 'SubTopic',
        collapse: false
      },
      {
        key: 'sub1_2',
        parentKey: 'sub1',
        content: 'SubTopic',
        collapse: false
      },
      {
        key: 'sub2',
        subKeys: ['sub2_1', 'sub2_2'],
        parentKey: 'root',
        content: 'SubTopic2'
      },
      {
        key: 'sub2_1',
        parentKey: 'sub2',
        content: 'SubTopic',
        collapse: false
      },
      {
        key: 'sub2_2',
        parentKey: 'sub2',
        content: 'SubTopic',
        collapse: false
      }
    ]
  });
}
