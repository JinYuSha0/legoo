export type DoubleLinkNode<T = any> = {
  value: T;
  prev: DoubleLinkNode<T> | undefined;
  next: DoubleLinkNode<T> | undefined;
};

export function DoubleLinkNode<T>(
  value?: T,
  prev?: DoubleLinkNode<T>,
  next?: DoubleLinkNode<T>,
) {
  return {
    value: value ?? null,
    prev: prev,
    next: next,
  };
}

export function DoubleLinkList<T = any>(list: T[]): DoubleLinkNode<T>;
export function DoubleLinkList<T = any>(
  list: T[],
  needIndexMap: true,
): [DoubleLinkNode<T>, Map<number, DoubleLinkNode<T>>];
export function DoubleLinkList<T = any>(list: T[], needIndexMap?: true) {
  let head: DoubleLinkNode = DoubleLinkNode<T>(),
    curr: DoubleLinkNode = DoubleLinkNode<T>(),
    indexMap = new Map();
  list.forEach((value, idx) => {
    const node = DoubleLinkNode(value);
    if (needIndexMap) {
      indexMap.set(idx, node);
    }
    if (curr.value !== null) {
      curr.next = node;
    }
    if (head.value === null) {
      head = node;
    }
    if (curr.value === null) {
      curr = node;
    } else {
      node.prev = curr;
      curr = node;
    }
  });
  if (curr.value !== null) curr.next = head;
  if (head.value !== null) head.prev = curr;
  if (needIndexMap) return [head, indexMap];
  return head;
}
