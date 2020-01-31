import { List } from 'immutable';
export function swap<T>(list: List<T>, idx1: number, idx2: number) {
  const size = list.size;
  if (idx1 >= 0 && idx1 < size && idx2 >= 0 && idx2 < size && idx1 !== idx2) {
    const v1 = list.get(idx1);
    const v2 = list.get(idx2);
    return list
      .delete(idx1)
      .insert(idx1, v2)
      .delete(idx2)
      .insert(idx2, v1);
  }
  return list;
}
