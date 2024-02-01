export function nextTick(cb?: TAnyFunc) {
  const p = new Promise<void>(res => res());
  if (cb) p.then(cb);
  return p;
}
